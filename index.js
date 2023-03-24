const express = require("express");
const connectDb = require("./Connection/Connection");
const app = express();
require("dotenv").config();
const passport = require("passport");
require("./config/passport")(passport);
require("dotenv").config();
const registerRoute = require("./routes/register");

const cookies = require("cookie-parser");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookies());

app.use("/api/user", registerRoute);
connectDb();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is running at Port ", PORT);
});
