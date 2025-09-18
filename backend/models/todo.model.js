import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  time: {
    type: String,
    default: "" // store as "YYYY-MM-DDTHH:mm"
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
