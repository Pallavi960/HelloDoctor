const express = require("express");

const appointment = require("../models/appointment");
const doctors = require("../models/doctor");
const notification = require("../models/notification");
const users = require("../models/users");



// ADD APPOINTMENT
// ADD APPOINTMENT
async function add(req, res) {
    const userId = req.user?.id;

    const {
        slotId,
        pationtName,
        mobileNumber,
        age
    } = req.body;

    if (!slotId || !pationtName || !mobileNumber || !age) {
        return res.json({
            message: "All information is required!"
        });
    }

    try {

        // FIND DOCTOR WHO OWNS THIS SLOT
        const doctor = await doctors.findOne({
            "timeSlots._id": slotId
        });

        if (!doctor) {
            return res.json({
                message: "Doctor not found for this slot!"
            });
        }

        // GET THE SLOT
        const slot = doctor.timeSlots.id(slotId);

        if (!slot) {
            return res.json({
                message: "Slot not found!"
            });
        }

        if (slot.isBooked) {
            return res.json({
                message: "Slot already booked!"
            });
        }

        //  CREATE APPOINTMENT
        const newAppointment = await appointment.create({

            doctorId: doctor._id, // derived automatically
            userId,
            slotId,

            pationtName,
            mobileNumber,
            age,

            day: slot.day,
            start: slot.start,
            end: slot.end
        });

        // mark slot booked
        slot.isBooked = true;
        await doctor.save();

        // notifications
        await notification.create({
            recipientId: userId,
            model: "users",
            message: "Your appointment request has been sent successfully.",
            type: "add",
            appointmentId: newAppointment._id
        });

        await notification.create({
            recipientId: doctor._id,
            model: "doctors",
            message: "New Appointment Request.",
            appointmentId: newAppointment._id
        });

        return res.json({
            message: "Request sent successfully!",
            appointment: newAppointment
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong!"
        });
    }
}


// ACCEPT APPOINTMENT
async function acceptAppointment(req, res) {

    try {

        const appointmentId = req.params.id;

        const appoint = await appointment.findByIdAndUpdate(
            appointmentId,
            {
                status: "approved"
            },
            {
                new: true
            }
        );

        if (!appoint) {

            return res.status(404).json({
                message: "Appointment not found"
            });

        }

         await notification.create({
            recipientId: appoint.userId,
            model: "users",
            title: "Appointment Approved",
            message:"Your appointment has been approved by the admin.",
            type: "approved",
            appointmentId: appointmentId,
            isRead: false

        });

        return res.json({

            success: true,

            message: "Appointment accepted successfully",

            data: appoint

        });

    }
    catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        });

    }
}



// REJECT APPOINTMENT
async function rejectAppointment(req, res) {

    try {

        const appointmentId = req.params.id;

        const appoint = await appointment.findByIdAndUpdate(
            appointmentId,
            {
                status: "rejected"
            },
            {
                new: true
            }
        );

        if (!appoint) {

            return res.status(404).json({
                message: "Appointment not found"
            });

        }

        await notification.create({
            recipientId: appoint.userId,
            model: "users",
            title: "Appointment Rejected",
            message:"Your appointment has been rejected by the admin.",
            type: "rejected",
            appointmentId: appointmentId,
            isRead: false
        });

        return res.json({

            success: true,

            message: "Appointment rejected successfully",

            data: appoint

        });

    }
    catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Something went wrong"
        });

    }
}



// COMPLETE APPOINTMENT
async function adminCompleteAppointment(req, res) {

    try {

        const appointmentId = req.params.id;

        const appoint = await appointment.findByIdAndUpdate(
            appointmentId,
            {
                status: "completed"
            },
            {
                new: true
            }
        );

        if (!appoint) {

            return res.status(404).json({
                message: "Appointment not found!"
            });

        }
        await notification.create({
            recipientId: appoint.userId,
            model: "users",
            title: "Appointment Completed",
            message: "Your appointment has been marked as completed.",
            type: "info",
            appointmentId: appointmentId,
            isRead: false

        });



        return res.json({

            success: true,

            message: "Appointment completed successfully!",

            data: appoint

        });

    }
    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Something went wrong!"

        });

    }
}



