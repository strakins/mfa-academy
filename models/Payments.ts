import mongoose, { Schema, Model } from "mongoose";

export type PaymentStatus = "PENDING" | "APPROVED" | "DECLINED";

export type PaymentDoc = {
  applicationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;

  amountNgn: number;
  proofUrl: string;
  proofPublicId?: string;

  status: PaymentStatus;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewNote?: string;

  createdAt: Date;
  updatedAt: Date;
};

const PaymentSchema = new Schema<PaymentDoc>(
  {
    applicationId: { type: Schema.Types.ObjectId, ref: "Application", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },

    amountNgn: { type: Number, required: true, min: 0 },
    proofUrl: { type: String, required: true },
    proofPublicId: { type: String },

    status: { type: String, enum: ["PENDING", "APPROVED", "DECLINED"], default: "PENDING" },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewNote: { type: String },
  },
  { timestamps: true }
);

// One payment submission per application (simple & clean)
PaymentSchema.index({ applicationId: 1 }, { unique: true });

export const Payment: Model<PaymentDoc> =
  mongoose.models.Payment || mongoose.model<PaymentDoc>("Payment", PaymentSchema);
