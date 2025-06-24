import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const PROJECT_ROOT = path.resolve(__dirname, "../../");
export const UPLOADS_DIR = path.join(PROJECT_ROOT, "uploads");
export const BOOKMARKS_DIR = path.join(PROJECT_ROOT, "bookmarks");
export const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");