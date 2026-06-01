import mongoose from "mongoose";
import { type ProductI, type ProductModelI  } from '@devshopapp/common';

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    images: [
        {
            src: {
                type: String,
                required: true
            }
        }
    ]
}, {
    toJSON: {
        transform(doc, ret: any) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
        }
    }
});

export const Product = mongoose.model<ProductI, ProductModelI>('Product', schema);