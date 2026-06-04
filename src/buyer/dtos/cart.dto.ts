export interface AddProductToCartDtoI {
    userId: string;
    productId: string;
    quantity: number;
}

export interface CreateCartProductDtoI {
    cartId: string;
    productId: string;
    quantity: number;
}

export interface RemoveProductFromCartDtoI {
    cartId: string;
    productId: string;
}

export interface UpdateCartProductQuantityDtoI {
    cartId: string;
    productId: string;
    options: {  
        increment?: boolean;
        amount: number;
    }
}