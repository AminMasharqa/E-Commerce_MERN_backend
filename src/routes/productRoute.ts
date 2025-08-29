import express from "express";
import { getProducts } from "../services/productService.ts";

const router = express.Router()

router.get('/',async (req,res)=>{
    const products = await getProducts();
    res.status(200).send(products);
});

export default router;