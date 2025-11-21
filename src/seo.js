import { Feed } from 'feed';
import { formatDate } from './utils.js';

/**
 * Generate SEO meta tags for a page
 */
export function generateMetaTags(page, config) {
  const title = page.title ? `${page.title} | ${config.site.title}` : config.site.title;
  const description = page.description || config.site.description;
  const url = `${config.site.url}${page.url || ''}`;
  const image = page.image || config.seo.og_image;
  const imageUrl = image.startsWith('http') ? image : `${config.site.url}${image}`;
  
  const tags = [
    // Basic meta tags
    `<meta charset="UTF-8">`,
    `<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
    `<meta name="description" content="${escapeHtml(description)}">`,
    `<meta name="author" content="${escapeHtml(config.site.author)}">`,
    
    // Keywords
    ...(page.tags || config.seo.keywords || []).map(tag => 
      `<meta name="keywords" content="${escapeHtml(tag)}">`
    ),
    
    // Open Graph
    `<meta property="og:type" content="${page.type || 'website'}">`,
    `<meta property="og:title" content="${escapeHtml(title)}">`,
    `<meta property="og:description" content="${escapeHtml(description)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:site_name" content="${escapeHtml(config.site.title)}">`,
    `<meta property="og:image" content="${imageUrl}">`,
    
    // Twitter Card
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeHtml(title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(description)}">`,
    `<meta name="twitter:image" content="${imageUrl}">`,
  ];
  
  if (config.seo.twitter_handle) {
    tags.push(`<meta name="twitter:site" content="${config.seo.twitter_handle}">`);
    tags.push(`<meta name="twitter:creator" content="${config.seo.twitter_handle}">`);
  }
  
  if (page.date) {
    tags.push(`<meta property="article:published_time" content="${new Date(page.date).toISOString()}">`);
  }
  
  if (page.tags) {
    page.tags.forEach(tag => {
      tags.push(`<meta property="article:tag" content="${escapeHtml(tag)}">`);
    });
  }
  
  return tags.join('\n    ');
}

/**
 * Generate JSON-LD structured data
 */
export function generateStructuredData(page, config) {
  const baseData = {
    '@context': 'https://schema.org',
  };
  
  if (page.type === 'post') {
    const structuredData = {
      ...baseData,
      '@type': 'BlogPosting',
      headline: page.title,
      description: page.description || '',
      author: {
        '@type': 'Person',
        name: config.site.author,
        email: config.site.email
      },
      datePublished: page.date ? new Date(page.date).toISOString() : '',
      dateModified: page.modified || page.date ? new Date(page.modified || page.date).toISOString() : '',
      image: page.image || config.seo.og_image,
      publisher: {
        '@type': 'Organization',
        name: config.site.title,
        logo: {
          '@type': 'ImageObject',
          url: `${config.site.url}/images/logo.png`
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${config.site.url}${page.url}`
      }
    };
    
    if (page.tags) {
      structuredData.keywords = page.tags.join(', ');
    }
    
    return `<script type="application/ld+json">\n${JSON.stringify(structuredData, null, 2)}\n</script>`;
  }
  
  // Website/Organization
  const structuredData = {
    ...baseData,
    '@type': 'WebSite',
    name: config.site.title,
    description: config.site.description,
    url: config.site.url,
    author: {
      '@type': 'Person',
      name: config.site.author,
      email: config.site.email
    }
  };
  
  return `<script type="application/ld+json">\n${JSON.stringify(structuredData, null, 2)}\n</script>`;
}

/**
 * Generate XML sitemap
 */
export function generateSitemap(pages, config) {
  const urls = pages.map(page => {
    const url = `${config.site.url}${page.url}`;
    const lastmod = page.modified || page.date ? new Date(page.modified || page.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const priority = page.url === '/' ? '1.0' : page.type === 'post' ? '0.8' : '0.6';
    
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/**
 * Generate RSS feed
 */
export function generateRSSFeed(posts, config) {
  const feed = new Feed({
    title: config.site.title,
    description: config.site.description,
    id: config.site.url,
    link: config.site.url,
    language: config.site.language || 'en',
    image: `${config.site.url}${config.seo.og_image}`,
    favicon: `${config.site.url}/favicon.ico`,
    copyright: `Copyright © ${new Date().getFullYear()} ${config.site.author}`,
    feedLinks: {
      rss: `${config.site.url}/feed.xml`,
      atom: `${config.site.url}/atom.xml`,
      json: `${config.site.url}/feed.json`
    },
    author: {
      name: config.site.author,
      email: config.site.email,
      link: config.site.url
    }
  });
  
  posts.forEach(post => {
    feed.addItem({
      title: post.title,
      id: `${config.site.url}${post.url}`,
      link: `${config.site.url}${post.url}`,
      description: post.description || post.excerpt,
      content: post.content,
      author: [{
        name: post.author || config.site.author,
        email: config.site.email
      }],
      date: new Date(post.date),
      image: post.image ? `${config.site.url}${post.image}` : undefined,
      category: post.tags ? post.tags.map(tag => ({ name: tag })) : []
    });
  });
  
  return {
    rss: feed.rss2(),
    atom: feed.atom1(),
    json: feed.json1()
  };
}

/**
 * Generate robots.txt
 */
export function generateRobotsTxt(config) {
  return `User-agent: *
Allow: /

Sitemap: ${config.site.url}/sitemap.xml`;
}

/**
 * Escape HTML entities
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

