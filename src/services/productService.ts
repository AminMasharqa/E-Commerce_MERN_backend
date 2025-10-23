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
            {title: "Dell Labtop", image: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/page/category/laptop/dell-pro-laptops-category-image-800x620.png?fmt=png-alpha&wid=800&hei=620", price: 100, stock: 10},
            {title: "Asus Labtop", image: "https://dlcdnwebimgs.asus.com/gain/9d10759b-252c-463c-a9fe-40026ad250e3/", price: 200, stock: 20},
            {title: "HP Labtop", image: "https://cdn.mos.cms.futurecdn.net/pyL3b8cis5dcmUvgbe9ygV-2000-80.jpg", price: 300, stock: 30},
        ]);
    } catch (error) {
        console.error('Error seeding products:', error);
        throw error;
    }
}
