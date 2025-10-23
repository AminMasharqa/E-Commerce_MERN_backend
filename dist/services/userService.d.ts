interface RegisterParams {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
interface LoginParams {
    email: string;
    password: string;
}
export declare const register: ({ firstName, lastName, email, password }: RegisterParams) => Promise<{
    data: string;
    statusCode: number;
}>;
export declare const login: ({ email, password }: LoginParams) => Promise<{
    data: string;
    statusCode: number;
}>;
interface GetOrdersForUserParams {
    userId: string;
}
export declare const getOrdersForUser: ({ userId }: GetOrdersForUserParams) => Promise<{
    data: (import("mongoose").Document<unknown, {}, import("../models/orderModelt.js").IOrder, {}, {}> & import("../models/orderModelt.js").IOrder & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[];
    statusCode: number;
} | {
    data: string;
    statusCode: number;
}>;
export {};
//# sourceMappingURL=userService.d.ts.map