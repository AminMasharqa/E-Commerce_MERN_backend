import { Document, Schema } from "mongoose";
import {} from "mongoose";
import mongoose from "mongoose";
const orderItemSchema = new Schema({
    productTitle: { type: String, required: true },
    productImage: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
});
const orderSchema = new Schema({
    orderItems: { type: [orderItemSchema], required: true },
    total: { type: Number, required: true },
    subtotal: { type: Number },
    shipping: { type: Number },
    tax: { type: Number },
    address: { type: String, required: true },
    status: { type: String, default: 'pending' },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, {
    timestamps: true
});
export const orderModel = mongoose.model("Order", orderSchema);
//# sourceMappingURL=orderModelt.js.map