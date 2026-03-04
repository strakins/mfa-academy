import mongoose, { Schema, Model } from "mongoose";

export type UserRole = "USER" | "STUDENT" | "INSTRUCTOR" | "ADMIN";

export type UserDoc = {
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  avatarUrl?: string;
  likedWorks: mongoose.Types.ObjectId[];

  student?: {
    cohortId?: mongoose.Types.ObjectId;
    courseId?: mongoose.Types.ObjectId;
    enrolledAt?: Date;
  };

  createdAt: Date;
  updatedAt: Date;
};

const UserSchema = new Schema<UserDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String },
    role: { type: String, enum: ["USER", "STUDENT", "INSTRUCTOR", "ADMIN"], default: "USER" },
    avatarUrl: { type: String },
    likedWorks: [{ type: Schema.Types.ObjectId, ref: "Work" }],

    student: {
      cohortId: { type: Schema.Types.ObjectId, ref: "Cohort" },
      courseId: { type: Schema.Types.ObjectId, ref: "Course" },
      enrolledAt: { type: Date },
    },
  },
  { timestamps: true }
);

export const User: Model<UserDoc> = mongoose.models.User || mongoose.model<UserDoc>("User", UserSchema);
