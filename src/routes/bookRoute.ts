import path from "path";
import fs from "fs";
import * as utils from "../utils/utils.ts";
import * as bookService from "../services/bookService.ts";
import { UPLOADS_DIR } from "../utils/paths.ts";
import { Request, Response } from "express";

/**
 * Handles requests for book content by ID and reference.
 * reference attributes are updated to point to the static route.
 */
export function refRoute(req: any, res: any) {
  // console.log(
  //   `Ref route called with ID ${req.params.id} and ref: ${req.params.ref}`
  // );
  let book = bookService.getBookById(req.params.id);
  if (!book) {
    res.status(404).send("Book not found");
    return;
  }

  const ref = Number(req.params.ref);
  if (!Number.isInteger(ref)) {
    res.status(400).send("Invalid page reference");
    return;
  }

  // TODO path verification

  // Change all hrefs and xlink:hrefs to point to the static route
  let pathname = book.getItem(ref);
  if (!pathname) {
    res.status(404).send("Page not found");
    return;
  }
  let xhtml = fs.readFileSync(pathname);
  let document = utils.XMLParse(xhtml);

  let filePath = pathname
    .substring(
      pathname.lastIndexOf(book.id) + book.id.length + 1,
      pathname.lastIndexOf(path.sep)
    )
    .replaceAll(path.sep, "/");

  for (let item of document.querySelectorAll("*")) {
    let href = item.getAttribute("href");
    if (href) {
      item.setAttribute(
        "href",
        `/book/${req.params.id}/static/${filePath}/${href}`
      );
    }

    let xhref = item.getAttribute("xlink:href");
    if (xhref) {
      item.setAttribute(
        "xlink:href",
        `/book/${req.params.id}/static/${filePath}/${xhref}`
      );
    }

    let src = item.getAttribute("src");
    if (src) {
      item.setAttribute(
        "src",
        `/book/${req.params.id}/static/${filePath}/${src}`
      );
    }
  }

  let newXHtml = utils.documentToXMLString(document);
  res.send(newXHtml);
}

export function getBookMeta(req: Request, res: Response) {
  const book = bookService.getBookById(req.params.id);
  if (!book) {
    res.status(404).send("Book not found");
    return;
  }

  res.json({
    id: book.id,
    title: book.title,
    totalPages: book.pageCount,
  });
}

export function cover(req: any, res: any) {
  let book = bookService.getBookById(req.params.id);
  res.sendFile(path.join(book.folder, book.coverPath));
}

/**
 * Handles static routes for book content.
 */
export function staticRoute(req: any, res: any) {
  // console.log(
  //   `Static route called with ID ${req.params.id} and HREF: ${req.params.href}`
  // );
  let pathname = path.join(req.params.id, req.params.href);
  res.sendFile(path.join(UPLOADS_DIR, pathname));
}

/**
 * Returns a list of book titles and IDs in alphabetical order with an optional search query.
 */
export function getBookList(req: Request, res: Response) {
  let query = req.query.query as string;
  if (query) {
    query = query.toLowerCase();
  }

  let books = bookService.getBookList();

  if (query) {
    books = books.filter((book) => {
      let title = book.title.toLowerCase();
      return title.includes(query);
    });
  }

  books.sort((a, b) =>
    a.title.toLowerCase().localeCompare(b.title.toLowerCase())
  );

  let titleIds = books.map((book) => {
    const titleId = { title: book.title, id: book.id };
    return titleId;
  });

  res.json(titleIds);
}

export function analyzeKanji(req: Request, res: Response) {
  let book = bookService.getBookById(req.params.id)
  if (!book) {
    res.status(404).send("Book not found");
    return;
  }

  let count = book.pageCount;
  const aggregate: Map<string, number> = new Map();

  for (let i = 0; i < count; i++) {
    let path = book.getItem(i)!;
    let xhtml = fs.readFileSync(path);
    let document = utils.XMLParse(xhtml);
    let text = document.body.textContent;

    const matches = text.match(/\p{Script=Han}+/gu);
    const result = matches ? matches.join("") : "";

    for (const char of result) {
      if (aggregate.has(char)) {
        aggregate.set(char, aggregate.get(char)! + 1);
      } else {
        aggregate.set(char, 1);
      }
    }
  }
  const array = Array.from(aggregate.entries()).sort((a, b) => b[1] - a[1]);
  res.json(array);
}