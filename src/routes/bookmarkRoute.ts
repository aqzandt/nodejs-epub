import fs from "fs";
import path from "path";
import { BOOKMARKS_DIR } from "../utils/paths.ts";

export function bookmarkRoute(req: any, res: any) {
  let body = "";
  let bookId = req.params.id;

  // Listen for data events - each chunk is received here
  req.on("data", (chunk: any) => {
    // Append each chunk to the body string
    body += chunk.toString();
  });

  // When the whole request is received, the end event is fired
  req.on("end", () => {
    try {
      // Ensure the bookmarks directory exists
      if (!fs.existsSync(BOOKMARKS_DIR)) {
        fs.mkdirSync(BOOKMARKS_DIR);
      }

      // Write the JSON data to a file named after the bookId
      fs.writeFileSync(
        path.join(BOOKMARKS_DIR, `${bookId}.txt`),
        body
      );
      // Send a success response with a JSON payload
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end();
    } catch (error) {
      // Handle JSON parsing errors
      console.error("Error parsing JSON:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid JSON provided" }));
    }
  });
}

export function getBookmark(req: any, res: any) {
  let bookId = req.params.id;
  const json = fs.readFileSync(
    path.join(BOOKMARKS_DIR, `${bookId}.txt`)
  );
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(json);
  res.end();
}
