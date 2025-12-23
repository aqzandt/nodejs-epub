import fs from "fs";
import * as utils from "../utils/utils.ts";
import path from "path";

export class Book {
  /** Unique identifier for the book */
  id: string;

  /** Absolute path to the folder containing the book's files */
  folder: string;

  /** Title of the book */
  title!: string;

  /** Path to the cover image */
  coverPath!: string;

  /** List of items (e.g., chapters, images) in the book */
  #items!: { id: string; href: string }[];

  /** Ordered list of item references (reading order) */
  #itemrefs!: string[];

  constructor(id: string, folderPath: string, opfPath: string) {
    this.id = id;
    this.folder = folderPath;
    this.#parseOPF(opfPath);
  }

  /**
   *
   * @param ref reference to an item in the book
   * @returns file path of the item
   */
  getItem(ref: number): string | null {
    if (ref < 0 || ref >= this.#itemrefs.length) {
      return null;
    }

    const idRef = this.#itemrefs[ref];
    let item = this.#items.find((item) => item.id === idRef)!;
    let pathname = path.join(this.folder, item.href);

    return pathname;
  }

  /**
   * Number of readable items (pages/chapters) in the book
   */
  get pageCount(): number {
    return this.#itemrefs.length;
  }

  log() {
    return {
      id: this.id,
      folder: this.folder,
      items: this.#items.map((item) => ({ id: item.id, href: item.href })),
      itemrefs: this.#itemrefs,
    };
  }

  /**
   *
   * @param opfPath Path to the OPF file
   * Parses the OPF file to extract item and itemref information.
   */
  #parseOPF(opfPath: string): void {
    let XML = fs.readFileSync(opfPath);
    let document = utils.XMLParse(XML);

    // Parse itemrefs
    let itemRefs: string[] = [];
    let XMLItemrefs = document.getElementsByTagName("itemref");
    for (let XMLItemRef of XMLItemrefs) {
      itemRefs.push(XMLItemRef.getAttribute("idref")!);
    }

    // Parse items
    let items: { id: string; href: string }[] = [];
    let XMLItems = document.getElementsByTagName("item");
    for (let XMLItem of XMLItems) {
      const item = {
        id: XMLItem.getAttribute("id")!,
        href: XMLItem.getAttribute("href")!,
      };
      items.push(item);
    }

    this.coverPath = document
      .querySelector(`item[properties="cover-image"]`)
      ?.getAttribute("href")!;

    // TODO may need more solid implementation for title
    const DC_NS = "http://purl.org/dc/elements/1.1/";
    
    const titleElement = document.getElementsByTagNameNS(DC_NS, "title")[0];
    const title = titleElement?.textContent || "Untitled Book";
    console.log("Book title:", title);

    this.title = title || "Untitled Book";
    this.#items = items;
    this.#itemrefs = itemRefs;
  }
}
