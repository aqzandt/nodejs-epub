import AdmZip from "adm-zip";
import jsdom from "jsdom";
import fs from "fs";
import path from "path";
import { mimeType } from "./mimeType.ts";

/**
 *
 * @param filePath Full path to the zip file (e.g., C:/app/public/book/1234.zip)
 * @param outPath Full path to the output folder (e.g., C:/app/public/book/)
 */
export function unzip(filePath: any, outPath: any) {
  if (!fs.existsSync(outPath)) {
    fs.mkdirSync(outPath);
  }
  const zip = new AdmZip(filePath);
  zip.extractAllTo(outPath);
}

/**
 *
 * @param bookPath Full path to the book folder (e.g., C:/app/public/book/1234)
 * @returns Full path to the OPF file (e.g., C:/app/public/book/1234/item/content.opf)
 */
export function getOpfPathFromBookFolderPath(bookPath: string): string {
  let content: any = fs.readFileSync(
    path.join(bookPath, "META-INF", "container.xml")
  );
  let xml = XMLParse(content);
  let opf = path.join(
    bookPath,
    xml.getElementsByTagName("rootfile")[0].getAttribute("full-path")!
  );
  return opf;
}

/**
 *
 * @param bookPath Full path to the book folder (e.g., C:/app/public/book/1234)
 * @returns Full path to the content root folder (e.g., C:/app/public/book/1234/item)
 */
export function getContentFolderPathFromBookFolderPath(
  bookPath: string
): string {
  let opf = getOpfPathFromBookFolderPath(bookPath);
  let contentFolder = opf.substring(0, opf.lastIndexOf(path.sep));

  return contentFolder;
}

/**
 *
 * @param xmlStr XML
 * @returns document object of the parsed XML
 */
export function XMLParse(xml: any) {
  const dom = new jsdom.JSDOM(xml, { contentType: "text/xml" }).window.document;
  // print the name of the root element or error message
  const errorNode = dom.querySelector("parsererror");
  if (errorNode) {
    console.log("error while parsing");
  }
  return dom;
}

/**
 *
 * @param xmlStr XML
 * @returns document object of the parsed XML
 */
export function documentToXMLString(document: Document): string {
  const { XMLSerializer } = new jsdom.JSDOM().window;

  const serializer = new XMLSerializer();
  const xmlString = serializer.serializeToString(document);

  return xmlString;
}

/**
 *
 * @param res response object
 * @param filePath path to file to return
 */
export function returnFile(res: any, filePath: string) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end(`Error getting the file: ${err}.`);
    } else {
      const ext = path.parse(filePath).ext;
      res.writeHead(200, { "Content-type": mimeType.get(ext) || "text/plain" });
      res.end(data);
    }
  });
}
