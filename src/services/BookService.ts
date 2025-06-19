import BookViewer from "../classes/BookViewer.ts";

const bookViewer = new BookViewer(null, "", "", []);

export class BookService {
  static getBookViewer(): BookViewer {
    return bookViewer;
  }
}