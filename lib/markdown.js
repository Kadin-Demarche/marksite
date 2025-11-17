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
    
    // Add anchor links to headings
    renderer.heading = (text, level) => {
      // Strip HTML tags and decode entities for cleaner IDs
      const plainText = text.replace(/<[^>]*>/g, '');
      const escapedText = plainText.toLowerCase()
        .replace(/&#39;|&apos;|'/g, '') // Remove apostrophes
        .replace(/&quot;|"/g, '') // Remove quotes
        .replace(/&amp;/g, 'and') // Convert ampersands
        .replace(/[^\w\s-]/g, '') // Remove other special chars
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Remove duplicate hyphens
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
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

    marked.use({ renderer });
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
        // Use same ID generation logic as heading renderer
        const id = text.toLowerCase()
          .replace(/'/g, '') // Remove apostrophes
          .replace(/"/g, '') // Remove quotes
          .replace(/&/g, 'and') // Convert ampersands
          .replace(/[^\w\s-]/g, '') // Remove other special chars
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-') // Remove duplicate hyphens
          .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
        headings.push({ level, text, id });
      }
    }
    
    return headings.length > 0 ? headings : null;
  }
}

