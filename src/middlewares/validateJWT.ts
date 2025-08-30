import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.ts";


const validateJWT = (req: Request, res: Response, next: NextFunction) => { 
    const authorizationHeader = req.get("Authorization");

    if (!authorizationHeader) {
        return res.status(401).json({ message: "Authorization header is required" });
    }

    const token = authorizationHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token is required" });
    }

    jwt.verify(token,
         process.env.JWT_SECRET || "default-secret",
         async (err, payload) => {
            if (err) {
                return res.status(401).json({ message: "Invalid token" });
            }
            
            const userPayload = payload as {email:string,userId?:string,firstName:string,lastName:string};
            
            console.log("JWT payload:", userPayload);
            
            if (!userPayload?.email) {
                return res.status(401).json({ message: "Email is required" });
            }
            // Fetch the user from the database based on the payload
            const user = await userModel.findOne({email: userPayload.email});
            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }
            req.body = req.body || {};
            req.body.user = user;
            req.body.userId = (user as any)._id.toString();
            console.log("Setting req.body.userId to:", (user as any)._id.toString());
            next();
         });
}

export default validateJWT;