const express = require("express");
const Task = require("../models/task");
const router = express.Router();

// Tüm görevleri getir (GET: /api/tasks)
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({}).populate("user");
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Görev detaylarını getir: Ana görev ve ona bağlı alt görevler (GET: /api/tasks/detail?id=...)
router.get("/detail", async (req, res) => {
  try {
    const { id } = req.query;
    const mainTask = await Task.findById(id).populate("user");
    if (!mainTask) {
      return res.status(404).json({ message: "Görev bulunamadı" });
    }
    // Bu ana göreve ait alt görevleri getiriyoruz.
    const subTasks = await Task.find({ parentTask: id }).populate("user");
    res.json({ mainTask, subTasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Yeni görev oluşturma (POST: /api/tasks)
router.post("/", async (req, res) => {
  try {
    const newTask = new Task({
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      title: req.body.title,
      user: req.body.user,
      completed: req.body.completed,
      parentTask: req.body.parentTask || null // Parent task bilgisi korunuyor
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error("Error saving task:", err);
    res.status(500).json({ message: err.message });
  }
});

// Görev silme (DELETE: /api/tasks/:id)
router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Görev bulunamadı" });
    }
    res.status(200).json({ message: "Görev başarıyla silindi" });
  } catch (err) {
    res.status(500).json({ message: "Silme işlemi başarısız", error: err });
  }
});

// Görev güncelleme (PATCH: /api/tasks/:id)
router.patch("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Görev bulunamadı" });
    }
    if (req.body.completed !== undefined) {
      task.completed = req.body.completed;
    }
    // İhtiyaca göre diğer alanlar da güncellenebilir
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
