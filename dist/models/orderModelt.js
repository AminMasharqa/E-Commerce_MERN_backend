"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const orderItemSchema = new mongoose_1.Schema({
    productTitle: { type: String, required: true },
    productImage: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
});
const orderSchema = new mongoose_1.Schema({
    orderItems: { type: [orderItemSchema], required: true },
    total: { type: Number, required: true },
    subtotal: { type: Number },
    shipping: { type: Number },
    tax: { type: Number },
    address: { type: String, required: true },
    status: { type: String, default: 'pending' },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
}, {
    timestamps: true
});
exports.orderModel = mongoose_2.default.model("Order", orderSchema);
