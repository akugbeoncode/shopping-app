export interface CreateOrderDtoI {
    userId: string;
    totalAmount: number;
    chargeId: number | string;
}