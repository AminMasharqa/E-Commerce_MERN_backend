import { Document, Schema } from "mongoose";
import { type   ObjectId } from "mongoose";
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
const orderItemSchema = new Schema<IOrderItem>({
    productTitle: {type: String, required: true},
    productImage: {type: String, required: true},
    unitPrice: {type: Number, required: true},
    quantity: {type: Number, required: true},
});

const orderSchema = new Schema<IOrder>({
    orderItems: {type: [orderItemSchema], required: true},
    total: {type: Number, required: true},
    subtotal: {type: Number},
    shipping: {type: Number},
    tax: {type: Number},
    address: {type: String, required: true},
    status: {type: String, default: 'pending'},
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
}, {
    timestamps: true
});

export const orderModel = mongoose.model<IOrder>("Order", orderSchema);

