import express from "express";
import { getActiveCartForUser } from "../services/cartService.ts";
import validateJWT from "../middlewares/validateJWT.ts";

const router = express.Router();


router.get('/', validateJWT, async (request, response) => {
    const userId = request.body.userId;
    const cart = await getActiveCartForUser({userId});
    response.status(200).send(cart);
    
});


    

export default router;