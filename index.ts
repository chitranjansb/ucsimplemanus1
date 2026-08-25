import express from "express";
// @ts-expect-error The Vercel build generates this bundled JavaScript entrypoint before deployment type validation.
import app from "./dist/vercel.js";

// Vercel's Express detector requires the entrypoint to import Express directly.
void express;

export default app;
