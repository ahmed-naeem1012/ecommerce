const express = require("express");
const userRouter = express.Router();
const {
  signup,
  signin,
  forgetpassword,
  resetPassword,
} = require("../controllers/usercontroller");

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post("/forgetpass", forgetpassword);
userRouter.post("/resetpass", resetPassword);

module.exports = userRouter;
