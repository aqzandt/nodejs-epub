import path from "path";
import * as bookRoute from "./bookRoute.ts";
import * as uploadRoute from "./uploadRoute.ts";
import * as bookmarkRoute from "./bookmarkRoute.ts";
import { PUBLIC_DIR } from "../utils/paths.ts";

export function routeHandler(app: any) {
  // Book Info
  app.get("/book/:id/static/:href(*)", (req: any, res: any) => {
    bookRoute.staticRoute(req, res);
  });

  app.get("/book/:id/cover", (req: any, res: any) => {
    bookRoute.cover(req, res);
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
    res.sendFile(path.join(PUBLIC_DIR, "index.html"));
  });

  app.get("/reader/*", (_: any, res: any) => {
    res.sendFile(path.join(PUBLIC_DIR, "reader.html"));
  });

  app.get("/favicon.ico", (_: any, res: any) => {
    res.sendFile(path.join(PUBLIC_DIR, "favicon.ico"));
  });

  // Upload
  app.post("/upload", (req: any, res: any) => {
    uploadRoute.uploadBook(req, res);
  });
}
