import mongoose from "mongoose";
import { Schema } from "mongoose";

const shelfSchema = new Schema({
  itemName: {
    type: String,
    required: true,
  },
  itemPrice: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  circle: {
    type: String,
    required: true,
  },
  circleIdString: {
    type: String,
    required: true,
  },
  ownerId: {
    type: String,
    required: true,
  },
  imageBase64: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: "",
  },
  status: {
    type: String,
    default: "available",
  },
  description: {
    type: String,
    default: "",
  },
  requests: {
    type: [String],
    default: [],
  },
});

export default mongoose.models.Shelf || mongoose.model("Shelf", shelfSchema);
