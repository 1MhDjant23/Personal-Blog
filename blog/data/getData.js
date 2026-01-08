import fs from  'node:fs/promises';
import path from 'node:path';
import { __dirname } from '../server.js';

async function getArticle() {
  const filePath = path.resolve(__dirname, 'data', 'articles.json');
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export { getArticle };