require("dotenv").config();
require("express-async-errors");

const  mongoose = require("mongoose");
const DbConnection = require("./configuration/DbConnection");
// Start Connection to Db
DbConnection();


const express = require("express");
const app = express();
const port = process.env['PORT'] || 3000;

// Server configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// - Middlewares
const errorHandlerMiddleware = require("./middlewares/errorHandler");
const notFoundMiddleware = require("./middlewares/NotFound");

// - Routers


// endpoints
app.get("/", (req, res) => {
        res.send("Muhammed On Da Code!");
})
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

mongoose.connection.on("open", ()=>{
        console.log("Connected to MongoDB");
        app.listen(port,() => {
        console.log(`Server is running on port ${port}`);
        });
});
mongoose.connection.on("error",(err)=>{
        console.error("Error connecting to MongoDB:", err.message);
});

