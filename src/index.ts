import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute.ts";

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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;