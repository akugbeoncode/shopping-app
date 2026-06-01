import express from 'express';

import { AppModule } from "./module.js"

const bootstrap = async () => {
    const app = new AppModule(express());

    await app.start();
};

bootstrap();