import { Schema, model, models } from "mongoose";

const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, default: "" },
    contentMd: { type: String, required: true }, // markdown
    coverImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
    },
    tags: [{ type: String }],
    status: { type: String, enum: ["DRAFT", "PUBLISHED"], default: "DRAFT", index: true },
    publishedAt: { type: Date, default: null },

    authorId: { type: String, default: "" },
    authorName: { type: String, default: "" },

    readCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    likedBy: [{ type: String, index: true }], // userId/email
  },
  { timestamps: true }
);

export const BlogPost = models.BlogPost || model("BlogPost", BlogPostSchema);