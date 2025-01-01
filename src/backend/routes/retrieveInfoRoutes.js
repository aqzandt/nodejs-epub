const fs = require('fs');
const path = require('path');

const mimeType = require("../utils/mimeType.js");
const BookViewer = require("../components/bookViewer.js");

function pathRoute(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write(BookViewer.book.folder);
    res.end();
    return;
}

function spineRoute(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(BookViewer.book.spine));
    return;
}

function faviconRoute(req, res) {
    fs.readFile(path.join(__dirname, '..', 'favicon.ico'), (err, data) => {
        if(err){
            res.statusCode = 500;
            res.end(`Error getting the file: ${err}.`);
          } else {
            res.setHeader('Content-type', 'image/x-icon');
            res.end(data);
          }
    });
}

function contentRoute(req, res, sanitizePath) {
    //req.url.startsWith("/Images") || req.url.startsWith("/Text") || req.url.startsWith("/Styles") || req.url.startsWith("/image") || req.url.startsWith("/style") || req.url.startsWith("/xhtml") || req.url.startsWith("toc")
    if (req.url.startsWith("/book/")) sanitizePath = sanitizePath.substring(6);

    var pathname = path.join(__dirname, '..', 'book', BookViewer.book.folder, sanitizePath);
    fs.readFile(pathname, (err, data) => {
        if(err){
            res.statusCode = 500;
            res.end(`Error getting the file: ${err}.`);
          } else {
            const ext = path.parse(pathname).ext;
            res.setHeader('Content-type', mimeType[ext] || 'text/plain' );
            res.end(data);
          }
    });
}

exports.pathRoute = pathRoute;
exports.spineRoute = spineRoute;
exports.faviconRoute = faviconRoute;
exports.contentRoute = contentRoute;