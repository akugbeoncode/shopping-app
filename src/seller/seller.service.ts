import { BadRequestError, NotAuthorizedError } from "@devshopapp/common";
import type { AddImagesDtoI, CreateProductDtoI, DeleteImagesDtoI, DeleteProductDtoI, UpdateProductDtoI } from "./dtos/product.dto.js";
import { productService, type ProductService } from "./product/product.service.js";

export class SellerService {
    constructor(public readonly productService: ProductService) {}

    async addProduct(createProductDto: CreateProductDtoI) {
        return await this.productService.create(createProductDto);
    }

    async updateProduct(updatedData: UpdateProductDtoI) {
        const product = await this.productService.getOneById(updatedData.productId);
        if (!product) {
            return new BadRequestError("Product not found");
        }

        if (product.user.toString() !== updatedData.userId) {
            return new NotAuthorizedError();
        }

        return await this.productService.update(updatedData);
    }

    async deleteProduct(deleteData: DeleteProductDtoI) {
        const product = await this.productService.getOneById(deleteData.productId);
        
        if (!product) {
            return new BadRequestError("Product not found");
        }

        if (product.user.toString() !== deleteData.userId) {
            return new NotAuthorizedError();
        }

        return await this.productService.delete(deleteData);
    }

    async addProductImages(addImagesData: AddImagesDtoI) {
        const product = await this.productService.getOneById(addImagesData.productId);
        
        if (!product) {
            return new BadRequestError("Product not found");
        }

        if (product.user.toString() !== addImagesData.userId) {
            return new NotAuthorizedError();
        }

        return await this.productService.addImage(addImagesData);
    }

    async deleteProductImages(deleteImagesData: DeleteImagesDtoI) {
        const product = await this.productService.getOneById(deleteImagesData.productId);
        
        if (!product) {
            return new BadRequestError("Product not found");
        }

        if (product.user.toString() !== deleteImagesData.userId) {
            return new NotAuthorizedError();
        }

        return await this.productService.deleteImages(deleteImagesData);
    }
}

export const sellerService = new SellerService(productService);