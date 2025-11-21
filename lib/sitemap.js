export class SitemapGenerator {
  constructor(config) {
    this.config = config;
  }

  generate(posts) {
    const baseUrl = this.config.site.url + (this.config.site.baseUrl || '');
    const urls = [];

    // Add homepage
    urls.push(this.createUrl(baseUrl + '/', new Date(), 'weekly', '1.0'));

    // Add blog index
    urls.push(this.createUrl(baseUrl + '/blog/', new Date(), 'daily', '0.9'));

    // Add posts
    for (const post of posts) {
      urls.push(this.createUrl(
        baseUrl + post.url,
        post.date,
        'monthly',
        '0.8'
      ));
    }

    // Add tags
    const tags = new Set();
    posts.forEach(post => {
      (post.tags || []).forEach(tag => tags.add(tag));
    });

    for (const tag of tags) {
      urls.push(this.createUrl(
        baseUrl + `/tag/${tag}/`,
        new Date(),
        'weekly',
        '0.7'
      ));
    }

    return this.buildXML(urls);
  }

  createUrl(loc, lastmod, changefreq, priority) {
    return { loc, lastmod, changefreq, priority };
  }

  buildXML(urls) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (const url of urls) {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXML(url.loc)}</loc>\n`;
      xml += `    <lastmod>${url.lastmod.toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
      xml += `    <priority>${url.priority}</priority>\n`;
      xml += '  </url>\n';
    }

    xml += '</urlset>';
    return xml;
  }

  escapeXML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

