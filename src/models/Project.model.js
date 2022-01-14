const { Schema, model, Types } = require("mongoose");

const projectSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true, maxlength: 500 },
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  budget: { type: Number, min: 0 },
  projectOwner: { type: Types.ObjectId, ref: "User" },
  tasks: [{ type: Types.ObjectId, ref: "Task" }],
});

module.exports = model("Project", projectSchema);
