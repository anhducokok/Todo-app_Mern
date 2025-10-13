import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    status:{
        type: String,
        enum: ["active", "completed"],
        default: "active",
    },
    completed: {
        type: Date,
        default: null,
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "low",
    },
    dueDate: {
        type: Date,
        default: null,
    },  
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },

}, {
    timestamps: true,
});

const Task = mongoose.model("Task", taskSchema);
export default Task;