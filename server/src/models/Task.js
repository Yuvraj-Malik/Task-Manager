import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 2000, default: "" },
    status: { type: String, enum: ["pending", "completed"], default: "pending" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    category: {
      type: String,
      enum: ["Work", "Personal", "Urgent", "Other"],
      default: "Work",
      trim: true,
    },
    dueDate: { type: Date },
    subtasks: [
      {
        title: { type: String, required: true, trim: true },
        completed: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

taskSchema.index({ user: 1, status: 1 });

export default mongoose.model("Task", taskSchema);
