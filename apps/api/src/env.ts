import { z } from "zod";

const envSchema = z.object({
    PORT: z.string().optional(),
    NODE_ENV: z.enum(["development", "production", "prod"]).default("development"),
    BASE_URL: z.string().default("http://localhost:8000"),
    WEB_URL: z.string().default("http://localhost:3000"),
});

function createEnv(env: NodeJS.ProcessEnv) {
    const safeParseResult = envSchema.safeParse(env);
    if (!safeParseResult.success) {
        console.error("ENVIRONMENT VARIABLE ERROR (API):");
        console.error(JSON.stringify(safeParseResult.error.issues, null, 2));
        console.error("Available ENV KEYS:", Object.keys(process.env).join(", "));
        throw new Error(safeParseResult.error.message);
    }
    return safeParseResult.data;
}

export const env = createEnv(process.env);
