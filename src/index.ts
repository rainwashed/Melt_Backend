import { Elysia } from "elysia";
import process from "node:process"
import { geminiRoutes } from "./gemini";
import { elevenlabsRoutes } from "./elevenlabs";
import { logger } from "./logger";

const app = new Elysia()
  .use(geminiRoutes)
  .use(elevenlabsRoutes)
  .listen(3000)

logger.info(`Server started on port ${app.server?.port}`);

const GEMINI_API_KEY = process.env["GEMINI_API_KEY"];
const ELEVENLABS_API_KEY = process.env["ELEVENLABS_API_KEY"];

if (!GEMINI_API_KEY || !ELEVENLABS_API_KEY) {
  throw new Error("Missing required environment variables");
}

app.get("/", () => {
  return {
    message: "Hello World",
  }
})
