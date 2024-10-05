const jwt = require("jsonwebtoken");
const User = require("../models/user");

const JWT_SECRET = "shah@5225Dev";

const auth = async (req, res, next) => {
  try {
    console.log("auth callef");
    const { token } = req.cookies;

    const decodedToken = await jwt.verify(token, JWT_SECRET);
    console.log(decodedToken);

    const user = await User.findById({ _id: decodedToken._id });
    console.log(user);
    if (user) {
      req.user = user;
      next();
    } else {
      res.send("user not found");
    }
  } catch (error) {
    res.send(error);
  }
};

module.exports = auth;