// SEARCH APPOINTMENT
async function serchAppointment(req, res) {

    try {

        const id = req.params.id;

        const appoint = await appointment.findById(id);

        if (!appoint) {

            return res.json({

                message: "No appointment found!",

                data: null

            });

        }

        return res.json({

            message: "Appointment found",

            data: appoint

        });

    }
    catch (error) {

        return res.status(500).json({

            message: "Something went wrong!",

            data: null

        });

    }
}



// FIND PENDING APPOINTMENTS
async function findPendingAppointments(req, res) {

    try {

        const pendingAppointments = await appointment.find({
            status: "pending"
        });

        if (pendingAppointments.length === 0) {

            return res.json({

                message: "No pending appointments found!",

                data: []

            });

        }

        return res.json({

            message: "Pending appointments fetched successfully!",

            data: pendingAppointments

        });

    }
    catch (error) {

        console.log(error);

        return res.status(500).json({

            message: "Something went wrong!",

            error: error

        });

    }
}



// FIND APPROVED APPOINTMENTS
async function findApprovedAppointments(req, res) {

    try {

        const approvedAppointments = await appointment.find({
            status: "approved"
        });

        if (approvedAppointments.length === 0) {

            return res.json({

                message: "No approved appointments found!",

                data: []

            });

        }

        return res.json({

            message: "Approved appointments fetched successfully!",

            data: approvedAppointments

        });

    }
    catch (error) {

        console.log(error);

        return res.status(500).json({

            message: "Something went wrong!",

            error: error

        });

    }
}



// FIND COMPLETED APPOINTMENTS
async function completedAppointment(req, res) {

    try {

        const completeAppointments = await appointment.find({
            status: "completed"
        });

        if (completeAppointments.length === 0) {

            return res.json({

                msg: "No completed appointments yet!",

                data: []

            });

        }

        return res.json({

            msg: "Completed appointments fetched successfully!",

            data: completeAppointments

        });

    }
    catch (error) {

        return res.status(500).json({

            message: "Something went wrong!"

        });

    }

}



// FIND REJECTED APPOINTMENTS
async function findrejectAppointments(req, res) {

    try {

        const rejectAppointments = await appointment.find({
            status: "rejected"
        });

        if (rejectAppointments.length === 0) {

            return res.json({

                msg: "No rejected appointments yet!",

                data: []

            });

        }

        return res.json({

            msg: "Rejected appointments fetched successfully!",

            data: rejectAppointments

        });

    }
    catch (error) {

        return res.status(500).json({

            message: "Something went wrong!"

        });

    }

}



// USER APPOINTMENTS
async function userAppointment(req, res) {

    const id = req.user?.id;

    try {

        const uAppointment = await appointment.find({
            userId: id
        });

        return res.json({

            message: "Your appointments!",

            data: uAppointment

        });

    }
    catch (error) {

        return res.status(500).json({

            message: "Something went wrong!"

        });

    }

}



// COUNT APPROVED
async function counPending(req, res) {

    const id = req.user?.id;

    try {

        const totalPending = await appointment.countDocuments({

            doctorId: id,

            status: "approved"

        });

        return res.json({

            count: totalPending

        });

    }
    catch (error) {

        return res.json({

            message: "Something went wrong"

        });

    }

}



// COUNT COMPLETED
async function countComplete(req, res) {

    const id = req.user?.id;

    try {

        const totalComplete = await appointment.countDocuments({

            doctorId: id,

            status: "completed"

        });

        return res.json({

            message: "Data fetched successfully",

            count: totalComplete

        });

    }
    catch (error) {

        return res.json({

            message: "Something went wrong"

        });

    }

}



// DELETE APPOINTMENT
async function deleteAppointment(req, res) {

    try {

        const id = req.params.id;

        const deleteAppoint =
            await appointment.findByIdAndDelete(id);

        if (!deleteAppoint) {

            return res.json({

                message: "No appointment found!"

            });

        }
         await notification.create({
            recipientId: deleteAppoint.userId,
            model: "users",
            title: "Appointment Deleted",
            message:"Your appointment has been deleted",
            type: "rejected",
            appointmentId: deleteAppoint._id,
            isRead: false

        });


        return res.json({

            message: "Appointment deleted successfully!"

        });

    }
    catch (error) {

        return res.status(500).json({

            message: "Something went wrong!",

            error: error

        });

    }

}


