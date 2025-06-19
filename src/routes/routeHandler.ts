import path from "path";
import * as OR from "./otherRoutes.ts";
import * as RIR from "./retrieveInfoRoutes.ts";
import * as UFR from "./uploadFileRoutes.ts";
import express from 'express';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function routeHandler(app: any) {
  app.get("/", (req: any, res: any) => {
    OR.originRoute(req, res);
  });

  app.get("/favicon.ico", (req: any, res: any) => {
    RIR.faviconRoute(req, res);
  });

  app.post("/upload", (req: any, res: any) => {
    UFR.uploadFile(req, res);
  });

  app.get("/path", (req: any, res: any) => {
    RIR.pathRoute(req, res);
  });

  app.get("/spine", (req: any, res: any) => {
    RIR.spineRoute(req, res);
  });

  app.get("/reader*", (req: any, res: any) => {
    OR.readerRoute(req, res, req.url);
  });

  app.get("/book/page/*", (req: any, res: any) => {
    RIR.pageRoute(req, res, req.url);
  });

  app.get("/save*", (req: any, res: any) => {
    OR.bookmarkRoute(req, res);
  });

  app.get("/load*", (req: any, res: any) => {
    OR.getBookmark(req, res);
  });

  app.use((req: any, res: any) => {
    RIR.contentRoute(req, res, req.url);
  });

}