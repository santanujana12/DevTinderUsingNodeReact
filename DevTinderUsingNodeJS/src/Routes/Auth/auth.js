import User from "../../Models/userModel.js";
import express from "express";
import validator from "validator";
import bcrypt from "bcrypt";

export const authRouter = express.Router();

const Register = async (req, res) => {
  const { firstName, lastName, emailId, password, date_of_birth, gender, photoUrl, skills } = req.body;


  if (!validator.isEmail(emailId)) {
    return res.status(400).send("Invalid Email Type");
  }

  if (!validator.isStrongPassword(password)) {
    return res.status(400).send("Not a good password");
  }
  try {
    const alreadyExistingEmail = await User.findOne({ emailId });
    if (alreadyExistingEmail) {
      return res.status(400).send("Email already exists");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age:date_of_birth,
      gender,
      photoUrl,
      skills
    });
    await user.save();
    res.status(200).send("User registered successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error registering user");
  }
};

const Login = async (req, res) => {
  const { emailId, password } = req.body;

  if (typeof emailId !== "string" || typeof password !== "string") {
    return res.status(400).send("Invalid input types.");
  }

  if (!validator.isEmail(emailId)) {
    return res.status(400).send("Invalid Email");
  }
  if (!validator.isStrongPassword(password)) {
    return res.status(400).send("Invalid password");
  }
  try {
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).send("User not found");
    } else {
      const passwordHash = await user.validatePassword(password);
      if (passwordHash) {
        const token = user.getJWTToken();
        return res.status(200).cookie("token", token).send("Login successful");
      } else {
        return res.status(400).send("Invalid password");
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error logging in user");
  }
};

const logout = async (req, res) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .send("Logout successful")
    .status(200);
};

authRouter.post("/register", Register);
authRouter.post("/login", Login);
authRouter.get("/logout", logout);
