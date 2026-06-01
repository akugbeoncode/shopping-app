import { BadRequestError, CustomError } from "@devshopapp/common";
import type { NextFunction, Request, Response } from "express";

import { sellerService } from "./seller.service.js";

export const createProductController = async (req: Request, res: Response, next: NextFunction) => {
    const { name, price, description } = req.body;

    if (!req.files || req.files.length === 0) {
        return next(new BadRequestError("No files uploaded"));
    }

    if (req.uploaderError) {
        return next(new BadRequestError(req.uploaderError.message));
    }

    const product = await sellerService.addProduct({
        name,
        price: parseFloat(price),
        description,
        userId: req.currentUser!.userId,
        files: req.files
    });

    res.status(201).json(product);
}


export const updateProductController = async (req: Request, res: Response, next: NextFunction) => {
    const { name, price, description } = req.body;
    const id  = req.params.id as string | undefined;

    if (!id) {
        return next(new BadRequestError("Product ID is required"));
    }

    const result = await sellerService.updateProduct({
        productId: id,
        name,
        price: price ? parseFloat(price) : 0,
        description,
        userId: req.currentUser!.userId
    });

    if (result instanceof CustomError) {
        return next(result);
    }

    res.status(200).json(result);
}

export const deleteProductController = async (req: Request, res: Response, next: NextFunction) => {
    const id  = req.params.id as string | undefined;

    if (!id) {
        return next(new BadRequestError("Product ID is required"));
    }

    const result = await sellerService.deleteProduct({
        productId: id,
        userId: req.currentUser!.userId
    });

    if (result instanceof CustomError) {
        return next(result);
    }

    res.status(200).send(true);
}

export const addProductImagesController = async (req: Request, res: Response, next: NextFunction) => {
    const id  = req.params.id as string | undefined;

    if (!id) {
        return next(new BadRequestError("Product ID is required"));
    }

    if (!req.files || req.files.length === 0) {
        return next(new BadRequestError("No files uploaded"));
    }

    if (req.uploaderError) {
        return next(new BadRequestError(req.uploaderError.message));
    }

    const result = await sellerService.addProductImages({
        productId: id,
        userId: req.currentUser!.userId,
        files: req.files
    });

    if (result instanceof CustomError) {
        return next(result);
    }

    res.status(200).json(result);
}

export const deleteProductImagesController = async (req: Request, res: Response, next: NextFunction) => {
    const id  = req.params.id as string | undefined;
    const { imagesIds } = req.body;

    if (!id) {
        return next(new BadRequestError("Product ID is required"));
    }

    if (!imagesIds || !Array.isArray(imagesIds) || imagesIds.length === 0) {
        return next(new BadRequestError("No image IDs provided"));
    }

    const result = await sellerService.deleteProductImages({
        productId: id,
        userId: req.currentUser!.userId,
        imagesIds
    });

    if (result instanceof CustomError) {
        return next(result);
    }

    res.status(200).json(result);
}