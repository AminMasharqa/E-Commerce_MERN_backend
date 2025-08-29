import productModel from "../models/productModel.ts";
import type { IProduct } from "../models/productModel.ts";

export const createProduct = async (product: IProduct) => {
    const newProduct = new productModel(product);
    await newProduct.save();
    return newProduct;
}

export const getProducts = async () => {
    const products = await productModel.find();
    return products;
}

export const getProductById = async (id: string) => {
    const product = await productModel.findById(id);
    return product;
}

export const updateProduct = async (id: string, product: IProduct) => {
    const updatedProduct = await productModel.findByIdAndUpdate(id, product, {new: true});
    return updatedProduct;
}

export const deleteProduct = async (id: string) => {
    await productModel.findByIdAndDelete(id);
}

export const seedInitialProducts = async () => {
    const products = await productModel.find();
    if(products.length > 0) return;
    await productModel.insertMany([
        {title: "Product 1", image: "https://via.placeholder.com/150", price: 100, stock: 10},
        {title: "Product 2", image: "https://via.placeholder.com/150", price: 200, stock: 20},
        {title: "Product 3", image: "https://via.placeholder.com/150", price: 300, stock: 30},
    ]);
}
