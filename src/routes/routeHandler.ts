import path from "path";
import * as htmlRoute from "./htmlRoute.ts";
import * as bookRoute from "./bookRoute.ts";
import * as uploadRoute from "./uploadRoute.ts";
import * as bookmarkRoute from "./bookmarkRoute.ts";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function routeHandler(app: any) {
  // Book Info
  app.get("/book/:id/static/:href(*)", (req: any, res: any) => {
    bookRoute.staticRoute(req, res);
  });

  app.get("/book/:id/:ref", (req: any, res: any) => {
    bookRoute.refRoute(req, res);
  });

  app.get("/books", (req: any, res: any) => {
    bookRoute.getBookList(req, res);
  });

  // Bookmark
  app.post("/save/:id", (req: any, res: any) => {
    bookmarkRoute.bookmarkRoute(req, res);
  });

  app.get("/load/:id", (req: any, res: any) => {
    bookmarkRoute.getBookmark(req, res);
  });

  // HTML pages
  app.get("/", (_: any, res: any) => {
    htmlRoute.index(res);
  });

  app.get("/reader/*", (_: any, res: any) => {
    htmlRoute.reader(res);
  });

  app.get("/favicon.ico", (_: any, res: any) => {
    htmlRoute.favicon(res);
  });

  // Upload
  app.post("/upload", (req: any, res: any) => {
    uploadRoute.uploadBook(req, res);
  });
}
