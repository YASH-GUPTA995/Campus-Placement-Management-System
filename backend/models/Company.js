import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required!"],
      unique: true,
      trim: true,
    },
    industry: { type: String, default: "Technology" },
    website: { type: String, default: "" },
    logo: {
      publicId: { type: String, default: "" },
      url: { type: String, default: "" },
    },
    description: { type: String, default: "" },
    hrName: { type: String, default: "" },
    hrEmail: { type: String, default: "" },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Company user account is required!"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Company = mongoose.model("Company", companySchema);
