const fs = require('fs');
const path = require('path');

const mimeType = require("../utils/mimeType.js");

function originRoute(req, res) {
    const html = fs.readFileSync(path.join(__dirname, '..', '..', 'frontend', 'index.html'));
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(html);
    res.end();
    return;
}

function readerRoute(req, res, sanitizePath) {
    var pathname = path.join(__dirname, '..', '..', 'frontend', sanitizePath);

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

exports.originRoute = originRoute;
exports.readerRoute = readerRoute;