import productModel from "../models/productModel.ts";
import type { IProduct } from "../models/productModel.ts";

export const createProduct = async (product: IProduct) => {
    try {
        const newProduct = new productModel(product);
        await newProduct.save();
        return newProduct;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
}

export const getProducts = async () => {
    try {
        const products = await productModel.find();
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

export const getProductById = async (id: string) => {
    try {
        const product = await productModel.findById(id);
        return product;
    } catch (error) {
        console.error('Error fetching product by id:', error);
        throw error;
    }
}

export const updateProduct = async (id: string, product: IProduct) => {
    try {
        const updatedProduct = await productModel.findByIdAndUpdate(id, product, {new: true});
        return updatedProduct;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
}

export const deleteProduct = async (id: string) => {
    try {
        await productModel.findByIdAndDelete(id);
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}

export const seedInitialProducts = async () => {
    try {
        const products = await productModel.find();
        if(products.length > 0) return;
        await productModel.insertMany([
            {title: "Product 1", image: "https://via.placeholder.com/150", price: 100, stock: 10},
            {title: "Product 2", image: "https://via.placeholder.com/150", price: 200, stock: 20},
            {title: "Product 3", image: "https://via.placeholder.com/150", price: 300, stock: 30},
        ]);
    } catch (error) {
        console.error('Error seeding products:', error);
        throw error;
    }
}
