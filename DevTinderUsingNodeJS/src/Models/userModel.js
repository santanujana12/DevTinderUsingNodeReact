import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: [3, "FirstName must be at least 3 characters long."],
    maxlength: 12,
  },
  lastName: {
    type: String,
    required: true,
    minLength: [3, "FirstName must be at least 3 characters long, got {VALUE}"],
    maxlength: 12,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email");
      }
    },
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: String,
  age: {
    type: Date,
    required: true,
    validate(value) {
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const month = today.getMonth() - birthDate.getMonth();

      // Check if the user is under 18
      if (age < 18 || (age === 18 && month < 0)) {
        throw new Error("User must be at least 18 years old.");
      }
    },
  },
  skills: [String],
  photoUrl: {
    type: String,
    default: "https://pixabay.com/es/illustrations/icono-usuario-masculino-avatar-5359553/"
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  }
});

// DB indexing
UserSchema.index({ firstName: 1 });


UserSchema.methods.getJWTToken = function () {
  const user = this;
  const userData = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    emailId: user.emailId
  }
  const token = jwt.sign(userData, "secret", { expiresIn: "1h" });
  return token;
};

UserSchema.methods.validatePassword = async function (password) {
  const user = this;
  const passwordHash = await bcrypt.compare(password, user.password);
  return passwordHash;
};

const User = mongoose.model("User", UserSchema);
export default User;
