export class Book {
  spine:{id: string, href: string}[];
  pageNumber: number;

  constructor(spine:{id: string, href: string}[]) {
    this.spine = spine;
    this.pageNumber = 0;
  }

  static async fetchBook(): Promise<Book> {
    const resp = await fetch('/spine');
    const spine = await resp.json();
    return new Book(spine);
  }

}