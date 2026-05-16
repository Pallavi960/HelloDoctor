const express=require("express");

const {register,login,logout,addTimeslot, Avalibility,my_timing,getDoctorByid,check,counDoctors,myprofile,updateProfile}=require("../controllers/doctor");


const {findPendingAppointments,findrejectAppointments,counPending,completedAppointment,
    countComplete,doctorsPendingAppointments,doctorsCompleteAppointments,doctorsRejectAppointments, 
    doctorsDeleteAppointments,acceptAppointment,rejectAppointment,deleteAppointment,doctorsApprovedAppointments,completeAppointment}=require("../controllers/appointment");

    
const {auth,requireRole}=require("../middleware/auth");

const doctorRoute=express.Router();


doctorRoute.post("/register",register);
doctorRoute.post("/login",login);
doctorRoute.get("/logout",auth,logout);
doctorRoute.get("/count-doctors",counDoctors);

doctorRoute.get("/Avalibility/:type",auth,requireRole("user"), Avalibility);

doctorRoute.get("/my_timing/:id",auth,my_timing);
doctorRoute.get("/getDoctorByid/:id",auth,getDoctorByid);


doctorRoute.get("/check",auth,requireRole("Doctor"),check);
doctorRoute.get("/myprofile",auth,requireRole("Doctor"),myprofile);



doctorRoute.post("/add-slot",auth,requireRole("Doctor"),addTimeslot);

//all appointmetn wich are the pending,complete,and reject by doctor
doctorRoute.get("/doctorsPendingAppointments",auth,requireRole("Doctor"),doctorsPendingAppointments);
doctorRoute.get("/doctorsRejectAppointments",auth,requireRole("Doctor"), doctorsRejectAppointments);
doctorRoute.delete("/doctorsDeleteAppointments",auth,requireRole("Doctor"), doctorsDeleteAppointments);
doctorRoute.get("/doctorsCompleteAppointments",auth,requireRole("Doctor"),doctorsCompleteAppointments); 
doctorRoute.get("/doctorsApprovedAppointments",auth,requireRole("Doctor"),doctorsApprovedAppointments);

//here the doctor will mark reject complete or the delete the appointment 
doctorRoute.put("/accept/:id",auth,requireRole("Doctor"),acceptAppointment);
doctorRoute.put("/reject/:id",auth,requireRole("Doctor"),rejectAppointment);
doctorRoute.delete("/delete/:id",auth,requireRole("Doctor"),deleteAppointment);
doctorRoute.put("/complete/:id",auth,requireRole("Doctor"),completeAppointment);

doctorRoute.get("/count-pending",auth,requireRole("Doctor"),counPending);
doctorRoute.get("/count-complete",auth,requireRole("Doctor"),countComplete);
doctorRoute.get("/count-doctors",counDoctors);
doctorRoute.put("/update-profile",auth,requireRole("Doctor"),updateProfile);


module.exports = doctorRoute; 
