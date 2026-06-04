import dotenv from "dotenv";

dotenv.config();

export const config = {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT,
    STRIPE_KEY: process.env.STRIPE_KEY,
    JWT_KEY: process.env.JWT_KEY
}