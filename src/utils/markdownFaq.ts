export interface MarkdownFaqItem {
  q: string;
  a: string;
}

/** Parse FAQ blocks after `## …question…` headings (`**Q?**` or `### Q?` + answers). */
export function faqItemsFromMarkdown(body: string): MarkdownFaqItem[] {
  const lines = body.split(/\r?\n/);
  let inSection = false;
  const items: MarkdownFaqItem[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    const trimmed = line.trim();

    if (/^##\s+.*\b(questions?|ask about)\b/i.test(trimmed)) {
      inSection = true;
      continue;
    }
    if (inSection && /^##\s+/.test(trimmed) && !/^###\s+/.test(trimmed)) break;
    if (!inSection) continue;

    const listMatch = trimmed.match(/^[-*]\s+\*\*(.+?)\*\*\s+(.+)$/);
    const boldMatch = trimmed.match(/^\*\*(.+?)\*\*\s*$/);
    const h3Match = trimmed.match(/^###\s+(.+)$/);
    const inlineQ = listMatch?.[1]?.trim();
    const q = inlineQ ?? (boldMatch?.[1] ?? h3Match?.[1])?.trim();
    if (!q) continue;

    const answerParts: string[] = listMatch?.[2] ? [listMatch[2]] : [];

    for (let j = i + 1; j < lines.length; j++) {
      const next = (lines[j] ?? '').trim();
      if (!next) {
        if (answerParts.length) {
          i = j;
          break;
        }
        continue;
      }
      if (
        /^[-*]\s+\*\*.+\*\*/.test(next) ||
        /^\*\*.+\*\*/.test(next) ||
        /^###\s+/.test(next) ||
        /^##\s+/.test(next)
      ) {
        i = j - 1;
        break;
      }
      answerParts.push(next.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'));
      i = j;
    }

    if (q && answerParts.length) {
      items.push({ q, a: answerParts.join(' ').replace(/\s+/g, ' ').trim() });
    }
  }

  return items;
}