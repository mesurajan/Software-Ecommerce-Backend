//src/app.js
const express = require("express");
const morgan = require ("morgan");
const cors = require("cors");
const indexRouter = require("./routes");
const path = require("path");

const app = express();
//Middleware 

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.use((req,  res, next)=>
{
    if((req.method === "POST" || req.method === "PUT") && req.body && Object.keys(req.body).length>0){
        console.log("Requesting  Body :", req.body);

    } 
    next();
});

//Routes
app.use("/api" ,indexRouter);
app.use("/uploads/banner", express.static(path.join(__dirname, "../uploads/banner")));
app.use("/uploads/product", express.static(path.join(__dirname, "../uploads/product")));
app.use("/uploads/latestproducts", express.static(path.join(__dirname, "../uploads/latestproducts")));
app.use("/uploads/discountitems", express.static(path.join(__dirname, "../uploads/discountitems")));
app.use("/uploads/topcategories", express.static(path.join(__dirname, "../uploads/topcategories")));
app.use("/uploads/trendingProducts", express.static(path.join(__dirname, "../uploads/trendingProducts")));

app.get("/",(req, res)=>{
    res.send("Backend is running ");
});

module.exports =app;