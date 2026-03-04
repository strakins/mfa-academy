import  { Schema, models, model } from "mongoose";

const CohortWorksSchema = new Schema(
  {
    title: { type: String, required: true }, // e.g. "Beginner Batch 1"
    year: { type: Number, required: true, index: true }, // 2026
    batch: { type: String, required: true }, // "Q1" | "Q2" | "Q3" | "Q4"
    slug: { type: String, required: true, unique: true, index: true }, // "2026-q1-beginner-batch-1"
    description: { type: String, default: "" },
    coverImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Cohort = models.Cohort || model("CohortWorks", CohortWorksSchema);