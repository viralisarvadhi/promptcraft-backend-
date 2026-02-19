import { config as dotenvConfig } from 'dotenv';
import { z } from 'zod';

dotenvConfig();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.string().transform(Number).pipe(z.number().positive()).default('5000'),
    API_PREFIX: z.string().default('/api/v1'),

    DB_HOST: z.string().min(1, 'DB_HOST is required'),
    DB_PORT: z.string().transform(Number).pipe(z.number().positive()).default('5432'),
    DB_NAME: z.string().min(1, 'DB_NAME is required'),
    DB_USER: z.string().min(1, 'DB_USER is required'),
    DB_PASSWORD: z.string().min(1, 'DB_PASSWORD is required'),

    JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
    JWT_EXPIRES_IN: z.string().default('7d'),
    JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 characters'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

    AI_PROVIDER: z.enum(['gemini']).default('gemini'),
    ENABLE_AI_EVALUATION: z.string().transform((val) => val === 'true').default('false'),
    GEMINI_API_KEY: z.string().optional().default(''),
    GEMINI_MODEL: z.string().default('gemini-1.5-flash'),

    RATE_LIMIT_WINDOW_MS: z.string().transform(Number).pipe(z.number().positive()).default('900000'),
    RATE_LIMIT_MAX: z.string().transform(Number).pipe(z.number().positive()).default('100'),
    EVAL_RATE_LIMIT_MAX: z.string().transform(Number).pipe(z.number().positive()).default('20'),

    CORS_ORIGIN: z.string().default('http://localhost:3000'),
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

function validateEnv(): z.infer<typeof envSchema> {
    try {
        const validated = envSchema.parse(process.env);
        return validated;
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('❌ Environment variable validation failed:');
            error.errors.forEach((err) => {
                console.error(`  - ${err.path.join('.')}: ${err.message}`);
            });
            process.exit(1);
        }
        throw error;
    }
}

export const config = validateEnv();

export type Config = z.infer<typeof envSchema>;
