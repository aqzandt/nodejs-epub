import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function bookmarkRoute(req: any, res: any) {
  let body = "";

  // Listen for data events - each chunk is received here
  req.on("data", (chunk: any) => {
    // Append each chunk to the body string
    body += chunk.toString();
  });

  // When the whole request is received, the end event is fired
  req.on("end", () => {
    try {
      // Parse the accumulated string into a JSON object
      const parsedBody = JSON.parse(body);
      console.log("Saving Bookmark:", parsedBody);
      fs.writeFileSync(
        path.join(__dirname, "..", "settings", "settings.txt"),
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
  const json = fs.readFileSync(
    path.join(__dirname, "..", "settings", "settings.txt")
  );
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(json);
  res.end();
}
