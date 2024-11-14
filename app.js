const http = require('http');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const AdmZip = require("adm-zip");
const jsdom = require("jsdom");
const url = require('url');

const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.zip': 'application/zip',
    '.doc': 'application/msword',
    '.eot': 'application/vnd.ms-fontobject',
    '.ttf': 'application/x-font-ttf',
    '.xhtml': 'application/xhtml+xml',
  };

var spine = [];

// Create a server
const server = http.createServer(httpHandler);

function httpHandler(req, res) {

    console.log("Request: \"" + req.url + "\" type \"" + req.method + "\"");

    const parsedUrl = url.parse(req.url);
    const sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');
    let pathname = path.join(__dirname, sanitizePath);

    if (req.url === '/upload' && req.method.toLowerCase() === 'post') {
        uploadFile(req, res);
        return;
    }

    if (req.url === '/') {
        const html = fs.readFileSync("./frontend/index.html");
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(html);
        res.end();
        return;
    }

    if (req.url === '/spine') {
        console.log(`Spine:`);
        console.log(spine);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(spine));
        return;
    }

    if (req.url.startsWith("/Images") || req.url.startsWith("/Text") || req.url.startsWith("/Styles") || req.url.startsWith("toc") ) {
        pathname = path.join(__dirname, '/public/OEBPS/', sanitizePath);
    }
    
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
        var projectFilePath = path.join(__dirname, 'public', originalFilename);
        
        fs.rmSync(path.join(__dirname, 'public'), { recursive: true, force: true });

        // Ensure the upload directory exists
        if (!fs.existsSync(path.join(__dirname, 'public'))) {
            fs.mkdirSync(path.join(__dirname, 'public'));
        }

        // Rename and move the file
        fs.copyFile(tempFilePath, projectFilePath, (err) => {
            if (err) {
                res.writeHead(500, { 'content-type': 'text/plain' });
                console.log(err);
                res.end();
                return;
            }
            unzip(projectFilePath);
            var content = fs.readFileSync(path.join(__dirname, 'public', 'OEBPS', 'content.opf'));
            spine = loadZip(content);
            res.statusCode = 302;
            res.setHeader('Location', '/nav/nav.html');
            res.end();
        });
    });
}

function unzip(filePath) {
    if (!fs.existsSync(path.join(__dirname, 'public'))) {
        fs.mkdirSync(path.join(__dirname, 'public'));
    }
    const zip = new AdmZip(filePath);
    zip.extractAllTo(path.join(__dirname, 'public'));
}

function loadZip(file) {
    var spine = []
    var items = XMLParse(file).getElementsByTagName("item");
    for (var item of items) {
        var page = item.attributes.href.nodeValue;
        spine.push(page);
    }
    return spine;
}

function XMLParse(xmlStr) {
    const dom = new jsdom.JSDOM(xmlStr).window.document;
    // print the name of the root element or error message
    const errorNode = dom.querySelector("parsererror");
    if (errorNode) {
        console.log("error while parsing");
    } else {
        return dom;
    }
}

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});