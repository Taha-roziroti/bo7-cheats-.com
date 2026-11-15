/**
 * Main editorial HTML for anchor audits (excludes header/footer chrome).
 */
function stripBreadcrumbNav(chunk) {
  return chunk.replace(/<nav[^>]*(?:breadcrumb|data-breadcrumb)[\s\S]*?<\/nav>/gi, '');
}

export function contentBodyHtml(html) {
  const articleWithMarkdown = html.match(
    /<article[^>]*class="[^"]*\bcontent-markdown\b[^"]*"[\s\S]*?<\/article>/i,
  )?.[0];
  if (articleWithMarkdown) return articleWithMarkdown;

  const markdownParts = [];
  const divRe = /<div[^>]*class="[^"]*\bcontent-markdown\b[^"]*"[^>]*>[\s\S]*?<\/div>/gi;
  let dm;
  while ((dm = divRe.exec(html)) !== null) {
    markdownParts.push(dm[0]);
  }
  if (markdownParts.length) return markdownParts.join('\n');

  const overview = html.match(/id="abi-overview"[\s\S]*?<\/section>/i)?.[0];
  if (overview) return overview;

  const faqSection = html.match(/data-faq-section[\s\S]*?<\/section>/i)?.[0];
  if (faqSection) return faqSection;

  const legalArticle = html.match(
    /<article class="border-b border-border bg-muted\/20[\s\S]*?<\/article>/i,
  )?.[0];
  if (legalArticle) return stripBreadcrumbNav(legalArticle);

  if (html.includes('support-page-title')) {
    const main = html.match(/<main[^>]*id="main-content"[\s\S]*?<\/main>/i)?.[0];
    if (main) return stripBreadcrumbNav(main);
  }

  const supportSection = html.match(/<section[^>]*id="support"[\s\S]*?<\/section>/i)?.[0];
  if (supportSection) return supportSection;

  return '';
}