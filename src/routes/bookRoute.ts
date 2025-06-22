import path from 'path';
import fs from 'fs';
import * as utils from "../utils/utils.ts";
import * as bookService from "../services/bookService.ts";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function refRoute(req: any, res: any) {
  console.log(`Ref route called with ID ${req.params.id} and ref: ${req.params.ref}`);
  let book = bookService.getBookById(req.params.id);

  // TODO path verification

  // Change all hrefs and xlink:hrefs to point to the static route
  let pathname = book.getItem(req.params.ref)!;
  let xhtml = fs.readFileSync(pathname);
  let document = utils.XMLParse(xhtml);

  let filePath = pathname.substring(pathname.lastIndexOf(book.id)+book.id.length+1, pathname.lastIndexOf(path.sep)).replaceAll(path.sep, '/');
  for (let item of document.querySelectorAll("*")) {

    let href = item.getAttribute("href");
    if (href) {
      item.setAttribute("href", `/book/${req.params.id}/static/${filePath}/${href}`);
    }

    let xhref = item.getAttribute("xlink:href");
    if (xhref) {
      item.setAttribute("xlink:href", `/book/${req.params.id}/static/${filePath}/${xhref}`);
    }

    let src = item.getAttribute("src");
    if (src) {
      item.setAttribute("src", `/book/${req.params.id}/static/${filePath}/${src}`);
    }
  }

  let newXHtml = utils.documentToXMLString(document);
  res.send(newXHtml);
}

export function staticRoute(req: any, res: any) {
  console.log(`Static route called with ID ${req.params.id} and HREF: ${req.params.href}`);
  let pathname = path.join(__dirname, '..', '..', 'public', 'book', req.params.id, req.params.href);
  utils.returnFile(res, pathname);
}