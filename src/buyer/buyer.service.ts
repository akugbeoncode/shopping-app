import { BadRequestError, NotAuthorizedError } from "@devshopapp/common";
import { productService, type ProductService } from "../seller/product/product.service.js";
import { cartService, type CartService } from "./cart/cart.service.js";
import type { AddProductToCartDtoI, RemoveProductFromCartDtoI, UpdateCartProductQuantityDtoI } from "./dtos/cart.dto.js";

import Stripe from "stripe";
import { config } from "../shared/app.config.js";
import { orderService, type OrderService } from "./order/order.service.js";
import { CartProduct } from "./cart/cart.product.model.js";

export class BuyerService {
    constructor(
        public readonly cartService: CartService,
        public readonly productService: ProductService,
        public readonly orderService: OrderService,
        public readonly stripeService: Stripe
    ) {}

    async addProductToCart(addProductToCartData: AddProductToCartDtoI) {
        const product = await this.productService.getOneById(addProductToCartData.productId);

        if (!product) {
            return new BadRequestError("Product not found");
        }

        const cart = await this.cartService.addProduct(addProductToCartData, product);

        if (!cart) {
            return new Error("Failed to add product to cart");
        }

        return cart;
    }

    async updateProductQuantity(updateProductQuantityData: UpdateCartProductQuantityDtoI) {
        const { cartId, productId, options } = updateProductQuantityData;

        const cartProduct = await this.cartService.getCartProductById(cartId, productId);

        if (!cartProduct) {
            return new BadRequestError("Cart product not found");
        }

        const cart = await this.cartService.updateProductQuantity(updateProductQuantityData);

        if (!cart) {
            return new Error("Failed to update product quantity");
        }

        return cart;
    }

    async removeProductFromCart(removeProductFromCartData: RemoveProductFromCartDtoI) {
        const { cartId, productId } = removeProductFromCartData;

        const cartProduct = await this.cartService.getCartProductById(cartId, productId);

        if (!cartProduct) {
            return new BadRequestError("Cart product not found");
        }

        const cart = await this.cartService.removeProductFromCart({ cartId, productId });
        if (!cart) {
            return new Error("Failed to remove product from cart");
        }

        return cart;
    }

    async getCart(cartId: string, userId: string) {
        const cart = await this.cartService.getCart(cartId);
        if (!cart) {
            return new BadRequestError("Cart not found");
        }
        if (cart.user.toString() !== userId) {
            return new NotAuthorizedError();
        }
        return cart;
    }

    async checkout(userId: string, cardToken: string, userEmail: string) {
        const cart = await this.cartService.findCartByUserId(userId);
        let customerId: string;

        if (!cart) return new BadRequestError("your cart is empty");
        if (cart.products.length <= 0) return new BadRequestError("your cart is empty");

        if (cart.customerId) {
            customerId = cart.customerId;
        } else {
            const { id } = await this.stripeService.customers.create({
                email: userEmail,
                source: cardToken
            });
            customerId = id;
            await cart.set({ customerId }).save();
        }

        if (!customerId) return new BadRequestError("invalid data! customer id is required");

        const charge = await this.stripeService.charges.create({
            amount: cart.totalPrice * 100,
            currency: 'usd',
            customer: customerId
        });

        if (!charge) return new BadRequestError("invalid data! could not create the charge!");

        await this.orderService.createOrder({
            userId,
            totalAmount: cart.totalPrice,
            chargeId: charge.id
        })

        await this.cartService.clearCart(userId, cart.id);

        return charge;
    }

    async updateCustomerStripeCard(userId: string, newCardToken: string) {
        const cart = await this.cartService.findCartByUserId(userId);
        if (!cart) return new BadRequestError("your cart is empty");
        if (!cart.customerId) return new BadRequestError("you are not a customer!");

        try {
            await this.stripeService.customers.update(cart.customerId, {
                source: newCardToken
            });
        } catch (error) {
            return new Error("card update failed!");
        }
        
        return true;
    }
}

export const buyerService = new BuyerService(
    cartService, 
    productService, 
    orderService,
    new Stripe(config.STRIPE_KEY!, { apiVersion: '2026-05-27.dahlia' })
);