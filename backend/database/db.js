// db.js
const mongoose = require("mongoose");

// Studio 3T'de kullandığınız bağlantı URL'sini buraya yazın
const uri = "mongodb://localhost:27017/system-auth";

// MongoDB'ye bağlan
const connection = () => {
    mongoose.connect(uri,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })

.then(() => console.log("MongoDB'ye baglandi!"))
 .catch((err) => console.log("MongoDB baglanti hatasi:" + err.message));
  }

  module.exports = connection;