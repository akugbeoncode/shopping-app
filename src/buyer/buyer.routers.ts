import { Router } from "express";
import { requireAuth } from "@devshopapp/common";
import { 
    addProductToCartController, 
    getSingleCartController, 
    paymentCardUpdateController, 
    paymentCheckoutController, 
    removeProductFromCartController, 
    updateProductQuantityController 
} from "./buyer.controllers.js";

const router = Router();

router.post('/api/cart/add', requireAuth, addProductToCartController);
router.get('/api/cart/:cartId', requireAuth, getSingleCartController);
router.post('/api/cart/:cartId/products/:productId', requireAuth, removeProductFromCartController);
router.post('/api/cart/:cartId/products/:productId/update-quantity', requireAuth, updateProductQuantityController);
router.get('/api/payment/checkout', requireAuth, paymentCheckoutController);
router.get('/api/payment/card/update', requireAuth, paymentCardUpdateController);

export { router as buyerRouters }