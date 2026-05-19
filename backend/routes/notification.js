const express=require("express");

const {auth, requireRole}=require("../middleware/auth");

const notificationRoute=express.Router();
// notificationRoute.post("/add",auth,add);



module.exports=notificationRoute;