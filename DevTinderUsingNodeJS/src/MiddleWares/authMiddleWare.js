import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // use cookies to get the token
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send("Unauthorized");
    }

    const decodedUserData = await jwt.verify(token, "secret");

    const { id } = decodedUserData;

    const isUserPresent = await User.findById(id);
    if (!isUserPresent) {
      return res.status(401).send("Unauthorized");
    }

    // Pass middleware user to 
    req.User = isUserPresent;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send("Unauthorized" + err.message);
  }
};