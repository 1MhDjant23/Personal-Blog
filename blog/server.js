import http from 'node:http';
import handler from './utils/handler.js';

const PORT = process.env.PORT || 8080;

const server = http.createServer(handler);
server.listen(PORT, () => console.log("server starting..."));