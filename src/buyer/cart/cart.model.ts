import mongoose from "mongoose";
import type { CartI, CartModelI } from "@devshopapp/common";

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CartProduct',
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },

    customerId: {
        type: String
    }
}, {
    toJSON: {
        transform(doc, ret: any) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

export const Cart = mongoose.model<CartI, CartModelI>('Cart', schema);