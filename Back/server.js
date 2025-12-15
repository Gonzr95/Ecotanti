import express from "express";
const app = express();
app.disable("x-powered-by");
const port = process.env.PORT || 3000;
import { router as userRouter } from "./routes/users.js";
import { router as productsRouter } from "./routes/products.js";
import { router as ticketsRouter } from "./routes/tickets.js";
import cors from "cors";
import { connectDB } from "./db/sequelize.js";
connectDB();

console.log("No te olvides de cargar las variables de entorno. BD configs, JWT_SECRET lugar de almacenamiento de las fotos.");

app.use(cors({
    origin: [
        //frontend URLS
        "http://localhost:5500",
        "http://127.0.0.1:5500"
        //localhost
        //ip
    ],
    // investigar esto
    methods: ["GET", "POST", "PUT", "DELETE"]
    //credentials: true,
}));
app.use(express.json());

app.use(userRouter);
app.use(productsRouter);
app.use(ticketsRouter);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})