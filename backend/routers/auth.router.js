const express = require("express");
const User = require("../models/user");
const router = express.Router();
const{v4:uuidv4} = require("uuid")
const jwt = require("jsonwebtoken")

const secretKey = "My Secret Key My Secret Key 1234.";
const options ={
    expiresIn:"1d"
};
// auth.router.ts içine ekleyin
router.delete("/user/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı" });
        }
        res.json({ message: "Kullanıcı silindi" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/register", async(req,res) => {
    try {
        const user = new User(req.body);
        user._id = uuidv4();
        user.createdDate = new Date();
        user.isAdmin = false;

        const checkUserEmail = await User.findOne({email:user.email});

        if(checkUserEmail != null){
            res.status(403).json({message:"Bu mail daha once kullanildi"})
        }else{
            await user.save();
            const token = jwt.sign({},secretKey, options)
            let model ={token:token, user:user};
            res.json(model);
        }

    } catch (error) {
        res.status(500).json({message:error.message})
    }
})
// auth.router.js içine ekleyin
router.get("/users", async (req, res) => {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
router.post("/login",async (req,res) => {
    try {
        const {email, password} = req.body;

        let user = await User.findOne({email:email});
        if(user == null){
            res.status(403).json({message:"Kullanici bulunamadi"});
        }else{
            if(user.password != password){
                res.status(403).json({message:"Sifre yanlis!"});
            }else{
                const token = jwt.sign({},secretKey,options);
                let model = {token:token,user:user}
                res.json(model);
            }
        }
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

module.exports = router;