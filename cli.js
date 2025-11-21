#!/usr/bin/env node

import { Command } from 'commander';
import { SiteBuilder } from './lib/builder.js';
import { DevServer } from './lib/server.js';
import { scaffoldProject, createNewPost } from './lib/scaffold.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf-8'));

const program = new Command();

program
  .name('marksite')
  .description('A modern, SEO-friendly markdown static site generator')
  .version(packageJson.version);

program
  .command('init')
  .description('Initialize a new MarkSite project')
  .option('-d, --dir <directory>', 'Target directory', '.')
  .action(async (options) => {
    try {
      await scaffoldProject(options.dir);
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
  .option('-c, --config <path>', 'Config file path', 'config.yaml')
  .option('-w, --watch', 'Watch for changes and rebuild')
  .action(async (options) => {
    try {
      const builder = new SiteBuilder(options.config);
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
  .option('-c, --config <path>', 'Config file path', 'config.yaml')
  .option('-p, --port <port>', 'Port number', '3000')
  .action(async (options) => {
    try {
      const builder = new SiteBuilder(options.config);
      await builder.build();
      
      const server = new DevServer(options.port);
      await server.start();
      
      console.log(`\n✓ Server running at http://localhost:${options.port}`);
      console.log('👀 Watching for changes...\n');
      
      await builder.watch(async () => {
        console.log('🔄 Rebuilding site...');
        await builder.build();
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
  .option('-c, --config <path>', 'Config file path', 'config.yaml')
  .action(async (title, options) => {
    try {
      const filepath = await createNewPost(title, options.config);
      console.log(`✓ Created new post: ${filepath}`);
    } catch (error) {
      console.error('Error creating post:', error.message);
      process.exit(1);
    }
  });

program.parse();

