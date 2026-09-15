export interface ParsedSection {
  number: number;
  title: string;
  rawTitle: string;
  content: string;
}

export function parseBriefSections(markdown: string): ParsedSection[] {
  if (!markdown) return [];

  const sectionRegex = /^##\s+(\d+)\.\s+([^\n\r]+)/gm;
  const matches: { number: number; title: string; index: number; fullMatch: string }[] = [];
  let match: RegExpExecArray | null;

  while ((match = sectionRegex.exec(markdown)) !== null) {
    matches.push({
      number: parseInt(match[1], 10),
      title: match[2].trim(),
      index: match.index,
      fullMatch: match[0],
    });
  }

  if (matches.length === 0) {
    // If numbering format slightly varied, fallback to any ## heading
    const altRegex = /^##\s+([^\n\r]+)/gm;
    let idx = 1;
    while ((match = altRegex.exec(markdown)) !== null) {
      matches.push({
        number: idx++,
        title: match[1].trim(),
        index: match.index,
        fullMatch: match[0],
      });
    }
  }

  const sections: ParsedSection[] = [];

  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const startIndex = current.index + current.fullMatch.length;
    const endIndex = i + 1 < matches.length ? matches[i + 1].index : markdown.length;
    const content = markdown.slice(startIndex, endIndex).trim();

    sections.push({
      number: current.number,
      title: current.title,
      rawTitle: current.fullMatch,
      content,
    });
  }

  return sections;
}

export function extractChecklistItems(section14Content: string): string[] {
  if (!section14Content) return [];
  const lines = section14Content.split(/\r?\n/);
  const items: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // match - [ ] Item, - [x] Item, - Item, * Item, 1. Item
    const match = trimmed.match(/^(?:-\s*\[[ xX]?\]|\*|\d+\.|\-)\s+(.+)$/);
    if (match && match[1]) {
      items.push(match[1].replace(/^\*\*|\*\*$/g, "").trim());
    }
  }

  return items;
}

export function downloadAsFile(filename: string, text: string, mimeType = "text/markdown") {
  const element = document.createElement("a");
  const file = new Blob([text], { type: mimeType });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
