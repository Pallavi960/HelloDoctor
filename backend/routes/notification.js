const express=require("express");

const {auth, requireRole}=require("../middleware/auth");
const {serchForDoctor, handleAccepct, serchForUser,newNotificationUser,newNotificationDoctor}=require("../controllers/notification");

const notificationRoute=express.Router();
// notificationRoute.post("/add",auth,add);
notificationRoute.get("/serchForDoctor",serchForDoctor);
notificationRoute.get("/serchForUser/",auth,serchForUser);
notificationRoute.get("/accepct/:id",auth,handleAccepct);




//new Routess
notificationRoute.get("/userNotification",auth,requireRole("user"),newNotificationUser);
notificationRoute.get("/doctorNotification",auth,requireRole("Doctor"),newNotificationDoctor);
module.exports=notificationRoute;