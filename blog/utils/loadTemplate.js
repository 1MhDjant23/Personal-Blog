import  fs from 'node:fs/promises';
import path from 'node:path';
import { __dirname } from '../server.js';

export  default async   function  loadTemplate(templateName) {
  
  try {
      const filePath = path.resolve(__dirname, 'templates', `${templateName}.html`);

      const content = await fs.readFile(filePath, 'utf-8');
      return content;
  } catch (error) {
    console.error(`⛔️: ${error}`);
    return null;
  }
}