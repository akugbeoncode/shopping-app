import mongoose from "mongoose";
import { AuthenticationService, type UserI, type UserModelI  } from '@devshopapp/common';

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
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

schema.pre('save', async function () {
    const authenticationService = new AuthenticationService();

    if (!this.isModified("password")) {
        return;
    }

    this.password = await authenticationService.pwdToHash(
        this.password
    );
});

export const User = mongoose.model<UserI, UserModelI>('User', schema);