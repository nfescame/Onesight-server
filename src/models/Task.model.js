const { Schema, model, Types } = require("mongoose");

const taskSchema = new Schema({
  description: { type: String, trim: true, maxlength: 500 },
  startDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["A fazer", "Fazendo", "Feito"],
    default: "A fazer",
  },
  taskOwner: { type: Types.ObjectId, ref: "User" },
  projectId: { type: Types.ObjectId, ref: "Project", required: true },
});

module.exports = model("Task", taskSchema);
