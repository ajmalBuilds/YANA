import mongoose from "mongoose";
import { Schema } from "mongoose";


const bulletinSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    timeOfEvent: {
        type: String,
        required: true,
    },
    venue: {
        type: String,
        required: true,
    },
    attendingMembers: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

export default mongoose.models.Bulletin || mongoose.model("Bulletin", bulletinSchema);