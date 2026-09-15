import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

const rawClientUrls = process.env.CLIENT_URL || "http://localhost:5173";
const allowedOrigins = rawClientUrls.split(",").map((u) => u.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      // Allow if matches configured CLIENT_URL, local dev, or any Netlify subdomain
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".netlify.app") ||
        origin.includes("localhost") ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true, // required so the browser sends/receives the httpOnly cookie
  })
);
app.use(express.json());
app.use(cookieParser());

// Root and health endpoints for Render web service monitors
app.get("/", (req, res) =>
  res.json({
    status: "ok",
    service: "TaskPulse API",
    environment: process.env.NODE_ENV || "development",
  })
);
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes); // fallback for requests without /api prefix
app.use("/api/tasks", taskRoutes);
app.use("/tasks", taskRoutes); // fallback for requests without /api prefix

app.use(notFound);
app.use(errorHandler);

export default app;
