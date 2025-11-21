import fs from 'fs-extra';
import path from 'path';

export class SearchIndexGenerator {
  constructor(config) {
    this.config = config;
  }

  generate(posts) {
    // Create search index with all necessary data
    const searchIndex = {
      posts: posts.map(post => ({
        title: post.title,
        url: post.url,
        excerpt: post.excerpt,
        content: this.stripHtml(post.content),
        tags: post.tags || [],
        author: post.author,
        date: post.date.toISOString(),
        formattedDate: post.formattedDate,
        readingTime: post.readingTime,
      })),
      tags: this.extractAllTags(posts),
    };

    return JSON.stringify(searchIndex);
  }

  extractAllTags(posts) {
    const tagMap = new Map();
    
    posts.forEach(post => {
      (post.tags || []).forEach(tag => {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, {
            name: tag,
            count: 0,
            url: `/tag/${tag}/`,
          });
        }
        tagMap.get(tag).count++;
      });
    });

    return Array.from(tagMap.values()).sort((a, b) => b.count - a.count);
  }

  stripHtml(html) {
    // Remove HTML tags and extra whitespace
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 5000); // Limit content length for performance
  }

  async write(posts, destination) {
    const searchData = this.generate(posts);
    const outputPath = path.join(destination, 'search-index.json');
    await fs.writeFile(outputPath, searchData);
  }
}

