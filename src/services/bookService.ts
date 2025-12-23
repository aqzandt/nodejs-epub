import fs, { read } from "fs";
import path from "path";
import * as utils from "../utils/utils.ts";
import { Book } from "../classes/Book.ts";
import { UPLOADS_DIR } from "../utils/paths.ts";

let books: Book[] = [];

export function getBookById(id: string): Book {
  return books.find((book) => book.id === id)!;
}

export function getBookList(): Book[] {
  return books;
}

export function readBookFromID(id: string): void {
  const bookPath = path.join(UPLOADS_DIR, id);

  let opf = utils.getOpfPathFromBookFolderPath(bookPath);
  let content = utils.getContentFolderPathFromBookFolderPath(bookPath);

  let book = new Book(id, content, opf);
  books.push(book);
}

export function readBooks(): void {
  books = [];

  // Read books from the public/book folder
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
  }
  
  const dirs = fs
    .readdirSync(UPLOADS_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const dir of dirs) {
    readBookFromID(dir);
  }
}
