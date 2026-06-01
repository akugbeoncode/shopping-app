import { type Request, type Response, type NextFunction } from 'express';

import { authService } from './auth.service.js';
import { BadRequestError } from '@devshopapp/common';

export const signupController = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const result = await authService.signup({ email, password });

    if (result.message) return next(new BadRequestError(result.message));

    req.session = { jwt: result.token };

    res.status(201).send(true);
}

export const signinController = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const result = await authService.signin({ email, password });

    if (result.message) return next(new BadRequestError(result.message));

    req.session = { jwt: result.token };

    res.status(200).send(true);
}

export const getCurrentUserController = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.currentUser;

    if (!user) return next(new Error(""))

    res.status(200).send(user);
}