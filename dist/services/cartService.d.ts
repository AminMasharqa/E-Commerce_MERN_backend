type GetActiveCartForUserParams = {
    userId: string;
    populateProduct?: boolean;
};
type AddItemToCartParams = {
    userId: string;
    productId: string;
    quantity: number;
};
type UpdateItemInCartParams = {
    productId: any;
    quantity: number;
    userId: string;
};
type ServiceResult<T> = {
    data: T;
    statusCode: number;
};
export declare const getActiveCartForUser: ({ userId, populateProduct }: GetActiveCartForUserParams) => Promise<import("mongoose").Document<unknown, {}, import("../models/cartModel.js").ICart, {}, {}> & import("../models/cartModel.js").ICart & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export declare const addItemToCart: ({ userId, productId, quantity, }: AddItemToCartParams) => Promise<ServiceResult<any>>;
export declare const updateItemInCart: ({ productId, userId, quantity }: UpdateItemInCartParams) => Promise<ServiceResult<any>>;
type RemoveItemFromCartParams = {
    userId: string;
    productId: string;
};
export declare const removeItemFromCart: ({ userId, productId, }: RemoveItemFromCartParams) => Promise<ServiceResult<any>>;
type ClearCartParams = {
    userId: string;
};
export declare const clearCart: ({ userId }: ClearCartParams) => Promise<ServiceResult<any>>;
type CheckoutCartParams = {
    userId: string;
    address: string;
};
export declare const checkoutCart: ({ userId, address }: CheckoutCartParams) => Promise<ServiceResult<any>>;
export {};
//# sourceMappingURL=cartService.d.ts.map