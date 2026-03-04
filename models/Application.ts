import mongoose, { Schema, Model } from "mongoose";

export type ApplicationStatus = "SUBMITTED" | "ACCEPTED" | "REJECTED";

export type ApplicationDoc = {
  userId: mongoose.Types.ObjectId;
  cohortId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
};

const ApplicationSchema = new Schema<ApplicationDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    cohortId: { type: Schema.Types.ObjectId, ref: "Cohort", required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    status: { type: String, enum: ["SUBMITTED", "ACCEPTED", "REJECTED"], default: "SUBMITTED" },
  },
  { timestamps: true }
);

// One active application per user per cohort (helps avoid duplicates)
ApplicationSchema.index({ userId: 1, cohortId: 1 }, { unique: true });

export const Application: Model<ApplicationDoc> =
  mongoose.models.Application || mongoose.model<ApplicationDoc>("Application", ApplicationSchema);
