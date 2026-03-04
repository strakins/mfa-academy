import { Schema, models, model } from "mongoose";

const ReviewSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    displayName: { type: String, default: "Student" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, minlength: 10, maxlength: 1000 },
    approved: { type: Boolean, default: true, index: true },
  },
  { timestamps: true } 
);

export const Review = models.Review || model("Review", ReviewSchema);