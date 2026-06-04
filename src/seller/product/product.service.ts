import { UPLOADS_DIRECTORY, type ProductModelI } from "@devshopapp/common";
import fs from "fs";
import path from "path";

import type { AddImagesDtoI, CreateProductDtoI, DeleteImagesDtoI, DeleteProductDtoI, UpdateProductDtoI } from "../dtos/product.dto.js";
import { Product } from "./product.model.js";

export class ProductService {
  constructor(public readonly productModel: ProductModelI) {}

  async create(createProductDto: CreateProductDtoI) {
    const images = this.generateProductImages(createProductDto.files);

    const product = await this.productModel.create({
        user: createProductDto.userId,
        name: createProductDto.name,
        description: createProductDto.description||"",
        price: createProductDto.price,
        images
    });

    return await product.save();
  }

  async getAll(): Promise<ProductModelI[]> {
    return [];
  }

  // Method to retrieve a product by its ID
  async getOneById(productId: string) {
    return await this.productModel.findById(productId);
  }

  // Method to update an existing product
  async update(updatedData: UpdateProductDtoI) {
    return this.productModel.findOneAndUpdate(
      { _id: updatedData.productId },
      {
        name: updatedData.name,
        description: updatedData.description,
        price: updatedData.price
      },
      { new: true }
    );
  }

  async delete(deleteData: DeleteProductDtoI) {
    return await this.productModel.findOneAndDelete({ _id: deleteData.productId });
  }

  async addImage(addImagesData: AddImagesDtoI) {
    const images = this.generateProductImages(addImagesData.files);
    return await this.productModel.findOneAndUpdate(
      { _id: addImagesData.productId },
      { $push: { images: { $each: images } } },
      { new: true }
    );
  }

  async deleteImages(deleteImagesData: DeleteImagesDtoI) {
    return await this.productModel.findOneAndUpdate(
      { _id: deleteImagesData.productId },
      { $pull: { images: { $in: deleteImagesData.imagesIds } } },
      { new: true }
    );
  }

  generateBase64Url(contentType: string, buffer: Buffer): string {
    return `data:${contentType};base64,${buffer.toString('base64')}`;
  }

  generateProductImages(files: CreateProductDtoI["files"]): Array<{ src: string }> {
    let images: Array<Express.Multer.File> = [];

    if (typeof files === "object") {
        images = Object.values(files).flat() as Array<Express.Multer.File>;
    } else {
        images = files ? files as Array<Express.Multer.File> : [];
    }
    return images.map(file => {
        let scrObj = { src: this.generateBase64Url(file.mimetype, fs.readFileSync(path.join(`${UPLOADS_DIRECTORY}${file.filename}`))) };
        fs.unlink(path.join(`${UPLOADS_DIRECTORY}${file.filename}`), () => {});
        return scrObj;
    });
  }
}

export const productService = new ProductService(Product);