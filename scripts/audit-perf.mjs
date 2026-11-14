/**
 * Lighthouse median-of-3 runs per template — cursor-seo-audit-prompt §10.
 * Requires Chrome/Chromium and `npx lighthouse` (no lock-in devDependency).
 */
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(root, '..');
const port = Number(process.env.AUDIT_PORT) || 4173;
const base = `http://127.0.0.1:${port}`;

const TEMPLATES = [
  { id: 'home', path: '/' },
  { id: 'cloud-dma', path: '/cloud-dma/' },
  { id: 'hwid-spoofer', path: '/hwid-spoofer/' },
  { id: 'guide', path: '/guides/bo7-cheat-requirements/' },
  { id: 'faq', path: '/faq/' },
  { id: '404', path: '/404/' },
];

const FLOOR = 95;
const runs = Number(process.env.LIGHTHOUSE_RUNS) || 3;

function median(nums) {
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function startServer() {
  return spawn('node', ['scripts/serve.mjs'], {
    cwd: projectRoot,
    env: { ...process.env, PORT: String(port) },
    stdio: 'ignore',
  });
}

function waitForServer(ms = 12000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function runLighthouse(url, formFactor) {
  const out = path.join(projectRoot, 'audit', `lh-${formFactor}-${Buffer.from(url).toString('base64url')}.json`);
  const args = [
    'lighthouse',
    url,
    '--output=json',
    `--output-path=${out}`,
    '--quiet',
    '--chrome-flags=--headless --no-sandbox',
    formFactor === 'mobile' ? '--form-factor=mobile' : '--preset=desktop',
    '--only-categories=performance,accessibility,best-practices,seo',
  ];
  const r = spawnSync('npx', args, { cwd: projectRoot, encoding: 'utf8', shell: true, timeout: 180000 });
  if (r.status !== 0 || !fs.existsSync(out)) {
    return null;
  }
  const report = JSON.parse(fs.readFileSync(out, 'utf8'));
  return {
    performance: (report.categories.performance?.score ?? 0) * 100,
    accessibility: (report.categories.accessibility?.score ?? 0) * 100,
    bestPractices: (report.categories['best-practices']?.score ?? 0) * 100,
    seo: (report.categories.seo?.score ?? 0) * 100,
  };
}

async function main() {
  if (!fs.existsSync(path.join(projectRoot, 'dist', 'index.html'))) {
    console.error('audit-perf: run npm run build first');
    process.exit(1);
  }

  fs.mkdirSync(path.join(projectRoot, 'audit'), { recursive: true });

  const probe = spawnSync('npx', ['lighthouse', '--version'], { shell: true, encoding: 'utf8' });
  if (probe.status !== 0) {
    console.warn('audit-perf: lighthouse unavailable — install Chrome and retry. Skipping with exit 0.');
    process.exit(0);
  }

  const child = startServer();
  await waitForServer();

  const table = [];
  const failures = [];

  try {
    for (const t of TEMPLATES) {
      const fullUrl = t.path === '/404/' ? `${base}/404.html` : `${base}${t.path}`;

      for (const formFactor of ['mobile', 'desktop']) {
        const scores = { performance: [], accessibility: [], bestPractices: [], seo: [] };
        for (let i = 0; i < runs; i++) {
          const row = runLighthouse(fullUrl, formFactor);
          if (!row) {
            failures.push(`${t.id} ${formFactor}: lighthouse run failed`);
            break;
          }
          for (const k of Object.keys(scores)) scores[k].push(row[k]);
        }
        if (!scores.performance.length) continue;

        const med = {
          performance: median(scores.performance),
          accessibility: median(scores.accessibility),
          bestPractices: median(scores.bestPractices),
          seo: median(scores.seo),
        };

        table.push({ template: t.id, formFactor, ...med });

        for (const [cat, val] of Object.entries(med)) {
          if (val < FLOOR) {
            failures.push(`${t.id} ${formFactor} ${cat}: median ${val.toFixed(0)} < ${FLOOR}`);
          }
        }
      }
    }
  } finally {
    child.kill('SIGTERM');
  }

  const reportPath = path.join(projectRoot, 'audit', 'lighthouse-summary.json');
  fs.writeFileSync(reportPath, `${JSON.stringify({ floor: FLOOR, runs, results: table }, null, 2)}\n`);

  console.log('audit-perf: Lighthouse medians (see audit/lighthouse-summary.json)');
  for (const row of table) {
    console.log(
      `  ${row.template} ${row.formFactor}: perf ${row.performance.toFixed(0)} a11y ${row.accessibility.toFixed(0)} bp ${row.bestPractices.toFixed(0)} seo ${row.seo.toFixed(0)}`,
    );
  }

  if (failures.length) {
    console.error('\naudit-perf failed:\n' + failures.map((f) => `  - ${f}`).join('\n'));
    process.exit(1);
  }

  console.log('audit-perf: OK');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});