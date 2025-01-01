const url = require('url');
const path = require('path');

const OR = require("./routes/otherRoutes.js");
const RIR = require("./routes/retrieveInfoRoutes.js");
const UFR = require("./routes/uploadFileRoute.js");

function httpHandler(req, res) {

    console.log("Request: \"" + req.url + "\", type \"" + req.method + "\"");
    const parsedUrl = url.parse(req.url);
    const sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');
    let pathname = path.join(__dirname, sanitizePath);
    var reqUrl = req.url;
    var reqMethod = req.method.toLowerCase();
    switch(true) {
        case (reqUrl === "/"):
            OR.originRoute(req, res);
            break;
        case (reqUrl === "/favicon.ico"):
            RIR.faviconRoute(req, res);
            break;
        case (reqUrl === "/upload", reqMethod === "post"):
            UFR.uploadFile(req, res);
            break;
        case (reqUrl === "/path"):
            RIR.pathRoute(req, res);
            break;
        case (reqUrl === "/path"):
            RIR.pathRoute(req, res);
            break;
        case (reqUrl === "/spine"):
            RIR.spineRoute(req, res);
            break;
        case (reqUrl.startsWith("/reader")):
            OR.readerRoute(req, res, sanitizePath);
            break;
        case (reqUrl.startsWith("/book/")):
            RIR.contentRoute(req, res, sanitizePath);
            break;
        default:
            RIR.contentRoute(req, res, sanitizePath);
            break;
    }
}

module.exports = httpHandler;