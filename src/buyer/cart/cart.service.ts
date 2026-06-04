import type { CartModelI, CartProductModelI, ProductI } from "@devshopapp/common";
import { Cart } from "./cart.model.js";
import { CartProduct } from "./cart.product.model.js";
import type { AddProductToCartDtoI, CreateCartProductDtoI, RemoveProductFromCartDtoI, UpdateCartProductQuantityDtoI } from "../dtos/cart.dto.js";

export class CartService {
    constructor(
        public readonly cartModel: CartModelI,
        public readonly cartProductModel: CartProductModelI
    ) {}

    async findCartByUserId(userId: string) {
        return await this.cartModel.findOne({ user: userId });
    }

    async getCart(cartId: string) {
        return await this.cartModel.findOne({_id: cartId});
    }

    async clearCart(userId: string, cartId: string) {
        return await this.cartModel.findOneAndUpdate(
            { _id: cartId, user: userId },
            { $set: { products: [], totalPrice: 0 } },
            { new: true }
        )
    }

    async getCartProductById(cartId: string, productId: string) {
        return await this.cartProductModel.findOne({ cart: cartId, product: productId }).populate('product');
    }

    async createCart(userId: string) {
        const cart = new this.cartModel({ 
            user: userId
        });
        return await cart.save();
    }

    async createCartProduct(createCartProductData: CreateCartProductDtoI) {
        const cartProduct = new this.cartProductModel({
            cart: createCartProductData.cartId,
            product: createCartProductData.productId,
            quantity: createCartProductData.quantity
        });
        return await cartProduct.save();
    }   

    async isProductInCart(cartId: string, productId: string): Promise<boolean> {
        const exists = await this.cartProductModel.exists({ cart: cartId, product: productId });
        return !!exists;
    }

    async removeProductFromCart(removeProductFromCartData: RemoveProductFromCartDtoI) {
        const { cartId, productId } = removeProductFromCartData;
        const cartProduct = await this.cartProductModel.findOneAndDelete({ cart: cartId, product: productId });
        if (!cartProduct) return null;

        const product = await cartProduct.populate('product') as ProductI;

        const updatedCart = await this.cartModel.findByIdAndUpdate(
            { _id: cartId },
            { $pull: { products: cartProduct.id }, $inc: { totalPrice: -(product.price * cartProduct.quantity) } },
            { new: true }
        );

        return updatedCart;
    }

    async updateProductQuantity(updateProductQuantityData: UpdateCartProductQuantityDtoI) {
        const { cartId, productId, options } = updateProductQuantityData;
        const { increment, amount } = options;
        const cartProduct = await this.cartProductModel.findOne({ cart: cartId, product: productId });
        if (!cartProduct || amount === undefined) return null;

        if (!increment && cartProduct.quantity < amount) {
            return await this.removeProductFromCart({ cartId, productId });
        } 

        const updatedCartProduct = await this.cartProductModel.findOneAndUpdate(
            { cart: cartId, product: productId },
            { $inc: { quantity: increment ? amount : -amount } },
            { new: true }
        ).populate('product');

        const product = updatedCartProduct?.product as ProductI;

        const updatedCartProductPrice = increment ? (product?.price * amount) : -(product.price * amount);

        return await this.cartModel.findByIdAndUpdate(
            { _id: cartId },
            { $inc: { totalPrice: updatedCartProductPrice } },
            { new: true }
        );
    }

    async addProduct(addProductToCartDto: AddProductToCartDtoI, product: ProductI) {
        const { userId, productId, quantity } = addProductToCartDto;

        let cart = await this.findCartByUserId(userId);

        const productInCart = cart && await this.isProductInCart(cart.id, productId);

        if (productInCart && cart) {
            return await this.updateProductQuantity({
                cartId: cart.id,
                productId,
                options: { increment: true, amount: quantity }
            });
        }

        if (!cart) {
            cart = await this.createCart(userId);
        }

        const cartProduct = await this.createCartProduct({
            cartId: cart.id,
            productId,
            quantity
        });

        return await this.cartModel.findByIdAndUpdate(
            { _id: cart.id },
            { $push: { products: cartProduct }, $inc: { totalPrice: quantity * product.price } },
            { new: true }
        );
    }
}

export const cartService = new CartService(Cart, CartProduct);