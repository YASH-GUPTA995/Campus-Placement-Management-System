import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      validate: [validator.isEmail, "Provide a valid email!"],
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minLength: [8, "Password must be at least 8 characters!"],
      select: false,
    },
    role: {
      type: String,
      required: [true, "Role is required!"],
      enum: ["Student", "Company", "TPO"],
    },
    studentRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentMaster",
      default: null,
    },
    companyRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const User = mongoose.model("User", userSchema);
