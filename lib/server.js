import http from 'http';
import handler from 'serve-handler';
import path from 'path';
import fs from 'fs';

export class DevServer {
  constructor(port = 3000, publicDir = null) {
    this.port = Number(port) || 3000;
    this.publicDir = publicDir ? path.resolve(publicDir) : path.resolve('_site');
    this.clients = new Set();
  }

  async start() {
    const publicDir = this.publicDir;

    if (!fs.existsSync(publicDir)) {
      throw new Error(`Build directory not found at ${publicDir}. Run "marksite build" first.`);
    }
    
    this.server = http.createServer((request, response) => {
      if (request.url === '/__livereload') {
        response.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          'Access-Control-Allow-Origin': '*',
        });
        response.write('\n');
        this.clients.add(response);
        request.on('close', () => {
          this.clients.delete(response);
        });
        return;
      }

      return handler(request, response, {
        public: publicDir,
        cleanUrls: true,
        trailingSlash: true,
      });
    });

    return new Promise((resolve, reject) => {
      // Handle server errors
      this.server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          reject(new Error(`Port ${this.port} is already in use. Please close the other server or use a different port with --port <number>`));
        } else {
          reject(err);
        }
      });

      this.server.listen(this.port, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  stop() {
    if (this.server) {
      this.server.close();
    }
  }

  broadcastReload() {
    const payload = `data: reload\n\n`;
    this.clients.forEach(res => {
      try {
        res.write(payload);
      } catch (err) {
        this.clients.delete(res);
      }
    });
  }
}
