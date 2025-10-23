import mongoose from "mongoose";
export interface IProduct {
    title: string;
    image: string;
    price: number;
    stock: number;
}
declare const productModel: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct, {}, {}> & IProduct & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;
export default productModel;
//# sourceMappingURL=productModel.d.ts.map