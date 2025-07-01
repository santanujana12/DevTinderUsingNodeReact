import express from "express";
import bcrypt from "bcrypt";
import User from "../../Models/userModel.js";

export const ProfileRouter = express.Router();

const deleteProfile = async (req, res) => {
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
const viewProfile = async (req, res) => {
  const { id } = req.User;
  try {
    const user_from_db = await User.findById(id).select("firstName lastName gender emailId skills photoUrl");
    if (user_from_db) {
      res.send(user_from_db).status(200);
    } else {
      res.send("No user found").status(404);
    }
  } catch (err) {
    res.send("Error fetching data").status(500);
  }
};

// Reset password for a particular user
const resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  console.log(newPassword);
  const passwordHash = await bcrypt.hash(newPassword, 10);
  try {
    const user_from_db = await User.findById(req.User.id);
    if (!user_from_db) {
      return res.status(404).send("User not found");
    }
    user_from_db.password = passwordHash;
    await user_from_db.save();

    res.status(200).send("Password reset successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error resetting password");
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

ProfileRouter.get("/view", viewProfile);
ProfileRouter.post("/resetPassword", resetPassword);
ProfileRouter.delete("/delete", deleteProfile);
ProfileRouter.patch("/updateProfile", updateUserDetails);
