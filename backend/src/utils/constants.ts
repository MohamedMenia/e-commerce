export const CACHE_TTL_SECONDS = 3600; // 1 hour
export const JWT_SECRET = process.env.JWT_SECRET||"";
export const JWT_EXPIRES_IN = "1h";
export const JWT_REFRESH_EXPIRES_IN = "30d";
export const REFRESH_TOKEN_LIFETIME=  5 * 24 * 60 * 60; // 5 days in seconds