import mongoose, { Document, type ObjectId } from "mongoose";
import type { IProduct } from "./productModel.js";
export interface IcartItem extends Document {
    productId: IProduct;
    quantity: number;
    unitPrice: number;
}
export interface ICart extends Document {
    userId: ObjectId | string;
    items: IcartItem[];
    totalAmount: number;
    status: "active" | "completed";
}
export declare const cartModel: mongoose.Model<ICart, {}, {}, {}, mongoose.Document<unknown, {}, ICart, {}, {}> & ICart & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default cartModel;
//# sourceMappingURL=cartModel.d.ts.map