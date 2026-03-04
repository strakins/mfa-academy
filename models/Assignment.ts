import mongoose, { Schema, Model } from "mongoose";

export type AssignmentDoc = {
  title: string;
  cohortId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId; // instructor
  description?: string;

  dueDate?: Date;

  assets: { url: string; publicId?: string; type: "image" | "pdf" | "other" }[];

  createdAt: Date;
  updatedAt: Date;
};

const AssignmentSchema = new Schema<AssignmentDoc>(
  {
    title: { type: String, required: true, trim: true },
    cohortId: { type: Schema.Types.ObjectId, ref: "Cohort", required: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    description: { type: String },

    dueDate: { type: Date },

    assets: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
        type: { type: String, enum: ["image", "pdf", "other"], default: "other" },
      },
    ],
  },
  { timestamps: true }
);

AssignmentSchema.index({ cohortId: 1, createdAt: -1 });

export const Assignment: Model<AssignmentDoc> =
  mongoose.models.Assignment || mongoose.model<AssignmentDoc>("Assignment", AssignmentSchema);
