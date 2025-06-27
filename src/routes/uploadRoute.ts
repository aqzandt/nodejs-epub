import formidable from "formidable";
import fs from "fs";
import path from "path";
import * as utils from "../utils/utils.ts";
import * as bookService from "../services/bookService.ts";
import { UPLOADS_DIR } from "../utils/paths.ts";

export function uploadBook(req: any, res: any) {
  // Initialize formidable
  const form = formidable({});
  form.parse(req, (err, _, files) => {
    if (err) {
      res.writeHead(400, { "content-type": "text/plain" });
      res.write("Error processing the file upload.");
      res.end();
      return;
    }

    // Access the latest file in the array
    let uploadedFile = files.file![files.file!.length - 1];
    let tempFilePath = uploadedFile.filepath;
    let originalFilename = uploadedFile.originalFilename!;

    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR);
    }

    // Target file path
    let id = crypto.randomUUID();
    let folderPath = path.join(UPLOADS_DIR, id);
    let zipPath = path.join(folderPath, originalFilename);

    // Create upload directory
    fs.mkdirSync(folderPath);

    // Rename and move the file, then unzip it
    fs.copyFile(tempFilePath, zipPath, (err) => {
      if (err) {
        res.writeHead(500, { "content-type": "text/plain" });
        console.log(err);
        res.end();
        return;
      }

      utils.unzip(zipPath, folderPath);
      bookService.readBookFromID(id);

      //Redirect to Reader
      res.statusCode = 302;
      res.setHeader("Location", "reader/" + id);
      res.end();
    });
  });
}
