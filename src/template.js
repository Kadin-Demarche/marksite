import ejs from 'ejs';
import fs from 'fs-extra';
import path from 'path';

/**
 * Template renderer using EJS
 */
export class TemplateRenderer {
  constructor(themePath) {
    this.themePath = themePath;
    this.cache = new Map();
  }

  /**
   * Render a template with data
   */
  async render(templateName, data) {
    const templatePath = path.join(this.themePath, `${templateName}.ejs`);
    
    if (!await fs.pathExists(templatePath)) {
      throw new Error(`Template not found: ${templatePath}`);
    }

    // Check cache first
    let template = this.cache.get(templatePath);
    
    if (!template) {
      template = await fs.readFile(templatePath, 'utf-8');
      this.cache.set(templatePath, template);
    }

    // Add helper functions to data
    const enhancedData = {
      ...data,
      ...this.getHelpers()
    };

    return ejs.render(template, enhancedData, {
      filename: templatePath,
      cache: false
    });
  }

  /**
   * Get helper functions available in templates
   */
  getHelpers() {
    return {
      formatDate: (date, format = 'MMMM d, yyyy') => {
        if (typeof date === 'string') {
          date = new Date(date);
        }
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      },
      
      excerpt: (text, length = 160) => {
        if (text.length <= length) return text;
        return text.slice(0, length).trim() + '...';
      },
      
      urlJoin: (...parts) => {
        return parts
          .map(part => part.replace(/^\/|\/$/g, ''))
          .filter(Boolean)
          .join('/');
      },
      
      escapeHtml: (text) => {
        const map = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
      },
      
      truncateWords: (text, maxWords = 50) => {
        const words = text.split(/\s+/);
        if (words.length <= maxWords) return text;
        return words.slice(0, maxWords).join(' ') + '...';
      }
    };
  }

  /**
   * Clear template cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Render a string template
   */
  renderString(template, data) {
    const enhancedData = {
      ...data,
      ...this.getHelpers()
    };
    return ejs.render(template, enhancedData);
  }
}

/**
 * Create a template renderer instance
 */
export function createRenderer(themePath) {
  return new TemplateRenderer(themePath);
}

