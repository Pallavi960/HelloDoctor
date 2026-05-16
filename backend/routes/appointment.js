const express=require("express");
const {add,findPendingAppointments,deleteAppointment,counPending, userAppointment,completedAppointment,serchAppointment,acceptAppointment,rejectAppointment}=require("../controllers/appointment");
const {auth, requireRole}=require("../middleware/auth");
const appointmentRoute=express.Router();
appointmentRoute.post("/Book",auth,requireRole("user"),add);
appointmentRoute.get("/completed-appointment",auth,completedAppointment);

appointmentRoute.get("/user-appointment",requireRole("user"),auth,userAppointment);
appointmentRoute.get("/getAppointmentByid/:id",auth,serchAppointment);
appointmentRoute.put("/accept/:id",auth,requireRole("Doctor"),acceptAppointment);
appointmentRoute.put("/reject/:id",auth,requireRole("Doctor"),rejectAppointment);
appointmentRoute.delete("/delete/:id",auth,requireRole("user"),deleteAppointment);
module.exports=appointmentRoute;