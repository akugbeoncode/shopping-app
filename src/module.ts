import { json, urlencoded, type Application } from "express";
import cors from 'cors';
import cookieSession from 'cookie-session';
import mongoose from 'mongoose';
import { currentUser, errorHandler } from '@devshopapp/common';

import { config } from "./shared/app.config.js";
import { authRouter } from './auth/auth.routers.js';
import { sellerRouter } from "./seller/seller.routers.js";

export class AppModule {
    private PORT = config.PORT||8080;

    constructor(public app: Application) {
        app.set('trust proxy', true);
        app.use(cors({ origin: ["http://localhost:8080"], credentials: true, optionsSuccessStatus: 200 }));
        app.use(urlencoded({ extended: false }));
        app.use(json());
        app.use(cookieSession({ signed: false, secure: false }));

        app.use(currentUser(config.JWT_KEY!))
        app.use(authRouter);
        app.use(sellerRouter);
        app.use(errorHandler);

        Object.setPrototypeOf(this, AppModule.prototype);
    }

    async start() {
        if (!config.MONGO_URI) throw new Error("mongo uri must be defined!");
        if (!config.JWT_KEY) throw new Error("jwt secret must be defined!");
        if (!config.STRIPE_KEY) throw new Error("Stripe key must be defined!");

        try {
            await mongoose.connect(config.MONGO_URI);
        } catch(err) {
            throw new Error("Databse connection error");
        }

        this.app.listen(this.PORT, () => {
            console.log(`\n\n=================================================\n`)
            console.log(`OK!  Server is running on PORT: ${this.PORT}`)
            console.log(`\n=================================================\n\n`)
        });
    }
}