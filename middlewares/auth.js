const userModel = require("../models/user");

const AdminAuth = async (req, res, next) => {
  try {
    const userId = req.headers["user-id"];

    if (!userId) {
      return res.status(400).json({
        isSuccessful: false,
        message: "Unauthorized: No UID provided",
      });
    }

    if (userId !== "65df2f73478a5a91063b89ac") {
      return res.status(400).json({
        isSuccessful: false,
        message: "Invalid Admin request",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(400).json({
        isSuccessful: false,
        message: "User not found",
      });
    }

    req.userId = userId;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      isSuccessful: false,
      message: "Unauthorized: Invalid UID",
    });
  }
};

const UserAuth = async (req, res, next) => {
  try {
    const userId = req.headers["user-id"];

    if (!userId) {
      return res.status(400).json({
        isSuccessful: false,
        message: "Unauthorized: No UID provided",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(400).json({
        isSuccessful: false,
        message: "User not found",
      });
    }

    req.userId = user.id;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      isSuccessful: false,
      message: "Unauthorized: Invalid UID",
    });
  }
};

module.exports = { AdminAuth, UserAuth };
