import type { OrderModelI } from "@devshopapp/common";
import { Order } from "./order.model.js";
import type { CreateOrderDtoI } from "../dtos/order.dto.js";

export class OrderService {
    constructor(
        public readonly orderModel: OrderModelI
    ) {}

    async createOrder(createOrderData: CreateOrderDtoI) {
        const order = new this.orderModel({
            user: createOrderData.userId,
            totalPrice: createOrderData.totalAmount,
            chargeId: createOrderData.chargeId
        });

        return await order.save();
    }
}

export const orderService = new OrderService(Order);