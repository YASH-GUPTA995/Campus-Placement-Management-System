import mongoose from "mongoose";

const eligibilityCriteriaSchema = new mongoose.Schema(
  {
    minCGPA: { type: Number, default: 0, min: 0, max: 10 },
    allowedBranches: { type: [String], default: [] }, // empty = all branches allowed
    min10thPercent: { type: Number, default: 0 },
    min12thPercent: { type: Number, default: 0 },
    maxActiveBacklogs: { type: Number, default: 0 },
    eligibleCTCRequired: { type: Boolean, default: false },
    pwdAllowed: { type: Boolean, default: true },
    graduationYearMin: { type: Number, default: 0 },
    graduationYearMax: { type: Number, default: 9999 },
  },
  { _id: false }
);

const roleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Role title is required!"],
    trim: true,
  },
  description: { type: String, default: "" },
  location: { type: String, default: "India" },
  ctcLPA: { type: Number, default: 0 },
  stipendPerMonth: { type: Number, default: 0 },
  jobType: {
    type: String,
    enum: ["Internship", "Full-time", "Both"],
    default: "Full-time",
  },
  applicationDeadline: { type: Date, default: null },
  applicationStatus: {
    type: String,
    enum: ["Draft", "Open", "Closed"],
    default: "Draft",
  },
  eligibilityCriteria: {
    type: eligibilityCriteriaSchema,
    default: () => ({}),
  },
  totalApplicants: { type: Number, default: 0 },
});

const placementDriveSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required!"],
    },
    academicYear: {
      type: String,
      required: [true, "Academic year is required!"],
      default: "2024-25",
    },
    type: {
      type: String,
      enum: ["Internship", "Full-time", "Both"],
      default: "Full-time",
    },
    isActive: { type: Boolean, default: true },
    roles: [roleSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

placementDriveSchema.index({ company: 1, academicYear: 1 });

export const PlacementDrive = mongoose.model("PlacementDrive", placementDriveSchema);
