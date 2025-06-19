const url = require('url');
const path = require('path');

const OR = require("./routes/otherRoutes.js");
const RIR = require("./routes/retrieveInfoRoutes.js");
const UFR = require("./routes/uploadFileRoute.js");

function httpHandler(req, res) {

    console.log("Request: \"" + req.url + "\", type \"" + req.method + "\"");
    var reqUrl = req.url;
    var reqMethod = req.method.toLowerCase();
    switch(true) {
        case (reqUrl === "/"):
            OR.originRoute(req, res);
            break;
        case (reqUrl === "/favicon.ico"):
            RIR.faviconRoute(req, res);
            break;
        case (reqUrl === "/upload"):
            UFR.uploadFile(req, res);
            break;
        case (reqUrl === "/path"):
            RIR.pathRoute(req, res);
            break;
        case (reqUrl === "/spine"):
            RIR.spineRoute(req, res);
            break;
        case (reqUrl.startsWith("/reader")):
            OR.readerRoute(req, res, reqUrl);
            break;
        case (reqUrl.startsWith("/book/page/")):
            RIR.pageRoute(req, res, reqUrl);
            break;
        case (reqUrl.startsWith("/book/")):
            RIR.contentRoute(req, res, reqUrl);
            break;
        case (reqUrl.startsWith("/save")):
            OR.bookmarkRoute(req, res);
            break;
        case (reqUrl.startsWith("/load")):
            OR.getBookmark(req, res);
            break;
        default:
            RIR.contentRoute(req, res, reqUrl);
            break;
    }
}

module.exports = httpHandler;