import { marked } from 'marked';
import fm from 'front-matter';
import hljs from 'highlight.js';
import { format } from 'date-fns';

export class MarkdownProcessor {
  constructor(config) {
    this.config = config;
    this.setupMarked();
  }

  setupMarked() {
    // Configure syntax highlighting
    marked.setOptions({
      highlight: (code, lang) => {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(code, { language: lang }).value;
          } catch (err) {
            console.error('Highlight error:', err);
          }
        }
        return code;
      },
      breaks: true,
      gfm: true,
    });

    // Custom renderer for enhanced features
    const renderer = new marked.Renderer();
    const slugifyHeading = (value = '') => {
      const plainText = value.replace(/<[^>]*>/g, '');
      return plainText.toLowerCase()
        .replace(/&#39;|&apos;|'/g, '') // Remove apostrophes
        .replace(/&quot;|"/g, '') // Remove quotes
        .replace(/&amp;/g, 'and') // Convert ampersands
        .replace(/[^\w\s-]/g, '') // Remove other special chars
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Remove duplicate hyphens
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    };
    this.slugifyHeading = slugifyHeading;
    
    // Add anchor links to headings
    renderer.heading = (text, level) => {
      const escapedText = slugifyHeading(text);
      return `<h${level} id="${escapedText}">
        <a href="#${escapedText}" class="heading-anchor">#</a>
        ${text}
      </h${level}>`;
    };

    // External links open in new tab
    renderer.link = (href, title, text) => {
      const isExternal = href.startsWith('http');
      const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      const titleAttr = title ? ` title="${title}"` : '';
      return `<a href="${href}"${titleAttr}${target}>${text}</a>`;
    };

    renderer.image = (href, title, text) => {
      const safeHref = sanitizeUrl(href) || '';
      const alt = escapeHtml(text);
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
      return `<img src="${safeHref}" alt="${alt}" loading="lazy" decoding="async"${titleAttr}>`;
    };

    const escapeHtml = (str = '') => str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    const slugifyFileName = (str = '') => {
      const base = str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60);
      return base || 'download';
    };

    const sanitizeUrl = (url = '') => {
      const trimmed = url.trim();
      if (!trimmed) return null;
      const lower = trimmed.toLowerCase();
      if (lower.startsWith('javascript:') || lower.startsWith('data:')) {
        return null;
      }
      return trimmed.replace(/"/g, '&quot;');
    };

    const installExtension = {
      name: 'install',
      level: 'block',
      start(src) {
        const match = src.match(/::: ?install/);
        return match ? match.index : undefined;
      },
      tokenizer(src) {
        const rule = /^::: ?install[ \t]*\n([\s\S]+?)\n:::[ \t]*\n?/;
        const match = rule.exec(src);
        if (!match) return;

        const inner = match[1].trim();
        if (!inner) return;

        const lines = inner.split('\n').map(line => line.trim()).filter(Boolean);
        if (!lines.length) return;

        const linkLine = lines[0];
        const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)/.exec(linkLine);
        if (!linkMatch) return;

        const [, label, href] = linkMatch;
        const meta = lines.slice(1).join(' ');

        return {
          type: 'install',
          raw: match[0],
          label,
          href,
          meta,
          tokens: [],
        };
      },
      renderer(token) {
        const safeHref = sanitizeUrl(token.href) || '#';
        const metaText = token.meta?.trim();
        const metaHtml = metaText
          ? `<div class="install-meta">${escapeHtml(metaText)}</div>`
          : '';
        const fileHint = slugifyFileName(token.label);

        return `<div class="install-card">
  <div class="install-copy">
    <div class="install-eyebrow">Install</div>
    <div class="install-title">${escapeHtml(token.label)}</div>
    ${metaHtml}
  </div>
  <a class="install-button" href="${safeHref}" data-download-url="${safeHref}" data-filename="${fileHint}" download>
    <span class="install-button-text">Download</span>
    <span class="install-button-icon" aria-hidden="true">&#8681;</span>
  </a>
</div>`;
      },
    };

    marked.use({ renderer, extensions: [installExtension] });
  }

  async process(content) {
    // Parse frontmatter
    const { attributes, body } = fm(content);
    
    // Convert markdown to HTML
    const html = marked.parse(body);
    
    // Calculate reading time
    const readingTime = this.calculateReadingTime(body);
    
    // Generate excerpt
    const excerpt = this.generateExcerpt(body, attributes.excerpt);
    
    // Generate table of contents (enabled by default)
    const toc = this.config.features?.tableOfContents !== false ? this.generateTOC(body) : null;
    
    return {
      html,
      data: {
        ...attributes,
        readingTime,
        excerpt,
        toc,
        formattedDate: attributes.date ? format(new Date(attributes.date), this.config.blog?.dateFormat || 'MMMM dd, yyyy') : null,
      },
    };
  }

  calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  }

  generateExcerpt(text, customExcerpt) {
    if (customExcerpt) return customExcerpt;
    
    const length = this.config.blog?.excerptLength || 200;
    const stripped = text.replace(/[#*`\[\]]/g, '').trim();
    
    if (stripped.length <= length) return stripped;
    return stripped.substring(0, length).trim() + '...';
  }

  generateTOC(markdown) {
    const headings = [];
    const lines = markdown.split('\n');
    
    for (const line of lines) {
      const match = line.match(/^(#{2,4})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].replace(/\*\*/g, '').replace(/\*/g, '').trim();
        const id = this.slugifyHeading 
          ? this.slugifyHeading(text)
          : text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        headings.push({ level, text, id });
      }
    }
    
    return headings.length > 0 ? headings : null;
  }
}
