import express from "express";
import bcrypt from "bcrypt";
import User from "../../Models/userModel.js";

export const UserRouter = express.Router();

const deleteUserProfile = async (req, res) => {
  const { id } = req.User;
  // Delete User profile by id
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    if (deleteUser) {
      res.status(200).send("Profile deleted successfully");
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(500).send("Error deleting profile");
  }
};

// Viewing profile for other users
const viewUserProfile = async (req, res) => {
  const { id } = req.User;
  try {
    const user_from_db = await User.findById(id).select("firstName lastName gender emailId skills photoUrl");
    if (user_from_db) {
      const changeIdPattern = {
        id:user_from_db._id,
        firstName:user_from_db.firstName,
        lastName:user_from_db.lastName,
        gender:user_from_db.gender,
        emailId:user_from_db.emailId,
        skills:user_from_db.skills,
        photoUrl:user_from_db.photoUrl
      }
      res.send(changeIdPattern).status(200);
    } else {
      res.send("No user found").status(404);
    }
  } catch (err) {
    res.send("Error fetching data").status(500);
  }
};

// Update user details
const updateUserDetails = async (req, res) => {
  const { id, firstName, lastName, emailId } = req.body;
  const loggedInUser = req.User;
  try {
    if (loggedInUser.id !== id) {
      return res
        .status(401)
        .send("You are unauthorized to perform this action");
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, emailId },
      { new: true }
    );
    if (updatedUser) {
      res.status(200).send("Profile updated successfully" + " " + updatedUser);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(500).send("Error updating profile");
  }
};

UserRouter.get("/view", viewUserProfile);
UserRouter.delete("/delete", deleteUserProfile);
UserRouter.patch("/updateProfile", updateUserDetails);
