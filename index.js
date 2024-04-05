const express = require("express");
const mongoose = require("mongoose");
const questionRouter = require("./Router/questionRouter");
const userRouter = require("./Router/userRoute")

const app = express();
app.use(express.json());

//database connection
const connect = require("./config/database");

app.use("/question", questionRouter);
app.use("/user", userRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});
