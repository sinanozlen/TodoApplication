const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  title: { type: String, required: true },
  user: { type: mongoose.Schema.Types.Mixed, required: false },
  completed: { type: Boolean, default: false },
  // Yeni alan: Eğer null ise ana görev, dolu ise alt görev
  parentTask: { type: mongoose.Schema.Types.ObjectId, ref: "Task", default: null }
});

// Üçüncü parametre ile collection adını "task" olarak belirleyebilirsiniz.
const Task = mongoose.model("Task", taskSchema, "task");

module.exports = Task;
