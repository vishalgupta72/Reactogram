// const express = require('express');
// const app = express();

// app.get("/welcome", function(req, res){
//     res.status(200).json({msg : "hello vishal"});
// })

// app.listen(3000, () =>{
//     console.log("start server");
// })

const express = require("express");
// const multer = require("multer");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

require('dotenv').config()

const { MONGODB_URL } = require("./config.js");

global.__basedir = __dirname;

mongoose.connect(MONGODB_URL);

mongoose.connection.on("connnected", (e) => {
  console.log("DB Connected successfully!", e);
});
mongoose.connection.on("error", (error) => {
  console.log("DB connection failed", error);
});

require("./models/user_model");
require("./models/post_model");
require("./models/profile_model");

app.use(cors());
app.use(express.json({ limit: "10mb" }));
// const upload = multer();
// app.use(upload.any());

app.use(require("./routes/user_route"));
app.use(require("./routes/post_route"));
app.use(require("./routes/file_route"));
app.use(require("./routes/profile_route"));

app.listen(4000, () => {
  console.log("server started successfully...");
});
