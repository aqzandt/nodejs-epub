import path from 'path';
import * as utils from "../utils/utils.ts";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function index(res: any) {
    let pathname = path.join(__dirname, '..', '..', 'public', 'index.html');
    utils.returnFile(res, pathname);
}

export function reader(res: any) {
    let pathname = path.join(__dirname, '..', '..', 'public', 'reader', 'reader.html');
    utils.returnFile(res, pathname);
}

export function favicon(res: any) {
  let pathname = path.join(__dirname, '..', '..', 'public', 'favicon.ico');
  utils.returnFile(res, pathname);
}