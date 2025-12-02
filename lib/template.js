import nunjucks from 'nunjucks';
import path from 'path';
import { format } from 'date-fns';
import slugify from 'slugify';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { buildAbsoluteBase, normalizeBasePath, normalizeSiteUrl } from './utils/url.js';

export class TemplateRenderer {
  constructor(config) {
    this.config = config;
    const modulePath = fileURLToPath(import.meta.url);
    this.moduleDir = path.dirname(modulePath);
    this.coreTemplatesPath = path.resolve(path.join(this.moduleDir, '..', 'templates'));
    this.basePath = normalizeBasePath(this.config.site?.baseUrl);
    this.siteOrigin = normalizeSiteUrl(this.config.site?.url);
    this.absoluteBaseUrl = buildAbsoluteBase(this.config.site?.url, this.config.site?.baseUrl);
    this.setupNunjucks();
  }

  setupNunjucks() {
    const templatesPath = this.config.build.templates;
    const coreTemplatesPath = this.coreTemplatesPath;
    
    const searchPaths = [templatesPath];
    
    if (templatesPath !== coreTemplatesPath && fs.existsSync(coreTemplatesPath)) {
      searchPaths.push(coreTemplatesPath);
    }
    
    this.env = nunjucks.configure(searchPaths, {
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

    this.env.addFilter('slug', (str) => {
      return slugify(str, { lower: true, strict: true });
    });

    this.env.addFilter('urlencode', (str) => {
      return encodeURIComponent(str);
    });

    // JSON escape filter for JSON-LD schema
    this.env.addFilter('jsonEscape', (str) => {
      if (!str) return '';
      return str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
    });
  }

  async render(template, data) {
    const templateFile = `${template}.html`;

    const normalizedSite = {
      ...this.config.site,
      url: this.siteOrigin,
      baseUrl: this.basePath,
      absoluteBaseUrl: this.absoluteBaseUrl,
    };
    
    // Merge with site config for global access
    const context = {
      ...data,
      site: normalizedSite,
      seo: this.config.seo,
      social: this.config.social || {},
      navigation: this.config.navigation || [],
      features: this.config.features || {},
    };

    try {
      return this.env.render(templateFile, context);
    } catch (error) {
      throw new Error(`Template rendering error (${template}): ${error.message}`);
    }
  }
}
