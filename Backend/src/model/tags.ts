import { Schema, model } from "mongoose";

const tagsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const Tags = model("Tags", tagsSchema);