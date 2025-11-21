import nunjucks from 'nunjucks';
import path from 'path';
import { format } from 'date-fns';

export class TemplateRenderer {
  constructor(config) {
    this.config = config;
    this.setupNunjucks();
  }

  setupNunjucks() {
    const templatesPath = this.config.build.templates;
    
    this.env = nunjucks.configure(templatesPath, {
      autoescape: true,
      trimBlocks: true,
      lstripBlocks: true,
    });

    // Add custom filters
    this.env.addFilter('date', (date, dateFormat) => {
      if (!date) return '';
      try {
        const dateObj = date instanceof Date ? date : new Date(date);
        if (isNaN(dateObj.getTime())) return '';
        return format(dateObj, dateFormat || 'MMMM dd, yyyy');
      } catch (err) {
        console.error('Date formatting error:', err);
        return '';
      }
    });

    this.env.addFilter('limit', (array, limit) => {
      return array.slice(0, limit);
    });

    this.env.addFilter('where', (array, key, value) => {
      return array.filter(item => item[key] === value);
    });

    this.env.addFilter('sort_by', (array, key) => {
      return [...array].sort((a, b) => {
        if (a[key] > b[key]) return -1;
        if (a[key] < b[key]) return 1;
        return 0;
      });
    });
  }

  async render(template, data) {
    const templateFile = `${template}.html`;
    
    // Merge with site config for global access
    const context = {
      ...data,
      site: this.config.site,
      seo: this.config.seo,
      social: this.config.social,
      navigation: this.config.navigation,
      features: this.config.features,
    };

    try {
      return this.env.render(templateFile, context);
    } catch (error) {
      throw new Error(`Template rendering error (${template}): ${error.message}`);
    }
  }
}

