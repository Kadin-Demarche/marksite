import fs from 'fs-extra';
import path from 'path';
import yaml from 'js-yaml';
import fm from 'front-matter';

export async function runDoctor(contentDir) {
  const report = {
    errors: [],
    warnings: [],
    info: [],
  };

  const configPath = path.join(contentDir, 'config.yaml');
  if (!await fs.pathExists(configPath)) {
    report.errors.push(`Missing config.yaml at ${configPath}`);
    return report;
  }

  let config = null;
  try {
    const raw = await fs.readFile(configPath, 'utf-8');
    config = yaml.load(raw);
    report.info.push('Loaded config.yaml');
  } catch (err) {
    report.errors.push(`Failed to parse config.yaml: ${err.message}`);
    return report;
  }

  if (!config.site?.title) report.errors.push('site.title is missing');
  if (!config.site?.url) report.warnings.push('site.url is missing (used for canonical/feeds)');

  const sourceDir = path.resolve(contentDir, config.build?.source || 'content');
  if (!await fs.pathExists(sourceDir)) {
    report.errors.push(`Content source directory not found: ${sourceDir}`);
  } else {
    report.info.push(`Content source found: ${sourceDir}`);
  }

  const destDir = path.resolve(contentDir, config.build?.destination || '_site');
  report.info.push(`Output directory: ${destDir}`);

  const templatesDir = path.resolve(contentDir, config.build?.templates || 'templates');
  if (!await fs.pathExists(templatesDir)) {
    report.warnings.push(`Templates directory not found: ${templatesDir}`);
  }

  const assetsDir = path.resolve(contentDir, config.build?.assets || 'assets');
  if (!await fs.pathExists(assetsDir)) {
    report.warnings.push(`Assets directory not found: ${assetsDir}`);
  }

  // Basic post checks
  const postsDir = path.join(sourceDir, 'posts');
  if (await fs.pathExists(postsDir)) {
    const files = await fs.readdir(postsDir);
    for (const file of files) {
      if (!file.endsWith('.md') && !file.endsWith('.markdown')) continue;
      const raw = await fs.readFile(path.join(postsDir, file), 'utf-8');
      const { attributes } = fm(raw);
      if (!attributes.title) {
        report.errors.push(`Post ${file} is missing a title`);
      }
      if (!attributes.date) {
        report.warnings.push(`Post ${file} is missing a date`);
      }
    }
  } else {
    report.info.push('No posts directory found; skipping post checks.');
  }

  return report;
}
