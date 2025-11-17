import http from 'http';
import handler from 'serve-handler';
import path from 'path';

export class DevServer {
  constructor(port = 3000) {
    this.port = port;
  }

  async start() {
    this.server = http.createServer((request, response) => {
      return handler(request, response, {
        public: '_site',
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
}

