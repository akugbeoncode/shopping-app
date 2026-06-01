import dotenv from "dotenv";

dotenv.config();

export const config = {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT,
    JWT_KEY: process.env.JWT_KEY
}