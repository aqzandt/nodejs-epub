const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

const BookViewer = require("../components/bookViewer.js");
const utils = require("../utils/utils.js");

function uploadFile(req, res) {
    // Initialize formidable
    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
            res.writeHead(400, { 'content-type': 'text/plain' });
            res.write('Error processing the file upload.');
            res.end();
            return;
        }

        // Access the latest file in the array
        var uploadedFile = files.file[files.file.length-1];
        var tempFilePath = uploadedFile.filepath;
        var originalFilename = uploadedFile.originalFilename;

        // Target file path
        var folderPath = path.join(__dirname, '..', 'book')
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
            var refs = utils.itemrefs(spineXML);
            console.log(spine);
            console.log(refs);
            BookViewer.book.opf = opf;
            BookViewer.book.folder = content;
            BookViewer.book.spine = spine;
            BookViewer.book.itemrefs = refs;

            //Redirect to Reader
            res.statusCode = 302;
            res.setHeader('Location', 'reader/reader.html');
            res.end();
        });
    });
}

exports.uploadFile = uploadFile;