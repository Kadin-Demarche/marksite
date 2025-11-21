export class RSSGenerator {
  constructor(config) {
    this.config = config;
  }

  generate(posts) {
    const sortedPosts = posts
      .sort((a, b) => b.date - a.date)
      .slice(0, 20); // Latest 20 posts

    const baseUrl = this.config.site.url + (this.config.site.baseUrl || '');
    
    let rss = '<?xml version="1.0" encoding="UTF-8"?>\n';
    rss += '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n';
    rss += '  <channel>\n';
    rss += `    <title>${this.escapeXML(this.config.site.title)}</title>\n`;
    rss += `    <description>${this.escapeXML(this.config.site.description)}</description>\n`;
    rss += `    <link>${baseUrl}</link>\n`;
    rss += `    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>\n`;
    rss += `    <language>${this.config.site.language || 'en'}</language>\n`;
    rss += `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n`;

    for (const post of sortedPosts) {
      rss += '    <item>\n';
      rss += `      <title>${this.escapeXML(post.title)}</title>\n`;
      rss += `      <description>${this.escapeXML(post.excerpt || '')}</description>\n`;
      rss += `      <link>${baseUrl}${post.url}</link>\n`;
      rss += `      <guid isPermaLink="true">${baseUrl}${post.url}</guid>\n`;
      rss += `      <pubDate>${post.date.toUTCString()}</pubDate>\n`;
      
      if (post.author) {
        rss += `      <author>${this.escapeXML(this.config.site.email || '')} (${this.escapeXML(post.author)})</author>\n`;
      }
      
      for (const tag of (post.tags || [])) {
        rss += `      <category>${this.escapeXML(tag)}</category>\n`;
      }
      
      rss += '    </item>\n';
    }

    rss += '  </channel>\n';
    rss += '</rss>';

    return rss;
  }

  escapeXML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

