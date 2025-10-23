import { Document } from "mongoose";
import { type ObjectId } from "mongoose";
import mongoose from "mongoose";
export interface IOrderItem extends Document {
    productTitle: string;
    productImage: string;
    unitPrice: number;
    quantity: number;
}
export interface IOrder extends Document {
    orderItems: IOrderItem[];
    total: number;
    subtotal?: number;
    shipping?: number;
    tax?: number;
    address: string;
    status?: string;
    userId: string | ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const orderModel: mongoose.Model<IOrder, {}, {}, {}, Document<unknown, {}, IOrder, {}, {}> & IOrder & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=orderModelt.d.ts.map