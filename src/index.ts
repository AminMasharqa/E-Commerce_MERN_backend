// Load environment variables first
import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute.ts";
import { seedInitialProducts } from "./services/productService.ts";
import productModel from "./models/productModel.ts";
import productRoute from "./routes/productRoute.ts";
import cartRoute from "./routes/cartRoute.ts";

const app = express();
app.use(express.json());

// Environment variables validation
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV || 'development';

if (!MONGODB_URI) {
    console.error('MONGODB_URI environment variable is required');
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
});

app.use('/user',userRoute);
app.use('/product',productRoute);
app.use('/cart',cartRoute);

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

// Seed initial products with error handling
seedInitialProducts().catch((err) => {
    console.error("Failed to seed initial products:", err);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});

export default app;