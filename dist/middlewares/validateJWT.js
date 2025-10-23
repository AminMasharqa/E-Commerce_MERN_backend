"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_js_1 = __importDefault(require("../models/userModel.js"));
const validateJWT = (req, res, next) => {
    const authorizationHeader = req.get("Authorization");
    if (!authorizationHeader) {
        return res.status(401).json({ message: "Authorization header is required" });
    }
    const token = authorizationHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token is required" });
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return res.status(500).json({ message: "JWT_SECRET environment variable is required" });
    }
    jsonwebtoken_1.default.verify(token, jwtSecret, async (err, payload) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const userPayload = payload;
        if (!userPayload?.email) {
            return res.status(401).json({ message: "Email is required" });
        }
        // Fetch the user from the database based on the payload
        const user = await userModel_js_1.default.findOne({ email: userPayload.email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.body = req.body || {};
        req.body.user = user;
        req.body.userId = user._id.toString();
        console.log("Setting req.body.userId to:", user._id.toString());
        next();
    });
};
exports.default = validateJWT;
