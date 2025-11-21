import MarkdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItAttrs from 'markdown-it-attrs';
import markdownItToc from 'markdown-it-table-of-contents';
import slugify from 'slugify';

/**
 * Configure and create a Markdown parser with plugins
 */
export function createMarkdownParser() {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
      if (lang) {
        return `<pre class="language-${lang}"><code class="language-${lang}">${md.utils.escapeHtml(str)}</code></pre>`;
      }
      return `<pre><code>${md.utils.escapeHtml(str)}</code></pre>`;
    }
  });

  // Add anchor links to headings
  md.use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.ariaHidden({
      placement: 'before',
      symbol: '#',
      class: 'heading-anchor'
    }),
    slugify: (s) => slugify(s, { lower: true, strict: true })
  });

  // Add attributes to elements
  md.use(markdownItAttrs);

  // Add table of contents support
  md.use(markdownItToc, {
    includeLevel: [2, 3, 4],
    slugify: (s) => slugify(s, { lower: true, strict: true })
  });

  return md;
}

/**
 * Parse markdown content to HTML
 */
export function parseMarkdown(content) {
  const md = createMarkdownParser();
  return md.render(content);
}

/**
 * Extract excerpt from markdown content
 */
export function extractExcerpt(content, length = 160) {
  const md = new MarkdownIt();
  const html = md.render(content);
  // Strip HTML tags
  const text = html.replace(/<[^>]*>/g, '');
  // Get first N characters
  const excerpt = text.slice(0, length);
  return excerpt.length < text.length ? excerpt + '...' : excerpt;
}

/**
 * Estimate reading time for content
 */
export function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return {
    minutes,
    words: wordCount,
    text: `${minutes} min read`
  };
}

