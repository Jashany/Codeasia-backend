import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    age: {
        type: Number,
    },
    state: {
        type: String,
    },
    study: {
        type: String,
    },
    answer: {
        type: String,
    },
    newsletter: {
        type: Boolean,
    },
    mail_status:{
        type: String,
        default: "Not Sent"
    }
    
} )

const User = mongoose.model("User", userSchema);
export default User;
    