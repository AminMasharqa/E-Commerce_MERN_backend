import cartModel, { type IcartItem } from "../models/cartModel.ts";

interface createCartForUser {
    userId: string;
}

const createCartForUser = async ({userId}: createCartForUser) => {
    console.log("createCartForUser called with userId:", userId);
    const cart = await cartModel.create({ userId, items: [], totalAmount:0, status:"active"});
    await cart.save();
    return cart;
}


interface getActiveCartForUser {
    userId: string;
   
}

export const getActiveCartForUser = async ({userId}: getActiveCartForUser) => {
    console.log("getActiveCartForUser called with userId:", userId);
    if (!userId) {
        throw new Error("userId is required");
    }
    let  cart = await cartModel.findOne({ userId, status: "active" });
    if (!cart) {
        cart = await createCartForUser({userId});      
    }
    return cart;
}

