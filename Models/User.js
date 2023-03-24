const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    email: String,
    password: String,
    type: String,
    disease: String,
    aadhar: Number,
    hospital: String,
    haddress: String,
    hPic: String,
    specialization: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
