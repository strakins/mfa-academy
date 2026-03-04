import mongoose, { Schema, Model } from "mongoose";

export type NoteVisibility = "STUDENTS_ONLY" | "PUBLIC";

export type NoteDoc = {
  title: string;
  cohortId: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId; // instructor
  description?: string;

  fileUrl: string;
  filePublicId?: string;
  fileType: "pdf" | "image" | "other";

  visibility: NoteVisibility;

  createdAt: Date;
  updatedAt: Date;
};

const NoteSchema = new Schema<NoteDoc>(
  {
    title: { type: String, required: true, trim: true },
    cohortId: { type: Schema.Types.ObjectId, ref: "Cohort", required: true, index: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    description: { type: String },

    fileUrl: { type: String, required: true },
    filePublicId: { type: String },
    fileType: { type: String, enum: ["pdf", "image", "other"], default: "other" },

    visibility: { type: String, enum: ["STUDENTS_ONLY", "PUBLIC"], default: "STUDENTS_ONLY" },
  },
  { timestamps: true }
);

NoteSchema.index({ cohortId: 1, createdAt: -1 });

export const Note: Model<NoteDoc> = mongoose.models.Note || mongoose.model<NoteDoc>("Note", NoteSchema);
