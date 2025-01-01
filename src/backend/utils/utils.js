const AdmZip = require("adm-zip");
const jsdom = require("jsdom");
const fs = require('fs');
const path = require('path');

function unzip(filePath, outPath) {
    if (!fs.existsSync(outPath)) {
        fs.mkdirSync(outPath);
    }
    const zip = new AdmZip(filePath);
    zip.extractAllTo(outPath);
}

function loadZip(file) {
    var spine = []
    var items = XMLParse(file).getElementsByTagName("item");
    console.log("Items: " + items);
    for (var item of items) {
        var page = item.attributes.href.nodeValue;
        spine.push(page);
    }
    return spine;
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
exports.loadZip = loadZip;
exports.opfPath = opfPath;
exports.contentFolderPath = contentFolderPath;
exports.XMLParse = XMLParse;