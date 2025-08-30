import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute.ts";
import { seedInitialProducts } from "./services/productService.ts";
import productModel from "./models/productModel.ts";
import productRoute from "./routes/productRoute.ts";
import cartRoute from "./routes/cartRoute.ts";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce")
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.log(err);
});


app.use('/user',userRoute);
app.use('/product',productRoute);
app.use('/cart',cartRoute);

seedInitialProducts();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;