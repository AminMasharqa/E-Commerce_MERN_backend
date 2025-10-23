import userModel from "../models/userModel.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { orderModel } from "../models/orderModelt.ts";

interface RegisterParams {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface LoginParams {
    
    email: string;
    password: string;
}
export const register = async({firstName,lastName,email,password}: RegisterParams) =>{
    try {
        const findUser = await userModel.findOne({email});

        if(findUser){
            return {data : "User already exists!",statusCode:400};
        }
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new userModel({ email, password: hashedPassword, firstName, lastName });

        await newUser.save();

        return {data: generateJWT({firstName,lastName,email}),statusCode:200};
    } catch (error) {
        console.error('Error in register:', error);
        return {data: "Registration failed", statusCode: 500};
    }
}

export const login = async ({email,password}:LoginParams) =>{
    try {
        const findUser = await userModel.findOne({email});

        if(!findUser){
            return {data : "Incorrect email or password!", statusCode: 400};
        }

        const passwordMatch  = await bcrypt.compare(password, findUser.password);

        if(passwordMatch){
            return {data:generateJWT({firstName:findUser.firstName,lastName:findUser.lastName,email:findUser.email}), statusCode:200};
        }

        return {data : "Incorrect email or password!", statusCode: 400};
    } catch (error) {
        console.error('Error in login:', error);
        return {data: "Login failed", statusCode: 500};
    }
}

const generateJWT = (data:any) =>{
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET environment variable is required');
    }
    return jwt.sign(data, jwtSecret);
}


interface GetOrdersForUserParams {
    userId: string;
}
export const getOrdersForUser = async ({ userId }: GetOrdersForUserParams) => {
    try {
        const orders = await orderModel.find({ userId });
        return {data:orders,statusCode:200};
    } catch (error) {
        console.error('Error in getOrdersForUser:', error);
        return {data:"Failed to get orders",statusCode:500};
    }
}

