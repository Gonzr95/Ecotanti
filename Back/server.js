import express from "express";
const app = express();
app.disable("x-powered-by");
const port = process.env.PORT || 3000;
// router de usuarios
// router de productos

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





app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})