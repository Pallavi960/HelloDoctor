const express=require("express");
const {register,login,logout,countUsers,myprofile,updateUserProfile}=require("../controllers/users");
const {auth, requireRole}=require("../middleware/auth");
const {getAllDoctors,getDoctorByid,getDoctorSlots}=require("../controllers/doctor");
const {add,userAppointment}=require("../controllers/appointment");
const {addFeedback}=require("../controllers/feedback");
const {newNotificationUser}=require("../controllers/notification");
const userRoute=express.Router();

userRoute.post("/register",register);
userRoute.post("/login",login);
userRoute.get("/logout",auth,requireRole("user"),logout);

userRoute.post("/Book/:id",auth,requireRole("user"),add);
userRoute.get("/user-appointment",auth,requireRole("user"),userAppointment);
userRoute.get("/user-count",countUsers);
userRoute.get("/all-doctors",auth,requireRole("user"),getAllDoctors);
userRoute.get("/getDoctorByid/:id",auth,requireRole("user"),getDoctorByid);
userRoute.get("/getDoctorSlots/:id",auth,requireRole("user"),getDoctorSlots);
userRoute.post("/add-feedback/:id",auth,requireRole("user"),addFeedback);
userRoute.get("/notificationUser",auth,requireRole("user"),newNotificationUser);
userRoute.get("/myprofile",auth,requireRole("user"),myprofile);
userRoute.put("/update-user-profile",auth,requireRole("user"),updateUserProfile);
module.exports = userRoute; 

