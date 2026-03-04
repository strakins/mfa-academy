import  { Schema, models, model } from "mongoose";

const WorkSchema = new Schema(
  {
    cohortId: { type: Schema.Types.ObjectId, ref: "Cohort", required: true, index: true },
    title: { type: String, default: "" },
    studentName: { type: String, default: "" }, // optional (can hide for privacy)
    category: { type: String, default: "" }, // RTW, Bridal, Corsetry etc
    description: { type: String, default: "" },

    image: {
      url: { type: String, required: true },
      publicId: { type: String, default: "" },
      width: { type: Number },
      height: { type: Number },
    },
    
    comments: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        name: { type: String, default: "" },
        message: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    // optional (later you can allow likes/comments)
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const Work = models.Work || model("Work", WorkSchema);