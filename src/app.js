//src/app.js
const express = require("express");
const morgan = require ("morgan");
const cors = require("cors");
const indexRouter = require("./routes");
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



app.get("/",(req, res)=>{
    res.send("You are Doing Greate Go a Head ");
});

module.exports =app;