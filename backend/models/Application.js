import mongoose from "mongoose";

const ruleResultSchema = new mongoose.Schema(
  { rule: String, passed: Boolean, reason: String },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentMaster",
      required: [true, "Student reference is required!"],
    },
    driveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlacementDrive",
      required: [true, "Drive is required!"],
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Role ID is required!"],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    // Resume stored as Google Drive link (updated per architecture doc)
    resumeLink: {
      type: String,
      required: [true, "Resume Google Drive link is required!"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Shortlisted", "Selected", "Rejected", "OnHold"],
      default: "Pending",
    },
    eligibilitySnapshot: {
      isEligible: { type: Boolean, default: true },
      checkedAt: { type: Date },
      ruleResults: [ruleResultSchema],
    },
    submittedAt: { type: Date, default: Date.now },
    // TPO can unlock re-application per student per role
    isLocked: { type: Boolean, default: true },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Prevent duplicate applications
applicationSchema.index(
  { student: 1, driveId: 1, roleId: 1 },
  { unique: true }
);
applicationSchema.index({ driveId: 1, roleId: 1, status: 1 });
applicationSchema.index({ student: 1, status: 1 });
applicationSchema.index({ company: 1, driveId: 1 });

export const Application = mongoose.model("Application", applicationSchema);
