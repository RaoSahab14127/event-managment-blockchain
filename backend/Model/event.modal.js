import mongoose from "mongoose";
const { Schema } = mongoose;

const eventSchema = new Schema({
    event_id:{
        type: Number,
        required: true,
    },
    des:{
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    image_url:{
        type: String,
        required: true,
    }
});

export default mongoose.model("Event", eventSchema)