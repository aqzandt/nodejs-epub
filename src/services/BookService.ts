import fs from "fs";
import path from "path";
import * as utils from "../utils/utils.ts";
import { Book } from "../classes/Book.ts";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  const bookFolder = path.join(__dirname, "..", "..", "public", "book");
  if (!fs.existsSync(bookFolder)) {
    fs.mkdirSync(bookFolder);
  }
  
  const dirs = fs
    .readdirSync(bookFolder, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const dir of dirs) {
    const bookPath = path.join(bookFolder, dir);

    let opf = utils.getOpfPathFromBookFolderPath(bookPath);
    let content = utils.getContentFolderPathFromBookFolderPath(bookPath);

    let book = new Book(dir, content, opf);
    books.push(book);
  }
}
