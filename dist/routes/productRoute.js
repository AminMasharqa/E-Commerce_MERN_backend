"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productService_js_1 = require("../services/productService.js");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const products = await (0, productService_js_1.getProducts)();
        res.status(200).send(products);
    }
    catch (error) {
        console.error('Error in get products route:', error);
        res.status(500).send('Failed to fetch products');
    }
});
exports.default = router;
