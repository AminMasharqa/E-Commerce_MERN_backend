import express from "express";
import { getProducts } from "../services/productService.js";
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const products = await getProducts();
        res.status(200).send(products);
    }
    catch (error) {
        console.error('Error in get products route:', error);
        res.status(500).send('Failed to fetch products');
    }
});
export default router;
//# sourceMappingURL=productRoute.js.map