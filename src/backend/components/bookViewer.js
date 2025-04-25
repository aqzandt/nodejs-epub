class BookViewer {
    constructor(opf, folder, spine, itemrefs) {
        this.opf = opf;
        this.folder = folder;
        this.spine = spine;
        this.itemrefs = itemrefs;
    }
}

const book = new BookViewer("", "", "", "");

exports.BookViewer = BookViewer;
exports.book = book;