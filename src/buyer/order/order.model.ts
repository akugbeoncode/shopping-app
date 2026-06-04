import mongoose from "mongoose";
import type { OrderI, OrderModelI } from "@devshopapp/common";

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    chargeId: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret: any) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

export const Order = mongoose.model<OrderI, OrderModelI>('Order', schema);