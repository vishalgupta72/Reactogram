const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const UserModel = mongoose.model("UserModel");
// var bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

//  sign up for user
router.post("/signup", async (req, res) => {
  const { fullName, email, password, profileImg } = req.body;
  if (!fullName || !password || !email) {
    return res
      .status(400)
      .json({ error: "One or more mandatory field are empty" });
  }

  try {
    let p = performance.now();
    const userInDB = await UserModel.findOne({ email: email });
    // console.log("findOne time:", performance.now() - p);
    if (userInDB) {
        throw new Error("User with this email already registered");
    }
    p = performance.now();
    // const hashedPassword = await bcryptjs.hash(password, 16);
    const hashedPassword = password
    // console.log("bcryptjs time:", performance.now() - p);
    p = performance.now();
    const user = new UserModel({
        fullName,
        email,
        password: hashedPassword,
        profileImg,
    });
    const result = await user.save();
    // console.log("user save time:", performance.now() - p);
    if (!result) throw new Error("Signup failed");

    res.status(201).json({ result: "User signed up Successgfullly" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

//  loing for user
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!password || !email) {
    return res
      .status(400)
      .json({ error: "One or more mandatory field are empty" });
  }

  UserModel.findOne({ email: email })
    .then((userInDB) => {
      if (!userInDB) {
        return res.status(401).json({ error: "Invalid Creadentials" });
      }
    //   bcryptjs.compare(password, userInDB.password).then((didMatch) => {

        const didMatch = password === userInDB.password

        if (didMatch) {
          const jwtToken = jwt.sign({ _id: userInDB._id }, JWT_SECRET);
          const userInfo = {
            _id: userInDB._id,
            email: userInDB.email,
            fullName: userInDB.fullName,
          };

          res.status(200).json({ result: { token: jwtToken, user: userInfo } });
        } else {
          return res.status(401).json({ error: "Invalid Creadentials" });
        }
    //   });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
