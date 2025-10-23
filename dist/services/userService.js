"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdersForUser = exports.login = exports.register = void 0;
const userModel_js_1 = __importDefault(require("../models/userModel.js"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const orderModelt_js_1 = require("../models/orderModelt.js");
const register = async ({ firstName, lastName, email, password }) => {
    try {
        const findUser = await userModel_js_1.default.findOne({ email });
        if (findUser) {
            return { data: "User already exists!", statusCode: 400 };
        }
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
        const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        const newUser = new userModel_js_1.default({ email, password: hashedPassword, firstName, lastName });
        await newUser.save();
        return { data: generateJWT({ firstName, lastName, email }), statusCode: 200 };
    }
    catch (error) {
        console.error('Error in register:', error);
        return { data: "Registration failed", statusCode: 500 };
    }
};
exports.register = register;
const login = async ({ email, password }) => {
    try {
        const findUser = await userModel_js_1.default.findOne({ email });
        if (!findUser) {
            return { data: "Incorrect email or password!", statusCode: 400 };
        }
        const passwordMatch = await bcrypt_1.default.compare(password, findUser.password);
        if (passwordMatch) {
            return { data: generateJWT({ firstName: findUser.firstName, lastName: findUser.lastName, email: findUser.email }), statusCode: 200 };
        }
        return { data: "Incorrect email or password!", statusCode: 400 };
    }
    catch (error) {
        console.error('Error in login:', error);
        return { data: "Login failed", statusCode: 500 };
    }
};
exports.login = login;
const generateJWT = (data) => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET environment variable is required');
    }
    return jsonwebtoken_1.default.sign(data, jwtSecret);
};
const getOrdersForUser = async ({ userId }) => {
    try {
        const orders = await orderModelt_js_1.orderModel.find({ userId });
        return { data: orders, statusCode: 200 };
    }
    catch (error) {
        console.error('Error in getOrdersForUser:', error);
        return { data: "Failed to get orders", statusCode: 500 };
    }
};
exports.getOrdersForUser = getOrdersForUser;
