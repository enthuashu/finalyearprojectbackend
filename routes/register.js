const router = require("express").Router();
const USER_MODEL = require("../Models/User");
const CryptoJS = require("crypto-js");
const { encryptPassword, verifyPassword } = require("../utils/passwordUtil");
const { signJWT, setCookie, clearCookie } = require("../utils/tokenUtil");
const passport = require("passport");

router.post("/register", async (req, res) => {
  try {
    const userExist = await USER_MODEL.findOne({ email: req.body.email });
    if (userExist) {
      return res
        .status(400)
        .json({ success: false, error: "Email already exists" });
    }

    const user = new USER_MODEL(req.body);
    user.password = await encryptPassword(req.body.password);
    await user.save();
    return res
      .status(201)
      .json({ success: true, message: "User Registerd Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
});

router.post("/signin", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;

    const userlogin = await USER_MODEL.findOne({ email });
    if (userlogin) {
      // Decrypt
      const isPasswordMatch = await verifyPassword(
        password,
        userlogin.password
      );

      if (!isPasswordMatch) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid password" });
      } else {
        const payloaduser = {
          id: userlogin._id,
          name: userlogin.name,
        };
        const token = await signJWT(payloaduser);
        setCookie(res, token);
        return res
          .status(201)
          .json({ success: true, message: "User Signedin Successfully" });
      }
    } else {
      res.status(400).json({ error: "User not found" });
    }
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

router.get(
  "/private",
  passport.authenticate("user", { session: false }),
  async (req, res) => {
    try {
      return res.json({ success: true, message: "Heelo From private" });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }
);

router.get("/logout", function (req, res) {
  clearCookie(res);
  return res.json({
    success: true,
  });
});

module.exports = router;
