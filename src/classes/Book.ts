import fs from "fs";
import * as utils from "../utils/utils.ts";
import path from "path";

export class Book {
  id: string;
  folder: string;
  #items!: { id: string; href: string }[];
  #itemrefs!: string[];

  constructor(id: string, folderPath: string, opfPath: string) {
    this.id = id;
    this.folder = folderPath;
    this.#parseItemsAndRefs(opfPath);
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
  #parseItemsAndRefs(opfPath: string): void {
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

    this.#items = items;
    this.#itemrefs = itemRefs;
  }
}
