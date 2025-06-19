export class Book {
    spine;
    pageNumber;
    constructor(spine) {
        this.spine = spine;
        this.pageNumber = 0;
    }
    static async fetchBook() {
        const resp = await fetch('/spine');
        const spine = await resp.json();
        return new Book(spine);
    }
}
