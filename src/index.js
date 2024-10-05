const express = require("express");
const connectDb = require("../config/db.js");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth.js");

const app = express();

const JWT_SECRET = "shah@5225Dev";

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  // validateSignUpData(req)

  try {
    const hashedPassword = await bcrypt.hash(req.body?.password, 10);

    req.body.password = hashedPassword;

    const userObj = req.body;

    const user = new User(userObj);

    await user.save();
    res.send("data saved");
  } catch (error) {
    res.send(error.message);
  }
});

app.get("/profile", auth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.send(error);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const email = req.body.emailId;
    const users = await User.find();
    if (users.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.send(error);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  console.log(userId);

  try {
    await User.findByIdAndDelete(userId);
    res.send("user deleted");
  } catch (error) {
    res.send(error.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const ALLOWED_UPDATES = ["skills", "password", "about", "profilePic"];

    const isUpdateAllowed = Object.keys(req.body).every((field) => {
      return ALLOWED_UPDATES.includes(field);
    });

    if (isUpdateAllowed) {
      const user = await User.findByIdAndUpdate(userId, req.body, {
        runValidators: true,
      });
      res.send("user updated successfully");
    } else {
      res.send("Update not Allowed");
    }
  } catch (error) {
    res.send(error.message);
  }
});

app.get("/signin", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      return res.send("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    console.log("signin", isPasswordValid);

    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 7 * 3600000),
      });

      return res.send("Sign In Successfull");
    } else {
      return res.send("Invalid Credentials");
    }
  } catch (error) {
    return res.send(error.message);
  }
});

connectDb()
  .then(() => {
    app.listen(3000, () => {
      console.log("DB connection successful, app is listening on port 3000");
    });
  })
  .catch((err) => console.log("error while connecting with db"));
