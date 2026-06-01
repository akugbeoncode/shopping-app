import type { UserModelI } from "@devshopapp/common";
import { User } from "./user.model.js";
import type { AuthDtoI } from "../dtos/auth.dto.js";

export class UserService {
    constructor(public userModel: UserModelI) {}

    async create(authDto: AuthDtoI) {
        const user = new this.userModel({
            email: authDto.email,
            password: authDto.password
        });

        return await user.save();
    }

    async findOneByEmail(email: string) {
        return await this.userModel.findOne({ email });
    }
}

export const userService = new UserService(User);

