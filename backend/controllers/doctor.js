const { response } = require("express");
const{ v4:uuidv4 } =require("uuid");
const { setUser }=require("../services/userAuth");
const { hashPassword, verifyPassword } = require("../services/password");
const cookieOptions = require("../services/cookieOptions");

const appointments=require("../models/appointment");

const doctors=require("../models/doctor");
const { get } = require("http");




async function register(req, res) {
    const body = req.body;
    if (!body) {
        console.log("body not found!");
    }

    try {
        const { name, email, password, spelization, degree, experience, fees, number } = req.body;
        
        // add these 2 lines
        const image = req.files?.image?.[0]?.path || "";
        const cv    = req.files?.cv?.[0]?.path    || "";

        if (!name || !email || !password) {
            return res.json({ message: "name email password are required!" });
        }

        const alredyExist = await doctors.findOne({ email });
        if (alredyExist) {
            return res.json({ message: "Doctor with this mail id is already exists!" });
        }

        const passwordHash = await hashPassword(password);
        await doctors.create({
            name, email, password:passwordHash, spelization,
            degree, experience, fees,
            number: Number(number),
            image, // added
            cv     // added
        });

        return res.json({ message: "doctor account created successfully!" });
    }
    catch (error) {
        console.log(error);
        return res.json({ message: "something went's wrong!" });
    }
}







