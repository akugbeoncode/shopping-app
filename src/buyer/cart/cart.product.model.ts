import mongoose from "mongoose";
import type { CartModelI, CartProductI, CartProductModelI } from "@devshopapp/common";

const schema = new mongoose.Schema({
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
}, {
    toJSON: {
        transform(doc, ret: any) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
        }
    }
});

export const CartProduct = mongoose.model<CartProductI, CartProductModelI>('CartProduct', schema);