import type { UserI } from "@devshopapp/common";
import type { Request } from "express";
import mongoose from "mongoose";

export interface CreateProductDtoI {
  name: string;
  description?: string;
  price: number;
  userId: string;
  files?: Request["files"];
}

export interface UpdateProductDtoI {
  name?: string;
  description?: string;
  price?: number;
  userId?: string;
  productId: string;
}

export interface DeleteProductDtoI {
  productId: string;
  userId: string;
}

export interface AddImagesDtoI {
  userId: string;
  productId: string;
  files?: Request["files"];
}

export interface DeleteImagesDtoI {
  userId: string;
  productId: string;
  imagesIds: Array<string>;
}