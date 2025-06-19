import fs from 'fs';
import path from 'path';

import { mimeType } from "../utils/mimeType.ts";
import * as utils from "../utils/utils.ts";
import { BookService } from '../services/BookService.ts';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function pathRoute(req: any, res: any) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write(BookService.getBookViewer().folder);
  res.end();
  return;
}

export function spineRoute(req: any, res: any) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(BookService.getBookViewer().itemrefs));
  return;
}

export function faviconRoute(req: any, res: any) {
  fs.readFile(path.join(__dirname, '..', 'favicon.ico'), (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end(`Error getting the file: ${err}.`);
    } else {
      res.setHeader('Content-type', 'image/x-icon');
      res.end(data);
    }
  });
}

export function contentRoute(req: any, res: any, url: any) {
  console.log(`Content route called with URL: ${url}`);
  var pathname = path.join(__dirname, '..', '..', 'public', 'book', BookService.getBookViewer().folder, url);
  fs.readFile(pathname, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end(`Error getting the file: ${err}.`);
    } else {
      const ext = path.parse(pathname).ext;
      res.setHeader('Content-type', mimeType.get(ext) || 'text/plain');
      res.end(data);
    }
  });
}

// Route: /book/page/{x}
export function pageRoute(req: any, res: any, url: any) {
  const idRef = url.substring(11);
  const result = utils.getItem(idRef);

  if (result.err) {
    res.statusCode = 500;
    res.end(`Error getting the file: ${result.err}.`);
  } else {
    res.setHeader('Content-type', result.mimeType);
    res.end(result.data);
  }
}