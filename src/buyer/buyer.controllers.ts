import type { NextFunction, Request, Response } from "express";
import { BadRequestError, CustomError } from "@devshopapp/common";

import { buyerService } from "./buyer.service.js";
import type { AddProductToCartDtoI } from "./dtos/cart.dto.js";

export const addProductToCartController = async (req: Request, res: Response, next: NextFunction) => {
    const { productId, quantity } = req.body as AddProductToCartDtoI;

    const result = await buyerService.addProductToCart({
        productId,
        quantity,
        userId: req.currentUser!.userId
     });

    if (result instanceof CustomError || result instanceof Error) {
        return next(result);
    }

    req.session = { ...req.session, cartId: result._id.toString() };

    res.status(200).json(result);
}

export const updateProductQuantityController = async (req: Request, res: Response, next: NextFunction) => {
    const { cartId, productId } = req.params;
    const { amount } = req.body;

    const increment = req.body.increment === 'true' ? true : req.body.increment === 'false' ? false : null;

    if (increment === null) {
        return next(new BadRequestError("Invalid increment value. Must be 'true' or 'false'."));
    }

    const result = await buyerService.updateProductQuantity({
        cartId: cartId as string,
        productId: productId as string,
        options: {
            increment,
            amount
        }
    });

    if (result instanceof CustomError || result instanceof Error) {
        return next(result);
    }

    res.status(200).json(result);
}

export const removeProductFromCartController = async (req: Request, res: Response, next: NextFunction) => {
    const { cartId, productId } = req.params;

    const result = await buyerService.removeProductFromCart({
        cartId: cartId as string,
        productId: productId as string
    });

    if (result instanceof CustomError || result instanceof Error) {
        return next(result);
    }

    res.status(200).json(result);
}

export const getSingleCartController = async (req: Request, res: Response, next: NextFunction) => {
    const cartId = req.session?.cartId;

    if (!cartId) {
        return next(new BadRequestError("Cart ID is required"));
    }

    const result = await buyerService.getCart(cartId as string, req.currentUser!.userId);

    if (result instanceof CustomError || result instanceof Error) {
        return next(result);
    }

    res.status(200).json(result);
}

export const paymentCheckoutController = async (req: Request, res: Response, next: NextFunction) => {
    const { cardToken } = req.body;

    const result = await buyerService.checkout(req.currentUser!.userId, cardToken, req.currentUser!.email);

    if (result instanceof CustomError) {
        return next(result);
    }

    res.status(200).json(result.id);
}

export const paymentCardUpdateController = async (req: Request, res: Response, next: NextFunction) => {
    const { cardToken } = req.body;
    const result = await buyerService.updateCustomerStripeCard(req.currentUser!.userId, cardToken);

    if (result instanceof CustomError || result instanceof Error) {
        return next(result);
    }

    res.status(200).json(result);
}