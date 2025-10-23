import mongoose, { Schema, Document } from "mongoose";
const CartStatusEnum = ["active", "completed"];
const cartIItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
});
const cartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [cartIItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, required: true },
});
export const cartModel = mongoose.model("Cart", cartSchema);
export default cartModel;
//# sourceMappingURL=cartModel.js.map