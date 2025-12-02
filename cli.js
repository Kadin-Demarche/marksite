#!/usr/bin/env node

import { Command } from 'commander';
import { SiteBuilder } from './lib/builder.js';
import { DevServer } from './lib/server.js';
import { scaffoldProject, createNewPost } from './lib/scaffold.js';
import { migrateToContentDir } from './lib/migrate.js';
import { readFileSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import yaml from 'js-yaml';
import { runDoctor } from './lib/doctor.js';
import { createInterface } from 'readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf-8'));

const program = new Command();

program
  .name('marksite')
  .description('A modern markdown static site generator')
  .version(packageJson.version);

async function resolveContentDir(contentDirOption) {
  let contentDir = contentDirOption;
  
  if (!contentDir) {
    contentDir = process.env.MARKSITE_CONTENT_DIR;
  }
  
  if (!contentDir) {
    const rootConfigPath = resolve('config.yaml');
    if (await fs.pathExists(rootConfigPath)) {
      try {
        const rootConfig = yaml.load(await fs.readFile(rootConfigPath, 'utf-8'));
        if (rootConfig.contentDir) {
          contentDir = rootConfig.contentDir;
        }
      } catch (e) {
      }
    }
  }
  
  if (!contentDir) {
    const oldContentPath = resolve('content');
    if (await fs.pathExists(oldContentPath)) {
      contentDir = './';
      console.log('⚠️  Using legacy content structure (./content). Consider migrating to --content-dir');
    } else {
      contentDir = './blog-data';
    }
  }
  
  return resolve(contentDir);
}

program
  .command('init')
  .description('Initialize a new MarkSite project')
  .option('-d, --dir <directory>', 'Target directory', '.')
  .option('-c, --content-dir <path>', 'Content directory (optional)')
  .option('-p, --preset <name>', 'Starter preset: blog|docs|landing')
  .action(async (options) => {
    try {
      await scaffoldProject(options.dir, options.contentDir, options.preset);
      console.log('✓ Project initialized successfully!');
      console.log('\nNext steps:');
      console.log('  1. Edit config.yaml to customize your site');
      console.log('  2. Run "npm run build" to build your site');
      console.log('  3. Run "npm run serve" to preview locally');
    } catch (error) {
      console.error('Error initializing project:', error.message);
      process.exit(1);
    }
  });

program
  .command('build')
  .description('Build the static site')
  .option('-d, --content-dir <path>', 'Content directory')
  .option('-w, --watch', 'Watch for changes and rebuild')
  .action(async (options) => {
    try {
      const contentDir = await resolveContentDir(options.contentDir);
      const builder = new SiteBuilder(contentDir);
      await builder.build();
      console.log('✓ Site built successfully!');
      
      if (options.watch) {
        console.log('\n👀 Watching for changes...');
        await builder.watch();
      }
    } catch (error) {
      console.error('Error building site:', error.message);
      process.exit(1);
    }
  });

program
  .command('serve')
  .description('Start development server')
  .option('-d, --content-dir <path>', 'Content directory')
  .option('-p, --port <port>', 'Port number', '3000')
  .action(async (options) => {
    try {
      const contentDir = await resolveContentDir(options.contentDir);
      const builder = new SiteBuilder(contentDir);
      await builder.build();
      
      const server = new DevServer(options.port, builder.config.build.destination);
      await server.start();
      
      console.log(`\n✓ Server running at http://localhost:${options.port}`);
      console.log('👀 Watching for changes...\n');
      
      await builder.watch(async () => {
        console.log('🔄 Rebuilding site...');
        await builder.build();
        server.broadcastReload();
        console.log('✓ Site rebuilt!');
      });
    } catch (error) {
      console.error('Error starting server:', error.message);
      process.exit(1);
    }
  });

program
  .command('new')
  .description('Create a new blog post')
  .argument('<title>', 'Post title')
  .option('-d, --content-dir <path>', 'Content directory')
  .action(async (title, options) => {
    try {
      const contentDir = await resolveContentDir(options.contentDir);
      const filepath = await createNewPost(title, contentDir);
      console.log(`✓ Created new post: ${filepath}`);
    } catch (error) {
      console.error('Error creating post:', error.message);
      process.exit(1);
    }
  });

program
  .command('migrate')
  .description('Migrate existing MarkSite project to new content directory structure')
  .option('-d, --dir <directory>', 'Project directory', '.')
  .option('-n, --name <name>', 'Content directory name', 'blog-data')
  .action(async (options) => {
    try {
      await migrateToContentDir(options.dir, options.name);
    } catch (error) {
      console.error('Error during migration:', error.message);
      process.exit(1);
    }
  });

program
  .command('clean')
  .description('Remove generated site output (build destination)')
  .option('-d, --content-dir <path>', 'Content directory')
  .action(async (options) => {
    try {
      const contentDir = await resolveContentDir(options.contentDir);
      const builder = new SiteBuilder(contentDir);
      await fs.remove(builder.config.build.destination);
      console.log(`✓ Removed build output at ${builder.config.build.destination}`);
    } catch (error) {
      console.error('Error cleaning build output:', error.message);
      process.exit(1);
    }
  });

program
  .command('clearcontent')
  .description('Remove your blog content (backup before proceeding!)')
  .option('-d, --content-dir <path>', 'Content directory')
  .option('-f, --force', 'Skip confirmation prompt')
  .action(async (options) => {
    try {
      const contentDir = await resolveContentDir(options.contentDir);
      const builder = new SiteBuilder(contentDir);
      const sourceDir = builder.config.build.source;

      if (!options.force) {
        const confirmed = await confirmPrompt(
          `This will delete all markdown content under ${sourceDir}. Continue? (y/N)`
        );
        if (!confirmed) {
          console.log('Aborted.');
          return;
        }
      }

      await fs.remove(sourceDir);
      await fs.ensureDir(sourceDir);
      await fs.ensureDir(join(sourceDir, 'posts'));
      await fs.remove(join(contentDir, '.marksite-cache.json'));

      console.log(`✓ Removed content at ${sourceDir} and recreated an empty content/posts structure`);
    } catch (error) {
      console.error('Error clearing content:', error.message);
      process.exit(1);
    }
  });

program
  .command('doctor')
  .description('Check your project for common issues')
  .option('-d, --content-dir <path>', 'Content directory')
  .action(async (options) => {
    try {
      const contentDir = await resolveContentDir(options.contentDir);
      const report = await runDoctor(contentDir);

      console.log('\nMarkSite Doctor Report\n---------------------');
      if (report.errors.length === 0 && report.warnings.length === 0) {
        console.log('✓ No issues found');
      }

      if (report.errors.length) {
        console.log('\nErrors:');
        report.errors.forEach(err => console.log(`- ${err}`));
      }

      if (report.warnings.length) {
        console.log('\nWarnings:');
        report.warnings.forEach(w => console.log(`- ${w}`));
      }

      if (report.info.length) {
        console.log('\nInfo:');
        report.info.forEach(i => console.log(`- ${i}`));
      }

      if (report.errors.length) {
        process.exit(1);
      }
    } catch (error) {
      console.error('Error running doctor:', error.message);
      process.exit(1);
    }
  });

function confirmPrompt(question) {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(`${question} `, (answer) => {
      rl.close();
      const normalized = (answer || '').trim().toLowerCase();
      resolve(normalized === 'y' || normalized === 'yes');
    });
  });
}

program.parse();
