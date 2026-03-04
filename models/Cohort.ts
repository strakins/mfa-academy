import mongoose, { Schema, Model } from "mongoose";

export type CohortStatus = "OPEN" | "ONGOING" | "ENDED";

export type CohortDoc = {
  year: number;
  batch: number; // 1..4
  name: string;  // e.g. "2026 • Batch 1"
  startDate?: Date;
  endDate?: Date;
  status: CohortStatus;
  availableCourseIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
};

const CohortSchema = new Schema<CohortDoc>(
  {
    year: { type: Number, required: true, index: true },
    batch: { type: Number, required: true, min: 1, max: 4, index: true },
    name: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ["OPEN", "ONGOING", "ENDED"], default: "OPEN" },
    availableCourseIds: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  },
  { timestamps: true }
);

// unique cohort per year+batch
CohortSchema.index({ year: 1, batch: 1 }, { unique: true });

export const Cohort: Model<CohortDoc> =
  mongoose.models.Cohort || mongoose.model<CohortDoc>("Cohort", CohortSchema);
