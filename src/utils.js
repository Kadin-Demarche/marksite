import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import frontMatter from 'front-matter';
import slugify from 'slugify';
import { format, parse } from 'date-fns';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get the root directory of the project
 */
export function getRootDir() {
  return path.join(__dirname, '..');
}

/**
 * Read and parse a markdown file with front matter
 */
export async function readMarkdownFile(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const { attributes, body } = frontMatter(content);
  
  return {
    frontMatter: attributes,
    content: body,
    filePath
  };
}

/**
 * Get all markdown files from a directory
 */
export async function getMarkdownFiles(dir) {
  if (!await fs.pathExists(dir)) {
    return [];
  }
  
  const files = await fs.readdir(dir);
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(dir, file));
}

/**
 * Create a URL-friendly slug from text
 */
export function createSlug(text) {
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  });
}

/**
 * Format a date
 */
export function formatDate(date, formatStr = 'MMMM d, yyyy') {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return format(date, formatStr);
}

/**
 * Parse a date from string
 */
export function parseDate(dateStr) {
  return new Date(dateStr);
}

/**
 * Copy directory recursively
 */
export async function copyDir(src, dest) {
  await fs.copy(src, dest, {
    overwrite: true,
    errorOnExist: false
  });
}

/**
 * Ensure directory exists
 */
export async function ensureDir(dir) {
  await fs.ensureDir(dir);
}

/**
 * Clean directory (remove all contents)
 */
export async function cleanDir(dir) {
  if (await fs.pathExists(dir)) {
    await fs.remove(dir);
  }
  await fs.ensureDir(dir);
}

/**
 * Write JSON file
 */
export async function writeJson(filePath, data) {
  await fs.writeJson(filePath, data, { spaces: 2 });
}

/**
 * Read JSON file
 */
export async function readJson(filePath) {
  if (!await fs.pathExists(filePath)) {
    return null;
  }
  return await fs.readJson(filePath);
}

/**
 * Get relative path between two paths
 */
export function getRelativePath(from, to) {
  return path.relative(from, to);
}

/**
 * Paginate an array
 */
export function paginate(items, page = 1, perPage = 10) {
  const offset = (page - 1) * perPage;
  const paginatedItems = items.slice(offset, offset + perPage);
  const totalPages = Math.ceil(items.length / perPage);
  
  return {
    items: paginatedItems,
    page,
    perPage,
    totalPages,
    totalItems: items.length,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
}

/**
 * Group items by a key
 */
export function groupBy(items, key) {
  return items.reduce((groups, item) => {
    const value = typeof key === 'function' ? key(item) : item[key];
    if (!groups[value]) {
      groups[value] = [];
    }
    groups[value].push(item);
    return groups;
  }, {});
}

/**
 * Sort items by date (descending)
 */
export function sortByDate(items, dateKey = 'date') {
  return items.sort((a, b) => {
    const dateA = new Date(a[dateKey]);
    const dateB = new Date(b[dateKey]);
    return dateB - dateA;
  });
}

/**
 * Load YAML config file (simple implementation)
 */
export async function loadConfig(configPath) {
  if (!await fs.pathExists(configPath)) {
    return getDefaultConfig();
  }
  
  const content = await fs.readFile(configPath, 'utf-8');
  return parseYamlSimple(content);
}

/**
 * Simple YAML parser (handles basic cases)
 */
function parseYamlSimple(content) {
  const config = {};
  const lines = content.split('\n');
  let currentSection = config;
  let currentKey = null;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    if (line.match(/^\w+:/)) {
      // Top level key
      const [key, value] = trimmed.split(':').map(s => s.trim());
      if (value) {
        config[key] = parseValue(value);
      } else {
        config[key] = {};
        currentSection = config[key];
        currentKey = key;
      }
    } else if (line.match(/^  \w+:/)) {
      // Nested key
      const [key, value] = trimmed.split(':').map(s => s.trim());
      currentSection[key] = parseValue(value);
    }
  }
  
  return config;
}

function parseValue(value) {
  if (!value || value === '') return '';
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (!isNaN(value)) return Number(value);
  return value.replace(/["']/g, '');
}

/**
 * Get default configuration
 */
export function getDefaultConfig() {
  return {
    site: {
      title: 'My Blog',
      description: 'A blog powered by MarkSite',
      url: 'https://yourusername.github.io',
      author: 'Your Name',
      email: 'your.email@example.com',
      language: 'en'
    },
    seo: {
      twitter_handle: '',
      og_image: '/images/og-image.jpg',
      keywords: ['blog', 'markdown', 'static site']
    },
    build: {
      posts_per_page: 10,
      output_dir: '_site',
      excerpt_length: 160
    },
    theme: 'default'
  };
}

