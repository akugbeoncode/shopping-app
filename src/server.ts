import express from 'express';
import type { JwtPayload } from '@devshopapp/common';

import { AppModule } from "./module.js"

declare global {
    namespace Express {
        interface Request {
            currentUser?: JwtPayload;
        }
    }
}

const bootstrap = async () => {
    const app = new AppModule(express());

    await app.start();
};

bootstrap();