const fs = require('fs');
const path = require('path');

const mimeType = require("../utils/mimeType.js");

function originRoute(req, res) {
    const html = fs.readFileSync(path.join(__dirname, '..', '..', 'public', 'index', 'index.html'));
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(html);
    res.end();
    return;
}

function readerRoute(req, res, sanitizePath) {
    var pathname = path.join(__dirname, '..', '..', 'public', sanitizePath);

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

function bookmarkRoute(req, res) {
    let body = '';

    // Listen for data events - each chunk is received here
    req.on('data', (chunk) => {
      // Append each chunk to the body string
      body += chunk.toString();
    });

    // When the whole request is received, the end event is fired
    req.on('end', () => {
      try {
        // Parse the accumulated string into a JSON object
        const parsedBody = JSON.parse(body);
        console.log('Saving Bookmark:', parsedBody);
        fs.writeFileSync(path.join(__dirname, '..', 'settings', 'settings.txt'), body);
        // Send a success response with a JSON payload
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end();
      } catch (error) {
        // Handle JSON parsing errors
        console.error('Error parsing JSON:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON provided' }));
      }
    });

    
}

function getBookmark(req, res) {
    const json = fs.readFileSync(path.join(__dirname, '..', 'settings', 'settings.txt'));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(json);
    res.end();
}

exports.originRoute = originRoute;
exports.readerRoute = readerRoute;
exports.bookmarkRoute = bookmarkRoute;
exports.getBookmark = getBookmark;
