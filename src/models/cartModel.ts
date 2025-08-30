import mongoose , { Schema, Document, type ObjectId } from "mongoose";   
import type { IProduct } from "./productModel.ts";

const CartStatusEnum = ["active", "completed"] ;

export interface IcartItem extends Document {
    productId: IProduct;
    quantity: number;
    unitPrice: number;
}

export interface ICart extends Document {
    userId: ObjectId | string;
    items: IcartItem[];
    totalAmount: number;
    status : "active" | "completed";

}

const cartIItemSchema = new Schema<IcartItem>({
    productId: {type: Schema.Types.ObjectId, ref: "Product", required: true},
    quantity: {type: Number, required: true},
    unitPrice: {type: Number, required: true},
});

const cartSchema = new Schema<ICart>({
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    items: {type: [cartIItemSchema], required: true},
    totalAmount: {type: Number, required: true},
    status: {type: String, required: true},
});

export const cartModel = mongoose.model<ICart>("Cart", cartSchema);

export default cartModel;