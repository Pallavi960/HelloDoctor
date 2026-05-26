const express=require("express");
const {adminLogin,getAlldoctors,findPending,approveRequest,rejectRequest,adminlogout,getAllusers,getAllappointment}=require("../controllers/admin");
const {getDoctorByid,deleteDoctor}=require("../controllers/doctor");
const {auth,requireRole}=require("../middleware/auth");
const adminRoute=express.Router();
const {getUserById,deleteUser}=require("../controllers/users");
const {findPendingAppointments,findrejectAppointments,completedAppointment,findApprovedAppointments,adminCompleteAppointment}=require("../controllers/appointment");
const {acceptAppointment,rejectAppointment,deleteAppointment}=require("../controllers/appointment");
const {getFeedback}=require("../controllers/feedback");

//complete testing on the postman
adminRoute.post("/login",adminLogin);
adminRoute.get("/logout",auth,requireRole("Admin"),adminlogout);
adminRoute.get("/getAlldoctors",auth,requireRole("Admin"),getAlldoctors);
adminRoute.get("/getAllusers",auth,requireRole("Admin"),getAllusers);
adminRoute.get("/getPendinglist",auth,requireRole("Admin"),findPending);
adminRoute.get("/approveRequest/:id",auth,requireRole("Admin"),approveRequest);
adminRoute.post("/rejectRequest/:id",auth,requireRole("Admin"),rejectRequest);
adminRoute.get("/getAllappointments",auth,requireRole("Admin"),getAllappointment);
adminRoute.get("/getDoctorByid/:id",auth,requireRole("Admin"),getDoctorByid);
adminRoute.get("/getUserById/:id",auth,requireRole("Admin"),getUserById);


adminRoute.post("/accept/:id",auth,requireRole("Admin"),acceptAppointment);
adminRoute.post("/reject/:id",auth,requireRole("Admin"),rejectAppointment);
adminRoute.delete("/delete/:id",auth,requireRole("Admin"),deleteAppointment);
adminRoute.get("/findPendingAppointments",auth,requireRole("Admin"),findPendingAppointments);
adminRoute.get("/completed-appointment",auth,requireRole("Admin"),completedAppointment);
adminRoute.get("/findrejectAppointments",auth,requireRole("Admin"),findrejectAppointments);
adminRoute.get("/findApprovedAppointments",auth,requireRole("Admin"),findApprovedAppointments);
adminRoute.get("/findrejectAppointments",auth,requireRole("Admin"),findrejectAppointments);
adminRoute.get("/adminCompleteAppointment/:id",auth,requireRole("Admin"),adminCompleteAppointment);
adminRoute.get("/get-feedback",auth,requireRole("Admin"),getFeedback);
adminRoute.delete("/deleteDoctor/:id",auth,requireRole("Admin"),deleteDoctor);
adminRoute.delete("/deleteUser/:id",auth,requireRole("Admin"),deleteUser);
module.exports=adminRoute;