import mongoose from "mongoose";

const selectedStudentSchema = new mongoose.Schema(
  {
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "StudentMaster" },
    remarks: { type: String, default: "" },
  },
  { _id: false }
);

const resultSchema = new mongoose.Schema(
  {
    driveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlacementDrive",
      required: true,
    },
    roleId: { type: mongoose.Schema.Types.ObjectId, required: true },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    selectedStudents: [selectedStudentSchema],
    // Company uploads result → directly published to students (per updated spec)
    status: {
      type: String,
      enum: ["Pending", "Published"],
      default: "Pending",
    },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

resultSchema.index({ driveId: 1, roleId: 1 }, { unique: true });

export const Result = mongoose.model("Result", resultSchema);
