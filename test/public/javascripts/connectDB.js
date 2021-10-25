//mongodb 연결 모듈
const mongoose = require("mongoose");

mongoose
    .connect("mongodb://localhost:27017/artstore")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
