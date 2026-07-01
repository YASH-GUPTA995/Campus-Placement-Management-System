import mongoose from "mongoose";
import validator from "validator";

const studentMasterSchema = new mongoose.Schema(
  {
    rollNumber: {
      type: String,
      required: [true, "Roll number is required!"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    collegeEmail: {
      type: String,
      required: [true, "College email is required!"],
      unique: true,
      validate: [validator.isEmail, "Provide a valid college email!"],
    },
    personalEmail: {
      type: String,
      default: "",
    },
    fullName: {
      type: String,
      required: [true, "Full name is required!"],
      trim: true,
    },
    branch: {
      type: String,
      required: [true, "Branch is required!"],
      enum: ["CSE", "ECE", "EE", "ME", "CE", "IT", "PIE"],
    },
    dateOfBirth: { type: Date },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },
    cgpa: { type: Number, min: 0, max: 10, default: 0 },
    contactNumber: { type: String, default: "" },
    nationality: { type: String, default: "Indian" },
    permanentAddress: { type: String, default: "" },
    tenth: {
      year: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 },
      board: { type: String, default: "" },
    },
    twelfth: {
      year: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 },
      board: { type: String, default: "" },
    },
    activeBacklogs: { type: Number, default: 0, min: 0 },
    eligibleForCTC: { type: Boolean, default: true },
    isPWD: { type: Boolean, default: false },
    graduationYear: { type: Number, default: null },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isRegistered: { type: Boolean, default: false },
    // TPO can unlock application re-submission for individual students
    applicationUnlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// studentMasterSchema.index({ rollNumber: 1 }, { unique: true });
// studentMasterSchema.index({ collegeEmail: 1 }, { unique: true });

export const StudentMaster = mongoose.model("StudentMaster", studentMasterSchema);
