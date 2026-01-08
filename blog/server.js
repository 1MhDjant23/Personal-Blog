import http from 'node:http';
import handler from './utils/handler.js';
import url from 'node:url';

import { dirname } from 'node:path';

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  handler(req, res)
    .catch(err => {
      res.statusCode = 500;
      res.end('Internal Server Error')
      console.error(err);
    });
});
server.listen(PORT, () => console.log("server starting..."));

export const __dirname = dirname(url.fileURLToPath(import.meta.url));