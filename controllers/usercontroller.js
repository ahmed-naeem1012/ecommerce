require("dotenv").config();
const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const signup = async (req, res) => {
  const { username, email, password, user } = req.body;

  try {
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ isSuccessful: false, message: "Email Already in use" });
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    const currentTokenId = new Date().getTime().toString();
    const newUser = {
      email: email,
      username: username,
      password: hashedpassword,
      role: user,
      currentTokenId: currentTokenId,
    };

    const result = await userModel.create(newUser);
    const token = jwt.sign(
      { email: result.email, id: result._id, tokenId: currentTokenId },
      process.env.SECRET_KEY
    );

    res.status(200).json({
      isSuccessful: true,
      user: {
        username: newUser.username,
        email: newUser.email,
        uid: result._id,
      },
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({
        isSuccessful: false,
        message: "User not found with the provided email",
      });
    }

    // Validate password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({
        isSuccessful: false,
        message: "Incorrect password, please try again",
      });
    }
    const currentTokenId = new Date().getTime().toString();

    const token = jwt.sign(
      {
        email: existingUser.email,
        id: existingUser._id,
        tokenId: currentTokenId,
      },
      process.env.SECRET_KEY
    );

    // Update the user's currentTokenId
    existingUser.currentTokenId = currentTokenId;
    await existingUser.save();

    res.status(200).json({
      isSuccessful: true,
      message: "Login successful",
      user: {
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
      },
    });
  } catch (error) {
    console.error("Sign in error:", error); // Log the error for debugging
    res.status(500).json({
      message: "An error occurred during the sign in process",
    });
  }
};
const forgetpassword = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate six-digit OTP
  const otpExpiry = new Date(Date.now() + 10 * 60000); // Set OTP expiry 10 minutes from now

  try {
    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({
        isSuccessful: false,
        message: "User not found with the provided email",
      });
    }

    // Store the OTP and expiry in user's document
    existingUser.otp = otp;
    existingUser.otpExpiry = otpExpiry;
    await existingUser.save();

    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: {
        name: "Ecommerce",
        address: process.env.EMAIL,
      },
      to: email,
      subject: "Password Reset Request",
      text: `Your password reset code is ${otp}. This code will expire in 10 minutes.`,
      html: `<b>Your password reset code is ${otp}. This code will expire in 10 minutes.</b>`,
    };

    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully", info });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send email", error });
  }
};

module.exports = { signup, signin, forgetpassword };
