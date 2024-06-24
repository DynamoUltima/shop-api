"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
exports.default = (0, drizzle_kit_1.defineConfig)({
    dialect: "postgresql", // "postgresql" | "mysql"
    // driver: "turso" ,// optional and used only if `aws-data-api`, `turso`, `d1-http`(WIP) or `expo` are used
    dbCredentials: {
        url: "postgresql://neondb_owner:3VYIaseElU7F@ep-ancient-flower-a2z7kx3f.eu-central-1.aws.neon.tech/neondb?sslmode=require"
    },
    // migrations: {
    //     table: "migrations",
    //     schema: "public"
    // },
    schema: './src/db/schema.ts',
});
// import type { Config } from 'drizzle-kit';
// export default {
//     dialect: "sqlite", // "postgresql" | "mysql",
//     schema: './src/db/schema.ts',
//     out: './drizzle',
// } satisfies Config;
