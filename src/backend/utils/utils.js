const AdmZip = require("adm-zip");
const jsdom = require("jsdom");
const fs = require('fs');
const path = require('path');

const mimeType = require("./mimeType.js");
const BookViewer = require("../components/bookViewer.js");

function unzip(filePath, outPath) {
    if (!fs.existsSync(outPath)) {
        fs.mkdirSync(outPath);
    }
    const zip = new AdmZip(filePath);
    zip.extractAllTo(outPath);
}

function items(file) {
    var spine = []
    var items = XMLParse(file).getElementsByTagName("item");
    for (var item of items) {
        const idRef = {
            id: item.getAttribute("id"),
            href: item.getAttribute("href")
        };
        spine.push(idRef);
    }
    return spine;
}

function itemrefs(file) {
    var spine = []
    var items = XMLParse(file).getElementsByTagName("itemref");
    for (var itemref of items) {
        spine.push(itemref.getAttribute("idref"));
    }
    return spine;
}

function getItem(idRef) {
    var pathname = "-1";
    for (var item of BookViewer.book.spine) {
        if (item.id === idRef) {
            pathname = path.join(__dirname, '..', 'book', BookViewer.book.folder, item.href);
        }
    }

    if (pathname === "-1") {
        const result = {
            err: true,
            data: 0,
            mimeType: '-1'
        };
        return result;
    }

    fileData = fs.readFileSync(pathname);
    const ext = path.parse(pathname).ext;
    const result = {
        err: false,
        data: fileData,
        mimeType: mimeType[ext] || 'text/plain'
    };

    return result;
}

function opfPath(bookPath) {
    var content = fs.readFileSync(path.join(bookPath, 'META-INF', 'container.xml'));
    var xml = XMLParse(content);
    var relativeOpf = xml.getElementsByTagName("rootfile")[0].getAttribute("full-path");
    return relativeOpf;
}

function contentFolderPath(bookPath) {
    var relativeOpf = opfPath(bookPath);
    var relativeContentFolder = relativeOpf.slice(0, relativeOpf.indexOf('/'));
    
    return relativeContentFolder;
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

exports.unzip = unzip;
exports.getItem = getItem;
exports.items = items;
exports.itemrefs = itemrefs;
exports.opfPath = opfPath;
exports.contentFolderPath = contentFolderPath;
exports.XMLParse = XMLParse;