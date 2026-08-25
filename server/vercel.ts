import express from "express";
import path from "node:path";
import { createApp } from "./_core/app";

const app = createApp();
const publicDirectory = path.resolve(process.cwd(), "public");

// Vercel may route `/` to the Express function even when `public/**` is present.
// Keep the CDN-compatible public directory while providing a function fallback.
app.use(express.static(publicDirectory));
app.get("*", (_req, res) => {
  res.sendFile(path.join(publicDirectory, "index.html"));
});

export default app;
