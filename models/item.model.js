import mongoose from "mongoose";
const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrls: {
      type: [String],
    },
    imageUrlsID: {
      type: [String],
    },
    price: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["shirt", "pant", "shoes", "sports gear"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export const Item = mongoose.model("Item", itemSchema);
