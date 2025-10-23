import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
});
const productModel = mongoose.model("Product", productSchema);
export default productModel;
//# sourceMappingURL=productModel.js.map