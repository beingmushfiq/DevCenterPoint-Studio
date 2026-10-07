/**
 * Minimal Markdown renderer for CMS article bodies.
 *
 * The blog stores Markdown in `posts.body` and no Markdown dependency is
 * installed. Rather than shipping a package that must also survive the inlined
 * SSR bundle, this covers the subset the CMS actually writes: ATX headings,
 * ordered/unordered lists, paragraphs, inline code, bold, italic and links.
 *
 * Everything is HTML-escaped *before* inline formatting is applied, so a
 * malicious or accidental `<script>` in the CMS can never reach the DOM. The
 * output is intended for `dangerouslySetInnerHTML`.
 */

const CODE_CLASS =
  'px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 font-mono text-[0.85em] text-slate-800 dark:text-neutral-200';

const LINK_CLASS =
  'text-blue-600 dark:text-blue-400 font-semibold underline decoration-blue-300 dark:decoration-blue-700 underline-offset-2 hover:decoration-blue-500 transition-colors';

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Only allow hrefs that cannot execute script. */
function safeHref(url: string): string {
  return /^(https?:\/\/|\/|#|mailto:)/i.test(url.trim()) ? url.trim() : '#';
}

/** Inline span formatting. Input is already HTML-escaped. */
function renderInline(escaped: string): string {
  return escaped
    .replace(/`([^`]+)`/g, `<code class="${CODE_CLASS}">$1</code>`)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label: string, href: string) => {
      const external = /^https?:\/\//i.test(href.trim());
      const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${safeHref(href)}" class="${LINK_CLASS}"${attrs}>${label}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
}

function renderListItem(raw: string): string {
  return `<li class="pl-1">${renderInline(escapeHtml(raw))}</li>`;
}

/**
 * Convert a Markdown string into an HTML string. Safe to run on the server:
 * it is pure string manipulation with no DOM access.
 */
export function renderMarkdown(markdown: string): string {
  const lines = String(markdown ?? '').replace(/\r\n/g, '\n').split('\n');
  const html: string[] = [];

  // Buffer for the contiguous list currently being accumulated.
  let listType: 'ul' | 'ol' | null = null;
  let listItems: string[] = [];
  // Buffer for the paragraph currently being accumulated.
  let paragraph: string[] = [];

  const flushList = () => {
    if (listType && listItems.length) {
      const listClass =
        listType === 'ol'
          ? 'list-decimal pl-6 space-y-2 my-5 marker:text-blue-600 dark:marker:text-blue-400 marker:font-semibold'
          : 'list-disc pl-6 space-y-2 my-5 marker:text-blue-600 dark:marker:text-blue-400';
      html.push(`<${listType} class="${listClass}">${listItems.join('')}</${listType}>`);
    }
    listType = null;
    listItems = [];
  };

  const flushParagraph = () => {
    if (paragraph.length) {
      html.push(
        `<p class="my-5 leading-relaxed text-slate-700 dark:text-neutral-300">${renderInline(
          escapeHtml(paragraph.join(' '))
        )}</p>`
      );
    }
    paragraph = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === '') {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = /^(#{2,4})\s+(.*)$/.exec(trimmed);
    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length;
      const text = renderInline(escapeHtml(heading[2]));
      if (level === 2) {
        html.push(
          `<h2 class="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-12 mb-4 scroll-mt-28">${text}</h2>`
        );
      } else {
        html.push(
          `<h3 class="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-9 mb-3 scroll-mt-28">${text}</h3>`
        );
      }
      continue;
    }

    const ordered = /^\d+\.\s+(.*)$/.exec(trimmed);
    if (ordered) {
      flushParagraph();
      if (listType !== 'ol') {
        flushList();
        listType = 'ol';
      }
      listItems.push(renderListItem(ordered[1]));
      continue;
    }

    const unordered = /^[-*]\s+(.*)$/.exec(trimmed);
    if (unordered) {
      flushParagraph();
      if (listType !== 'ul') {
        flushList();
        listType = 'ul';
      }
      listItems.push(renderListItem(unordered[1]));
      continue;
    }

    flushList();
    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();

  return html.join('\n');
}

/** Strip Markdown syntax to plain text, for excerpts and meta descriptions. */
export function markdownToPlainText(markdown: string): string {
  return String(markdown ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Truncate on a word boundary for use in meta descriptions. */
export function truncate(text: string, max = 160): string {
  const clean = text.trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' ')) || cut}…`;
}
