import fs from  'node:fs/promises';
import path from 'node:path';
import { __dirname } from '../server.js';
import { type } from 'node:os';
/**
 * 
 * @param {*} articleId 
 * @returns return one obj that match articleId if exist,
 * if not; return empty {}
 */

async function getArticle(articleId) {
  const filePath = path.resolve(__dirname, 'data', 'articles.json');
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    if (Array.isArray(data) && data.every(item => typeof item === 'object' && item !== null)) {
      const article = data.find(item => item.id === Number(articleId));
      return article ? article : {};
    }
    return {};
  } catch (error) {
    console.error(error);
    return {};
  }
}

/**
 * 
 * @returns value to replace placeholder in the home.html template
 */
async function  getHomeData() {
  const filePath = path.resolve(__dirname, 'data', 'homeData.json');
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    return data ? data : {};
  } catch (error) {
    console.error(error);
    return {};
  }
}

export { getArticle, getHomeData };