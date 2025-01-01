class BookViewer {
    constructor(opf, folder, spine) {
        this.opf = opf;
        this.folder = folder;
        this.spine = spine;
    }
}

const book = new BookViewer("", "", "");

exports.BookViewer = BookViewer;
exports.book = book;