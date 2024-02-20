import mongoose from "mongoose";

const approvedUserSchema = new mongoose.Schema({
    name: {
        type :String,
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
    }
})

const ApprovedUser = mongoose.model("ApprovedUser", approvedUserSchema);
export default ApprovedUser;