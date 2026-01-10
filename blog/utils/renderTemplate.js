import fs from 'node:fs/promises';
import path from 'node:path';
import { __dirname } from '../server.js';

async function generateArticleListHTML() {
  const filePath = path.resolve(__dirname, 'data', 'articles.json');
  try {
      const articles = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(articles);
      const articleList = `<ul>\n` + data.map( article => `<li><a href="/article?id=${article.id}">${article.title}</a></li>` ).join('\n') + `\n</ul>`;
      return articleList;
  } catch (error) {
    console.log(error);
    return `<p>there is not article at this moment, try later.</p>`
  }
}

export default async function renderTemplate(templateContent, dataToReplace) {

    for ( const attribute in dataToReplace ) {
      const key = new RegExp(`\\{\\{\\s*${attribute}\\s*\\}\\}`, 'g');

      if (attribute === 'articlesList') {
        const articlesListHtml = await generateArticleListHTML();
        templateContent = templateContent.replace(key, articlesListHtml);
      } else {
        templateContent = templateContent.replace(key, dataToReplace[attribute]);
      }
    }
  return templateContent;
}