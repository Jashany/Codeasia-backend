import mongoose from "mongoose";

const admin = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const Admin = mongoose.model("Admin", admin);
export default Admin;