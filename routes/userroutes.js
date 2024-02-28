const express = require("express");
const userRouter = express.Router();
const {
  signup,
  signin,
  forgetpassword,
} = require("../controllers/usercontroller");

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post("/forgetpass", forgetpassword);

module.exports = userRouter;
