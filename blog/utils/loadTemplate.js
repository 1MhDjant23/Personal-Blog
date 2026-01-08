import  fs from 'node:fs/promises';
import path from 'node:path';
import { __dirname } from '../server.js';

export  default async   function  loadTemplate(dirName, templateName) {
  
  try {
      // console.log('before');
      const filePath = path.resolve(__dirname, 'templates', dirName, `${templateName}.html`);
      // console.log('after');
      console.log(`fileeee:--> ${filePath}`);
      const content = await fs.readFile(filePath, 'utf-8');
      return content;
  } catch (error) {
    console.error(`⛔️: ${error}`);
    return null;
  }
}