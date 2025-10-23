import type { IProduct } from "../models/productModel.js";
export declare const createProduct: (product: IProduct) => Promise<import("mongoose").Document<unknown, {}, IProduct, {}, {}> & IProduct & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare const getProducts: () => Promise<(import("mongoose").Document<unknown, {}, IProduct, {}, {}> & IProduct & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
})[]>;
export declare const getProductById: (id: string) => Promise<(import("mongoose").Document<unknown, {}, IProduct, {}, {}> & IProduct & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}) | null>;
export declare const updateProduct: (id: string, product: IProduct) => Promise<(import("mongoose").Document<unknown, {}, IProduct, {}, {}> & IProduct & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}) | null>;
export declare const deleteProduct: (id: string) => Promise<void>;
export declare const seedInitialProducts: () => Promise<void>;
//# sourceMappingURL=productService.d.ts.map