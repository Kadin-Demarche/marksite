import express from 'express';
import path from 'path';
import chokidar from 'chokidar';
import chalk from 'chalk';
import { SiteBuilder } from './builder.js';

/**
 * Development server with live reload
 */
export class DevServer {
  constructor(siteDir = process.cwd(), port = 3000) {
    this.siteDir = siteDir;
    this.port = port;
    this.builder = new SiteBuilder(siteDir);
    this.app = express();
    this.isBuilding = false;
  }

  /**
   * Start the development server
   */
  async start() {
    console.log(chalk.bold.blue('\n🚀 Starting development server...\n'));
    
    // Initial build
    await this.rebuild();
    
    // Setup file watcher
    this.setupWatcher();
    
    // Setup express server
    const outputDir = path.join(this.siteDir, this.builder.config.build.output_dir);
    this.app.use(express.static(outputDir));
    
    // Handle SPA-style routing
    this.app.get('*', (req, res) => {
      const filePath = path.join(outputDir, req.path, 'index.html');
      if (require('fs').existsSync(filePath)) {
        res.sendFile(filePath);
      } else {
        res.status(404).sendFile(path.join(outputDir, '404.html'));
      }
    });
    
    // Start server
    this.app.listen(this.port, () => {
      console.log(chalk.bold.green('\n✨ Server started!\n'));
      console.log(chalk.blue(`   Local: http://localhost:${this.port}`));
      console.log(chalk.gray('\n   Watching for changes...\n'));
    });
  }

  /**
   * Setup file watcher for auto-rebuild
   */
  setupWatcher() {
    const watchPaths = [
      path.join(this.siteDir, 'content/**/*.md'),
      path.join(this.siteDir, 'themes/**/*'),
      path.join(this.siteDir, 'config.yml')
    ];
    
    const watcher = chokidar.watch(watchPaths, {
      ignored: /(^|[\/\\])\../,
      persistent: true,
      ignoreInitial: true
    });
    
    // Debounce rebuild
    let rebuildTimeout;
    const debouncedRebuild = () => {
      clearTimeout(rebuildTimeout);
      rebuildTimeout = setTimeout(() => this.rebuild(), 300);
    };
    
    watcher
      .on('change', (file) => {
        console.log(chalk.yellow(`\n📝 Changed: ${path.relative(this.siteDir, file)}`));
        debouncedRebuild();
      })
      .on('add', (file) => {
        console.log(chalk.green(`\n✨ Added: ${path.relative(this.siteDir, file)}`));
        debouncedRebuild();
      })
      .on('unlink', (file) => {
        console.log(chalk.red(`\n🗑️  Removed: ${path.relative(this.siteDir, file)}`));
        debouncedRebuild();
      });
  }

  /**
   * Rebuild the site
   */
  async rebuild() {
    if (this.isBuilding) {
      return;
    }
    
    this.isBuilding = true;
    
    try {
      await this.builder.build();
      console.log(chalk.green('✓ Rebuild complete'));
    } catch (error) {
      console.error(chalk.red('✗ Build error:'), error.message);
    } finally {
      this.isBuilding = false;
    }
  }
}

