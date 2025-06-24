import fs from "fs";
import path from "path";
import * as utils from "../utils/utils.ts";
import { Book } from "../classes/Book.ts";
import { UPLOADS_DIR } from "../utils/paths.ts";

let books: Book[] = [];

export function getBookById(id: string): Book {
  readBooks();
  return books.find((book) => book.id === id)!;
}

export function getBookList(): Book[] {
  readBooks();
  return books;
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
    const bookPath = path.join(UPLOADS_DIR, dir);

    let opf = utils.getOpfPathFromBookFolderPath(bookPath);
    let content = utils.getContentFolderPathFromBookFolderPath(bookPath);

    let book = new Book(dir, content, opf);
    books.push(book);
  }
}