async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ message: "Email and password are required for login!" });
        }

        // Find doctor by email only first
        const findDoctor = await doctors.findOne({ email }).select("+password");

        if (!findDoctor) {
            return res.json({
                success: false,
                message: "Please register first"
            });
        }

        //  Check if doctor is approved by admin
        if (findDoctor.verify !== "approved") {
            return res.json({
                success: false,
                message: "Your account is not approved yet. Once admin approves your profile, you'll receive a mail,then you can login!"
            });
        }

        // Check password
        if (await verifyPassword(findDoctor, password)) {
            const token = setUser(findDoctor, "Doctor");
            res.cookie("uuid", token, cookieOptions);
            return res.json({
                success: true,
                message: "Login successfully"
            });
        } else {
            return res.json({
                success: false,
                message: "Oops! Password does not match.",
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.json({ message: "Something went wrong!" });
    }
}
async function logout(req,res) {
    try{
        res.clearCookie("uuid", cookieOptions);
        return res.json({message:"logout successfully!"});
    }
    catch(error)
    {
        console.log(error);
        return res.json({message:"something wents wrong!"});
    }
}


async function addTimeslot(req,res) {
 const doctorId=req.user?.id;
//   console.log("doctor id is:",doctorId);
   try{
    const doctor=await doctors.findById(doctorId);
    console.log(doctor);
    if(!doctor)
    {
        return res.json({message:"not getting this doctor!"});
    }
    // const day=new Date(req.body.day);
    // const start=new Date(req.body.start);
    // const end=new Date(req.body.end);
   const{day,start,end}=req.body;
    if(!day || !start || !end)
    {
        return res.json({message:"info must require!"});
    }
   const newDay=new Date(day);
   const newStart=new Date(day+"T"+start);
   const newEnd=new Date(day+"T"+end);         
       doctor.timeSlots.push({
        day:newDay,
        start:newStart,
        end:newEnd
  });
      
       await doctor.save();//show the new one
       console.log("saved info!");
       return res.json({message:"time slot added"});
    }
    catch(error)
    {
        return res.json({
            message:"something wents wrong!",
            error: process.env.NODE_ENV === "production" ? "Something went wrong!" : error
        });
    }   
}


async function counDoctors(req,res) {  
    try{
        const totalPending = await doctors.countDocuments({ verify:"approved"});
        if(!totalPending)
        {
            return res.json({
                message:"no doctor found",
                count:0
            })
        }
        return res.json(
            {
                message:"get this doctors",
               count:totalPending
            }
        );
     }
     catch(error)
     {
        return res.json({message:"soemthing wents wrong"});
     } 
}





async function my_timing(req,res) {
    const getId =req.params.id;
    try{
       const slot=await doctors.findOne({getId});
    if(slot.length===0)
    {
        return res.json({
            message:"no slot avalible!",
            getSlot:[]
        })
    }
    else{
        return res.json({
            message:"data getting!",
            getSlot:slot
        })
    }
    }
    catch(error)
    {
        return res.json({message:"something wents wrong!"});
    }
    
    
}



//find by spelization
async function Avalibility(req,res) {
         
    try{
        const type=req.params.type;
        if(!type)
        {
            console.log("type not found!");
            return res.json({message:"type not found!"});
        }
        
        const findDoctors=await doctors.find({spelization:type});
        if(findDoctors.length===0)
        {
            return res.json({
                message:"no doctor avalible",
                getDoctors: []
            });
        }
        else{
            return res.json(
                {
                    message:"avalible doctors list!",
                    getDoctors:findDoctors
                    
                }
            );
        }
       
    }
    catch(error)
    {
        return res.json({message:"something wents wrong!"});
    } 
}

async function getDoctorByid(req, res) {
    
  const reqId = req.params.id;
    
  try {
    const getDoctor = await doctors.findById(reqId);
    
    if (!getDoctor) {
      return res.status(404).json({
        message: "Doctor not found!",
        data: null
      });
    }

    return res.json({
      message: "Doctor data fetched successfully!",
      data: getDoctor
    });

  } catch (error) {
    console.log("error is:",error);
    return res.status(500).json({
      message: "Something went wrong!",
      error: process.env.NODE_ENV === "production" ? "Something went wrong!" : error.message
    });
  }
}

async function check(req,res) {
    const role=req.user?.role;
    if(role=="user")
    {
        return res.json({
            DoctorId:"",
            message:"Access denide!"
        })
    }
    else{
        const DoctorId=req.user?.id;
        return res.json(
            {
                DoctorId:DoctorId,
                message:"access"
            }
        )
    }
}

async function myprofile(req,res) {
   
    try{
        const getDoctorID = req.user?.id;
        const getDoctor = await doctors.findById(getDoctorID);
        // console.log("doctor id is:",getDoctor);
        if (!getDoctor) {
            return res.status(404).json({
              message: "Doctor not found!",
              data: null
            });
          }

          return res.json({
            message: "Doctor data fetched successfully!",
            data: getDoctor
          });
    }
    catch(error)
    {
        return res.status(500).json({
            message: "Something went wrong!",
            error: process.env.NODE_ENV === "production" ? "Something went wrong!" : error.message
        });
    }

}

async function countDoctors(req,res) {
    try{
        const totalPending = await doctors.countDocuments({ verify:"approved"});    
        if(!totalPending)
        {
            return res.json({
                message:"no doctor found",
                count:0
            })
        }

        return res.json(    

            {
                message:"get this doctors",
               count:totalPending       

            }
        );
     }
     catch(error)
     {
        return res.json({message:"soemthing wents wrong"});
     }
}


async function updateProfile(req, res) {

    try {

        const doctorId = req.user?.id;
        if (!req.body) {
            return res.json({
                success: false,
                message: "Request body not found!"
            });
        }

        const password = req.body.password;
        const fees = req.body.fees;
        const number = req.body.number;

        const updates = { fees, number };
        if (password) {
            updates.password = await hashPassword(password);
        }

        const updatedDoctor = await doctors.findByIdAndUpdate(
            doctorId,
            updates,
            {
                new: true
            }
        );

        if (!updatedDoctor) {

            return res.json({
                success: false,
                message: "Doctor not found!"
            });

        }

        return res.json({
            success: true,
            message: "Profile updated successfully!",
            data: updatedDoctor
        });

    }

    catch (error) {

        console.log(error);

        return res.json({
            success: false,
            message: "Something went wrong!"
        });

    }

}

async function getAllDoctors(req, res) {

    try {

        const allDoctors = await doctors.find({ verify: "approved" });

        if (allDoctors.length === 0) {

            return res.json({
                success: false,
                message: "No doctors found!",
                data: []
            });

        }

        return res.json({
            success: true,
            message: "Doctors fetched successfully!",
            data: allDoctors
        });

    } 
    
    catch (error) {

        console.log(error);

        return res.json({
            success: false,
            message: "Something went wrong!"
        });

    }

}


// GET ALL AVAILABLE SLOTS OF DOCTOR

async function getDoctorSlots(req, res) {

    try {

        const doctorId = req.params.id;
        
        const doctor = await doctors.findById(doctorId);

        if (!doctor) {

            return res.status(404).json({

                success: false,

                message: "Doctor not found!",

                slots: []

            });

        }

        // FILTER ONLY AVAILABLE SLOTS

        const availableSlots = doctor.timeSlots.filter(

            (slot) => slot.isBooked === false

        );

        return res.json({

            success: true,

            message: "Slots fetched successfully!",

            slots: availableSlots

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

async function deleteDoctor(req, res) {
    try {
        const doctorId = req.params.id;
        const deletedDoctor = await doctors.findByIdAndDelete(doctorId);    
        if (!deletedDoctor) {

            return res.json({
                success: false,
                message: "Doctor not found!"
            });
        }

        return res.json({
            success: true,
            message: "Doctor deleted successfully!"
        });
    }
    catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "Something went wrong!"
        });
    }
}



module.exports={
    register,
    login,
    logout,
    addTimeslot,
    Avalibility,
    my_timing,
    getDoctorByid,
    check,
    counDoctors,
    myprofile,
    updateProfile,
    getAllDoctors,
    getDoctorSlots,
    deleteDoctor   

}
