"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userService_js_1 = require("../services/userService.js");
const validateJWT_js_1 = __importDefault(require("../middlewares/validateJWT.js"));
const router = express_1.default.Router();
router.post('/register', async (request, response) => {
    try {
        console.log('\n=== REGISTER ROUTE HIT ===');
        console.log('Headers:', request.headers);
        console.log('Raw body:', request.body);
        console.log('Body type:', typeof request.body);
        console.log('Body keys:', Object.keys(request.body));
        const { firstName, lastName, email, password } = request.body;
        console.log('Extracted values:');
        console.log('  - firstName:', firstName, '(type:', typeof firstName, ')');
        console.log('  - lastName:', lastName, '(type:', typeof lastName, ')');
        console.log('  - email:', email, '(type:', typeof email, ')');
        console.log('  - password:', password ? '***' : 'undefined', '(type:', typeof password, ')');
        // Validate required fields
        if (!firstName || !lastName || !email || !password) {
            console.log('❌ Missing required fields!');
            return response.status(400).json({
                success: false,
                message: 'All fields are required',
                received: {
                    firstName: !!firstName,
                    lastName: !!lastName,
                    email: !!email,
                    password: !!password
                }
            });
        }
        console.log('✓ All fields present, calling register service...');
        const { statusCode, data } = await (0, userService_js_1.register)({ firstName, lastName, email, password });
        console.log('Service response:', { statusCode, data: typeof data === 'string' ? data : '(JWT token)' });
        console.log('=== END REGISTER ROUTE ===\n');
        response.status(statusCode).json({
            success: statusCode === 200,
            data
        });
    }
    catch (error) {
        console.error('❌ Error in register route:', error);
        response.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.post('/login', async (request, response) => {
    try {
        const { email, password } = request.body;
        const { statusCode, data } = await (0, userService_js_1.login)({ email, password });
        response.status(statusCode).json({
            success: statusCode === 200,
            data
        });
    }
    catch (error) {
        console.error('Error in login route:', error);
        response.status(500).json({
            success: false,
            message: 'Login failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.get('/my-orders', validateJWT_js_1.default, async (request, response) => {
    try {
        const userId = request.body.userId;
        if (!userId) {
            return response.status(400).json({ message: "userId is required" });
        }
        const { statusCode, data } = await (0, userService_js_1.getOrdersForUser)({ userId });
        if (statusCode !== 200) {
            return response.status(statusCode).json({ message: data });
        }
        return response.status(statusCode).json(data);
    }
    catch (error) {
        console.error('Error in my-orders route:', error);
        response.status(500).json({
            success: false,
            message: 'Failed to get orders',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.default = router;
