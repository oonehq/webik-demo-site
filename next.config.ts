import type { NextConfig } from "next";
const config: NextConfig = { devIndicators: false, allowedDevOrigins: process.env.WEBIK_DEV_HOST ? [process.env.WEBIK_DEV_HOST] : [] };
export default config;
