"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedInitialProducts = exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const productModel_js_1 = __importDefault(require("../models/productModel.js"));
const createProduct = async (product) => {
    try {
        const newProduct = new productModel_js_1.default(product);
        await newProduct.save();
        return newProduct;
    }
    catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};
exports.createProduct = createProduct;
const getProducts = async () => {
    try {
        const products = await productModel_js_1.default.find();
        return products;
    }
    catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};
exports.getProducts = getProducts;
const getProductById = async (id) => {
    try {
        const product = await productModel_js_1.default.findById(id);
        return product;
    }
    catch (error) {
        console.error('Error fetching product by id:', error);
        throw error;
    }
};
exports.getProductById = getProductById;
const updateProduct = async (id, product) => {
    try {
        const updatedProduct = await productModel_js_1.default.findByIdAndUpdate(id, product, { new: true });
        return updatedProduct;
    }
    catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (id) => {
    try {
        await productModel_js_1.default.findByIdAndDelete(id);
    }
    catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};
exports.deleteProduct = deleteProduct;
const seedInitialProducts = async () => {
    try {
        const products = await productModel_js_1.default.find();
        if (products.length > 0)
            return;
        await productModel_js_1.default.insertMany([
            { title: "Dell Labtop", image: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/page/category/laptop/dell-pro-laptops-category-image-800x620.png?fmt=png-alpha&wid=800&hei=620", price: 100, stock: 10 },
            { title: "Asus Labtop", image: "https://dlcdnwebimgs.asus.com/gain/9d10759b-252c-463c-a9fe-40026ad250e3/", price: 200, stock: 20 },
            { title: "HP Labtop", image: "https://cdn.mos.cms.futurecdn.net/pyL3b8cis5dcmUvgbe9ygV-2000-80.jpg", price: 300, stock: 30 },
        ]);
    }
    catch (error) {
        console.error('Error seeding products:', error);
        throw error;
    }
};
exports.seedInitialProducts = seedInitialProducts;
