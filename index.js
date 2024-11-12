const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const {restrictToLoggedInUserOnly, checkAuth} = require("./middlewares/auth");
const mongoose = require("mongoose");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/users");

//------------------------ MongoDB Connection --------------------------//
mongoose
  .connect("mongodb://localhost:27017/short-url", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connection Succeeded.");
  })
  .catch((error) => {
    console.error("Error in DB connection:", error);
  });
//----------------------------------------------------------------------//

//----------------------------- EJS ------------------------------------//
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
//----------------------------------------------------------------------//

// --------------------------- Middleware ------------------------------//
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//----------------------------------------------------------------------//

// --------------------------- Routes ----------------------------------//
app.use("/url",restrictToLoggedInUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/",checkAuth, staticRoute);

//----------------------------------------------------------------------//

// -------------------------------Start Server--------------------------//
const PORT = 5000;
app.listen(PORT, () => {
  console.log("App running on port:", PORT);
});
//----------------------------------------------------------------------//
