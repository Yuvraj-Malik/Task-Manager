import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config();

const projectId =
  process.env.FIREBASE_PROJECT_ID ||
  process.env.VITE_FIREBASE_PROJECT_ID ||
  "taskpulse-1fcdb";

let app;
if (getApps().length === 0) {
  app = initializeApp({
    projectId,
  });
} else {
  app = getApps()[0];
}

export const adminAuth = getAuth(app);
