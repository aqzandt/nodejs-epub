import AdmZip from "adm-zip";
import jsdom from "jsdom";
import fs from 'fs';
import path from 'path';

import { mimeType } from "./mimeType.ts";
import { BookService } from "../services/BookService.ts";

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function unzip(filePath: any, outPath: any) {
  if (!fs.existsSync(outPath)) {
    fs.mkdirSync(outPath);
  }
  const zip = new AdmZip(filePath);
  zip.extractAllTo(outPath);
}

export function items(file: any): { id: string, href: string }[] {
  let spine:{ id: string, href: string }[] = []
  let items = XMLParse(file)!.getElementsByTagName("item");
  for (let item of items) {
    const idRef = {
      id: item.getAttribute("id")!,
      href: item.getAttribute("href")!
    };
    spine.push(idRef);
  }
  return spine;
}

export function itemrefs(file: any): string[] {
    let spine: string[] = []
    let items = XMLParse(file).getElementsByTagName("itemref");
    for (let itemref of items) {
        spine.push(itemref.getAttribute("idref")!);
    }
    return spine;
}

export function getItem(idRef: any) {
  let pathname = "-1";
  for (let item of BookService.getBookViewer().book!.spine) {
    if (item.id === idRef) {
      pathname = path.join(__dirname, '..', '..', 'public', 'book', BookService.getBookViewer().folder, item.href);
    }
  }

  if (pathname === "-1") {
    const result = {
      err: true,
      data: 0,
      mimeType: '-1'
    };
    return result;
  }

  let fileData = fs.readFileSync(pathname);
  const ext = path.parse(pathname).ext;
  const result = {
    err: false,
    data: fileData,
    mimeType: mimeType.get(ext) || 'text/plain'
  };

  return result;
}

export function opfPath(bookPath: string): string {
  let content: any = fs.readFileSync(path.join(bookPath, 'META-INF', 'container.xml'));
  let xml = XMLParse(content);
  let relativeOpf = xml.getElementsByTagName("rootfile")[0].getAttribute("full-path")!;
  return relativeOpf;
}

export function contentFolderPath(bookPath: string): string {
  let relativeOpf = opfPath(bookPath);
  let relativeContentFolder = relativeOpf.slice(0, relativeOpf.indexOf('/'));

  return relativeContentFolder;
}

export function XMLParse(xmlStr: string): Document {
  const dom = new jsdom.JSDOM(xmlStr).window.document;
  // print the name of the root element or error message
  const errorNode = dom.querySelector("parsererror");
  if (errorNode) {
    console.log("error while parsing");
  }
  return dom;
}