import { GoogleGenAI } from "@google/genai";
import { Elysia, t } from "elysia";
import { logger } from "./logger";
import fs from "node:fs";
import path from "node:path";

const judgerPrompt = fs.readFileSync(path.join(import.meta.dir, "prompts", "judger.txt"), "utf-8");
const informerPrompt = fs.readFileSync(path.join(import.meta.dir, "prompts", "informer.txt"), "utf-8");
const aiClient = new GoogleGenAI({
    apiKey: process.env["GEMINI_API_KEY"]
})

export const geminiRoutes = new Elysia({ prefix: "/gemini" })
    .get("/", () => "Gemini Route");

geminiRoutes.post("/judge", async (request) => {
    const { transcript } = request.body;

    logger.debug(`Recieved transcript: \n${transcript}\n`);

    const response = await aiClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {
                role: "model",
                parts: [
                    {
                        text: judgerPrompt,
                    }
                ]
            },
            {
                role: "user",
                parts: [
                    {
                        text: transcript,
                    },
                ],
            },
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "object",
                properties: {
                    dangerous: {
                        type: "boolean",
                    },
                    reason: {
                        type: "string",
                    },
                },
            },
        }
    });

    logger.info(`response: ${response}`);

    return response.text;
}, {
    body: t.Object({
        transcript: t.String()
    })
})

geminiRoutes.post("/inform", async (request) => {
    const { transcript } = request.body;

    logger.debug(`Recieved transcript: \n${transcript}\n`);

    const response = await aiClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {
                role: "model",
                parts: [
                    {
                        text: informerPrompt,
                    }
                ]
            },
            {
                role: "user",
                parts: [
                    {
                        text: transcript,
                    },
                ],
            },
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "object",
                properties: {
                    information: {
                        type: "string",
                    },
                },
            },
        }
    });

    logger.info(`response: ${response}`);

    return response.text;
}, {
    body: t.Object({
        transcript: t.String()
    })
})

geminiRoutes.post("/communicate", async (request) => {
    const { transcript } = request.body;

    logger.debug(`Recieved transcript: \n${transcript}\n`);

    const response = await aiClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {
                role: "model",
                parts: [
                    {
                        text: "You are an AI agent in charge of communicating with a person.",
                    }
                ]
            },
            {
                role: "user",
                parts: [
                    {
                        text: transcript,
                    },
                ],
            },
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "object",
                properties: {
                    information: {
                        type: "string",
                    },
                },
            },
        }
    });

    logger.info(`response: ${response}`);

    return response.text;
}, {
    body: t.Object({
        transcript: t.String()
    })
})