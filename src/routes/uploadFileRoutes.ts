import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

import BookViewer from "../classes/BookViewer.ts";
import * as utils from "../utils/utils.ts";
import { BookService } from '../services/BookService.ts';
import { Book } from '../../shared/Book.ts';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function uploadFile(req: any, res: any) {
    // Initialize formidable
    const form = formidable({});
    form.parse(req, (err, fields, files) => {
        if (err) {
            res.writeHead(400, { 'content-type': 'text/plain' });
            res.write('Error processing the file upload.');
            res.end();
            return;
        }

        // Access the latest file in the array
        var uploadedFile = files.file![files.file!.length-1];
        var tempFilePath = uploadedFile.filepath;
        var originalFilename = uploadedFile.originalFilename!;

        // Target file path
        var folderPath = path.join(__dirname, '..', '..', 'public', 'book')
        var zipPath = path.join(folderPath, originalFilename);
        
        fs.rmSync(folderPath, { recursive: true, force: true });

        // Ensure the upload directory exists
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }

        // Rename and move the file
        fs.copyFile(tempFilePath, zipPath, (err) => {
            if (err) {
                res.writeHead(500, { 'content-type': 'text/plain' });
                console.log(err);
                res.end();
                return;
            }
            utils.unzip(zipPath, folderPath);

            //Set global book values
            var opf = utils.opfPath(folderPath);
            var content = utils.contentFolderPath(folderPath);
            var spineXML = fs.readFileSync(path.join(folderPath, opf));
            var spine = utils.items(spineXML);
            var itemrefs = utils.itemrefs(spineXML);
            console.log(spine);
            console.log(itemrefs);
            BookService.getBookViewer().book = new Book(spine)
            BookService.getBookViewer().opf = opf;
            BookService.getBookViewer().folder = content;
            BookService.getBookViewer().itemrefs = itemrefs;

            //Redirect to Reader
            res.statusCode = 302;
            res.setHeader('Location', 'reader/reader.html');
            res.end();
        });
    });
}