async function completeAppointment(req, res) {

    try {
        const appointmentId = req.params.id;
        const appoint = await appointment.findByIdAndUpdate(    
            appointmentId,
            {
                status: "completed" 
            },
            {
                new: true
            }
        );      
        if (!appoint) {

            return res.status(404).json({
                message: "Appointment not found!"
            }); 
        }

        return res.json({
            success: true,
            message: "Appointment marked as completed successfully!",   
            data: appoint
        });
    }   
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!"
        });
    }   
}

//find the perticular doctor pending appointments
async function doctorsPendingAppointments(req,res) {
    try{
        const doctorId=req.user?.id;
        console.log("doctor id is:",doctorId);    
        const pendingAppointments = await appointment.find({ doctorId, status: "pending" });
        if(pendingAppointments.length===0)
        {
            return res.json({   

                message:"no pending appointments",
                data:[]
            });
        }   

        return res.json({
            message:"pending appointments fetched successfully",
            data:pendingAppointments
        });
     }
        catch(error)
        {
            return res.json({message:"soemthing wents wrong"});
        }               
} 

async function doctorsApprovedAppointments(req,res) {
    try{
        const doctorId=req.user?.id;    
        const approvedAppointments = await appointment.find({ doctorId, status: "approved" });
        if(approvedAppointments.length===0)
        {
            return res.json({
                message:"no approved appointments",
                data:[]
            });
        }
        return res.json({
            message:"approved appointments fetched successfully",
            data:approvedAppointments
        });
     } 
        catch(error)
        {
            return res.json({message:"soemthing wents wrong"});
        }

}

async function doctorsCompleteAppointments(req,res) {
    try{
        const doctorId=req.user?.id;    
        const completeAppointments = await appointment.find({ doctorId, status: "completed" });
        if(completeAppointments.length===0)
        {
            return res.json({
                message:"no completed appointments",
                data:[]
            });
        }
        return res.json({
            message:"completed appointments fetched successfully",
            data:completeAppointments
        });
     }
        catch(error)
        {
            return res.json({message:"soemthing wents wrong"});
        }       
}

async function doctorsRejectAppointments(req,res) {
    try{
        const doctorId=req.user?.id;    
        const rejectAppointments = await appointment.find({ doctorId, status: "rejected" });
        if(rejectAppointments.length===0)
        {
            return res.json({
                message:"no rejected appointments",
                data:[]
            });
        }
        return res.json({
            message:"rejected appointments fetched successfully",
            data:rejectAppointments
        });
     }
        catch(error)
        {
            return res.json({message:"soemthing wents wrong"});
        }       
}


async function doctorsDeleteAppointments(req,res) {
    try{

        const doctorId=req.user?.id;
        const appointmentId=req.params.id;

        const deleteAppointments = await appointment.findOneAndDelete({
            _id:appointmentId,
            doctorId
        });

        if(!deleteAppointments)
        {
            return res.json({
                success:false,
                message:"appointment not found"
            });
        }

        return res.json({
            success:true,
            message:"appointment deleted successfully",
            data:deleteAppointments
        });

     }
    catch(error)
    {
        console.log(error);

        return res.json({
            success:false,
            message:"something wents wrong"
        });
    }

}


module.exports = {

    add,
    findPendingAppointments,
    completedAppointment,
    findrejectAppointments,
    findApprovedAppointments,
    adminCompleteAppointment,

    counPending,
    countComplete,
    userAppointment,

    serchAppointment,
    acceptAppointment,
    rejectAppointment,
    deleteAppointment,
    completeAppointment,

    doctorsPendingAppointments,
    doctorsCompleteAppointments,
    doctorsRejectAppointments,
    doctorsDeleteAppointments,
    doctorsApprovedAppointments

};