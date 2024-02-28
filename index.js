const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/userroutes");

require("dotenv").config();
const app = express();
app.use(express.json());

app.use("/users", userRoute);

const port = process.env.PORT || 3000;
mongoose
  .connect("mongodb://localhost:27017/ecommerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to db");
    app.listen(port, () => console.log(`Listening on port ${port}`));
  })
  .catch((err) => console.error("Database connection error:", err));
