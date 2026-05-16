const doctors = require("../models/doctor");
const { sendApprovalEmail,sendRejectEmail } = require("../services/mailService");
const { setUser }=require("../services/userAuth");
const users=require("../models/users");
const appointment = require("../models/appointment");

async function adminLogin(req, res) {
  try {
    const email = req.body?.email;
    const password = req.body?.password;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "email and password are required!"
      });
    }

    const adminEmail = "admin@hellodoctor.com";
    const adminPassword = "admin123";

    if (email === adminEmail && password === adminPassword) {

      const adminData = {
        _id: "admin001",
        email: adminEmail
      };

      const token = setUser(adminData, "Admin");

      res.cookie("uuid", token, {
        httpOnly: true,
      });

      return res.json({
        success: true,
        message: "admin login successful!"
      });
    }

    return res.json({
      success: false,
      message: "invalid admin credentials!"
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "something went wrong!"
    });
  }
}

async function adminlogout(req, res) {
  try {

    res.clearCookie("uuid", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
    });

    return res.json({
      success: true,
      message: "admin logged out successfully!"
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "something went wrong during logout!"
    });

  }
}

async function getAlldoctors(req,res) {

    const allDoctors=await doctors.find({ verify: "approved" });
    console.log("all doctors:",allDoctors);
    if(!allDoctors)
    {
        return res.json({msg:"error to get doctors",
            allDoctors:[]
            
        });
    }
    else{
        return res.json({
            msg:"all doctors get",
            allDoctors:allDoctors
        })
    }
}



async function findPending(req, res) {
  try { 
     const pendingList = await doctors.find({ verify: "pending" });

    if (pendingList.length === 0) {
      return res.json({
        message: "no pending list",
        data: []
      });
    }

    return res.json({
      message: "get the doctors",
      data: pendingList
    });
  } catch (error) {
    console.error("Error in findPending:", error);
    return res.status(500).json({ message: "error fetching pending list" });
  }
}


async function approveRequest(req, res) {
  try {
    const doctorId = req.params.id;
    const doctor = await doctors.findByIdAndUpdate(
      doctorId,
      { verify: "approved" },
      { new: true }
    );

    if (!doctor) {
      return res.json({ message: "doctor not found!" });
    }

    // await sendApprovalEmail(doctor.email, doctor.name);

    return res.json({
      message: "request accepted by admin and mail sent",
      data: doctor
    });
  } catch (error) {
    console.error("Error in approveRequest:", error);
    return res.status(500).json({ message: "something went wrong" });
  }
}

async function rejectRequest(req, res) {
  try {
    const doctorId = req.params.id;
    const { reason } = req.body;
    const doctor = await doctors.findByIdAndUpdate(
      doctorId,
      { verify: "rejected" },
      { new: true }
    );

    if (!doctor) {
      return res.json({ message: "doctor not found!" });
    }

    //await sendRejectEmail(doctor.email, doctor.name,reason);

    return res.json({
      message: "request rejected by admin and mail sent",
      data: doctor
    });
  } catch (error) {
    console.error("Error in rejectRequest:", error);
    return res.status(500).json({ message: "something went wrong" });
  }
}
async function getAllusers(req,res) {

  try {
    const allUsers=await users.find({});
    console.log("all users:",allUsers); 
    if(!allUsers)
    {
        return res.json({msg:"error to get users",
            allUsers:[] 
        });
    } 

    else{
        return res.json({
            msg:"all users get",
            allUsers:allUsers
         }) 

        }
      }
      catch(error)
      {
        console.log(error);
        return res.json({
            msg:"error to get users",
            allUsers:[] 
        });
      }
    }

async function getAllappointment(req,res) {
    try{
        const allAppointments=await appointment.find({});
        console.log("all appointments:",allAppointments);
        if(!allAppointments)
        {
            return res.json({msg:"error to get appointments",
                allAppointments:[] 
            });
        }
        else{ 
            return res.json({
                msg:"all appointments get",
                allAppointments:allAppointments
            })
        } 

    }
    catch(error)
    {
        console.log(error);
        return res.json({
            msg:"error to get appointments",
            allAppointments:[] 
        });
    }
  
}


module.exports = {
  findPending,
  adminLogin,
  approveRequest,
  rejectRequest,
  getAlldoctors,
  adminlogout,
  getAllusers,
  getAllappointment
  
};
