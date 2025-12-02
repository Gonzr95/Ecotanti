import express from "express";
const app = express();
app.disable("x-powered-by");
const port = process.env.PORT || 3000;
import { router as userRouter } from "./routes/users.js";
//import { router as productRouter } from "./routes/products.js";
import cors from "cors";
import { connectDB } from "./db/sequelize.js";
connectDB();

app.use(cors({
    origin: [
        //frontend URLS
        "http://localhost:5500",
        "http://localhost:5500"
        //localhost
        //ip
    ],
    // investigar esto
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use(express.json());

app.use('/users', userRouter);
// router de productos



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})