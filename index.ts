import express from "express";
import { createApp } from "./server/_core/app";

// Vercel's Express detector requires the entrypoint to import Express directly.
void express;

export default createApp();
