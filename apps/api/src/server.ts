import express from "express";
import { logger } from "@repo/logger";
import cors from "cors";

import * as trpcExpress from "@trpc/server/adapters/express";
import { generateOpenApiDocument, createOpenApiExpressMiddleware } from "trpc-to-openapi";
import { apiReference } from "@scalar/express-api-reference";

import { serverRouter, createContext } from "@repo/trpc/server";

import { env } from "./env";
import cookieParser from "cookie-parser";

export const app = express();
const openApiDocument = generateOpenApiDocument(serverRouter, {
    title: "Root Forms API",
    description: "The complete API for Root Forms — a nature-themed form builder SaaS. Create forms, manage fields, collect responses, and view analytics.",
    version: "1.0.0",
    baseUrl: env.BASE_URL.concat("/api"),
});

app.use(
    cors({
        origin: env.WEB_URL,
        credentials: true,
    }),
);

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
    return res.json({ message: "Root Forms is up and running..." });
});

app.get("/health", (req, res) => {
    return res.json({ message: "Root Forms server is healthy", healthy: true });
});

logger.debug(`openapi.json: ${env.BASE_URL}/openapi.json`);
app.get("/openapi.json", (req, res) => {
    return res.json(openApiDocument);
});

logger.debug(`docs: ${env.BASE_URL}/docs`);
app.use("/docs", apiReference({ url: "/openapi.json" }));

app.use(
    "/api",
    createOpenApiExpressMiddleware({
        router: serverRouter,
        createContext,
    }),
);

app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
        router: serverRouter,
        createContext,
    }),
);

export default app;
