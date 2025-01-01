require("dotenv").config();
require("express-async-errors");

const  mongoose = require("mongoose");
const DbConnection = require("./configuration/DbConnection");
const cors = require("cors");
const corsOptions = require("./configuration/cors.config");
const morgan = require("morgan"); // for logging res & req
const helmet = require("helmet") // helps secure your application by setting various HTTP headers;


const express = require("express");
const app = express();
const port = process.env['PORT'] || 3000;

// Start Connection to Db
DbConnection();

// Server configuration using some middlewares
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combine'));
app.use(helmet({
            crossOriginResourcePolicy: false //you are disabling the Cross-Origin-Resource-Policy header entirely.
        // This means the server will not explicitly restrict resource sharing based on origin.
    }
));
// - Middlewares
const errorHandlerMiddleware = require("./middlewares/errorHandler");
const notFoundMiddleware = require("./middlewares/NotFound");

// - Routers
const userRouter = require("./routes/user.route");
const categoryRouter = require("./routes/category.route");
const subCategoryRouter = require("./routes/subCategory.route");
const uploadRouter = require("./routes/upload.route");
const productRouter = require("./routes/product.route");
const cartRouter = require("./routes/cart.route");
const addressRouter = require("./routes/address.route");
const orderRouter = require("./routes/order.route");



// endpoints
app.get("/", (req, res) => {
        res.send("Muhammed On Da Code!");
})
app.use('/api/user',userRouter)
app.use("/api/category",categoryRouter)
app.use("/api/file",uploadRouter)
app.use("/api/subcategory",subCategoryRouter)
app.use("/api/product",productRouter)
app.use("/api/cart",cartRouter)
app.use("/api/address",addressRouter)
app.use('/api/order',orderRouter)
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

mongoose.connection.once("open", ()=>{
        console.log("Connected to MongoDB");
        app.listen(port,() => {
        console.log(`Server is running on port ${port}`);
        });
});
mongoose.connection.on("error",(err)=>{
        console.error("Error connecting to MongoDB:", err.message);
});

