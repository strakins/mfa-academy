import mongoose, { Schema, Model } from "mongoose";

export type FeedbackType = "ACADEMY" | "WORK";

export type FeedbackDoc = {
  type: FeedbackType;
  userId: mongoose.Types.ObjectId;
  message: string;
  rating?: number; // 1..5 optional
  workId?: mongoose.Types.ObjectId; // if type=WORK
  createdAt: Date; 
  updatedAt: Date;
};

const FeedbackSchema = new Schema<FeedbackDoc>(
  {
    type: { type: String, enum: ["ACADEMY", "WORK"], default: "ACADEMY", index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    message: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5 },
    workId: { type: Schema.Types.ObjectId, ref: "Work" }, 
  },
  { timestamps: true }
);

FeedbackSchema.index({ createdAt: -1 });

export const Feedback: Model<FeedbackDoc> =
  mongoose.models.Feedback || mongoose.model<FeedbackDoc>("Feedback", FeedbackSchema);
