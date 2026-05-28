import { z } from "zod";

const envSchema = z.object({
    JWT_SECRET: z.string().describe("Secret key for JWT tokens"),
});

function createEnv(env: NodeJS.ProcessEnv) {
    const safeParseResult = envSchema.safeParse(env);
    if (!safeParseResult.success) {
        console.error("ENVIRONMENT VARIABLE ERROR:");
        console.error(JSON.stringify(safeParseResult.error.issues, null, 2));
        console.error("Available ENV KEYS:", Object.keys(process.env).join(", "));
        throw new Error(safeParseResult.error.message);
    }
    return safeParseResult.data;
}

export const env = createEnv(process.env);
