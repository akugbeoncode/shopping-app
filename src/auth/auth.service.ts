import { AuthenticationService, BadRequestError } from "@devshopapp/common";

import type { AuthDtoI } from "./dtos/auth.dto.js";
import { userService, type UserService } from "./user/user.service.js";

class AuthService {
    constructor(
        public userService: UserService,
        public authenticationService: AuthenticationService
    ) {}

    async signup(createUserDto: AuthDtoI) {
        const existingUser = await this.userService.findOneByEmail(createUserDto.email);
        if (existingUser) return { message: "this email is taken" };

        const user = await this.userService.create(createUserDto);

        const token = this.authenticationService.generateJwt({
            email: createUserDto.email,
            userId: user.id
        }, process.env.JWT_KEY!);

        return { token };
    }

    async signin(signinDto: AuthDtoI) {
        const user = await this.userService.findOneByEmail(signinDto.email);
        if (!user) return { message: "invalid credentials" };

        const userValidated = await this.authenticationService.pwdCompare(user.password, signinDto.password)

        if (!userValidated) return { message: "invalid credentials" };

        const token = this.authenticationService.generateJwt({
            email: signinDto.email,
            userId: user.id
        }, process.env.JWT_KEY!);

        return { token };
    }
}

export const authService = new AuthService(userService, new AuthenticationService());