// index.js
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./database/db");

// JSON verileri parse edebilmek için middleware
app.use(express.json());

// CORS desteği (Angular uygulaması ile çalışıyorsanız)
app.use(cors());

// Router'lar
const authRouter = require("./routers/auth.router");
const taskRouter = require("./routers/task.router");

// API endpoint'leri
app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter); // Görevler için router

// Veritabanı bağlantısını kuruyoruz
connection();

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Uygulama http://localhost:${port} portunda ayağa kalktı`);
});
