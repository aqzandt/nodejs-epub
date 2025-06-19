import type { Book } from "../../shared/Book.ts";

export default class BookViewer {
    book: Book | null;
    opf: string;
    folder: string; 
    itemrefs: string[];

    constructor(book: Book | null, opf: string, folder: string, itemrefs: string[]) {
        this.book = book;
        this.opf = opf;
        this.folder = folder;
        this.itemrefs = itemrefs;
    }
}