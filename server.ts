import { createServer } from 'http';
import { join } from 'path';
import { parse, UrlWithParsedQuery } from 'url';
import { promises as fs } from 'fs';
import next from 'next';
import { initSocket } from './lib/socket';

process.env.TZ = 'UTC';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    const parsedUrl: UrlWithParsedQuery = parse(req.url!, true);
    const { pathname } = parsedUrl;

    if (pathname === '/sw.js' || /^\/(workbox|worker|fallback)-\w+\.js$/.test(pathname || '')) {
      const filePath = join(__dirname, '.next', pathname || '');
      try {
        const file = await fs.readFile(filePath);
        res.setHeader('Content-Type', 'application/javascript');
        res.end(file);
      } catch (err) {
        res.statusCode = 404;
        res.end('File not found');
      }
    } else if (pathname?.startsWith('/socket.io')) {
      // Let Socket.IO handle the request
      res.statusCode = 200;
      res.end();
    } else {
      handle(req, res);
    }
  });

  initSocket(server);

  server.listen(3000, (err?: Error) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
