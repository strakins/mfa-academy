import mongoose, { Schema, Model } from "mongoose";

export type CourseDoc = {
  slug: string;
  title: string;
  durationMonths: number;
  tuitionNgn: number;
  registrationFeeNgn: number;
  audience: string;
  trackTags: string[];
  outlines: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const CourseSchema = new Schema<CourseDoc>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    title: { type: String, required: true, trim: true },
    durationMonths: { type: Number, required: true, min: 1 },
    tuitionNgn: { type: Number, required: true, min: 0 },
    registrationFeeNgn: { type: Number, required: true, min: 0 },
    audience: { type: String, required: true },
    trackTags: [{ type: String }],
    outlines: [{ type: String }],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Course: Model<CourseDoc> =
  mongoose.models.Course || mongoose.model<CourseDoc>("Course", CourseSchema);
