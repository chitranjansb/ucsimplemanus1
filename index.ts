import express from "express";
import app from "./dist/vercel.js";

// Vercel's Express detector requires the entrypoint to import Express directly.
void express;

export default app;
