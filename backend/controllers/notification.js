const { findById } = require("../models/doctor");
const users=require("../models/users");
const notification=require("../models/notification");
const appointment=require("../models/appointment");


async function newNotificationUser(req,res) {
    const userid=req.user?.id;
    try{
        const notifyUser=await notification.find({ recipientId: userid});
        if(notifyUser.length===0)
        {
            return res.json({
                message:"no notification find for you!",
                data:[]
            })
        }
        return res.json(
            {
                message:"all notifications",
                data:notifyUser
            }
        )
    }
    catch(error)
    {
      return res.json(
            {
                message:"something wents wrong!",
                data:[]
            }
        )
    }  
}

async function newNotificationDoctor(req,res) {
    const doctorid=req.user?.id;
    try{
        const notifydoctor=await notification.find({ recipientId: doctorid});
        if(notifydoctor.length===0)
        {
            return res.json({
                message:"no notification find for you!",
                data:[]
            })
        }
        return res.json(
            {
                message:"all notifications",
                data:notifydoctor
            }
        )
    }
    catch(error)
    {
      return res.json(
            {
                message:"something wents wrong!",
                data:[]
            }
        )
    }  
    
}
































// async function add(req,res) {
//     const userId=req.user?.id;
//     const data=req.body;
//     if(!data)
//     {
//         return res.json({message:"error to ge the data!"});
//     }
//     const {doctorId,pationtName,mobileNumber,age,info}=req.body;
//     if(! mobileNumber||!info)
//     {
//         console.log( mobileNumber);
//         console.log(info);
//         return res.json({message:"All information must be required!"});
//     }
//     try{
//         await notification.create(
//             {doctorId,userId,pationtName,mobileNumber,age,info}
//         )
//         return res.json({message:"request send successfully!"});
//     }
//     catch(error)
//     {
//         return res.json({message:"soemthing went wrong!"});
//     }   
// }


async function serchForDoctor(req,res) {
   const id=req.params.id;
   console.log("doctor id",id);
   if(!id)
   {
     return res.json({message:"error to get id!"});
   }
   try{
       const doctor=await notification.find({doctorId:id});
       console.log(doctor);
       if(!doctor)
       {
        console.log(doctor);
        return res.json({
                    message:"notthing find for you!",
                    data: []
                });
       }
       return res.json({
        message:"get this for you!",
        data:doctor
       });
   }
   catch(error)
   {
    return res.json({
        message:"something wents wronng!",
        data:[]
    })
   }   
}

async function serchForUser(req,res) {
   const id=req.user?.id;
   console.log("user id",id);
   if(!id)
   {
     return res.json({message:"error to get id!"});
   }
   try{
       const user=await notification.find({userId:id});
       console.log(user);

       if(!user)
       {
        console.log(user);
        return res.json({
                    message:"notthing find for you!",
                    data: []
                });
       }
       return res.json({
        message:"get this for you!",
        data:user
       });
   }
   catch(error)
   {
    return res.json({
        message:"something wents wronng!",
        data:[]
    })
   }   
}

async function handleAccepct(req,res) {
    const id=req.params.id;
    console.log(id);
    try{
        const getNotification=await notification.findById(id);
        if(!getNotification)
        {
            return res.json({message:"error to get notification!"});
        }
      
        const [dayPart,timePart]=getNotification.info.split(":");
        const dayP=dayPart.trim();
        const[startTime,endTime]=timePart.split("to");
        const startP=startTime.trim();
        const endP=endTime.trim();
        const newApp=await appointment.create(
            {
                doctorId: getNotification.doctorId,
                userId:getNotification.userId,
                day:dayP,
                start:startP,
                end:endP
            }
        )
       
       const result= await notification.findByIdAndDelete(id);
       if(!result)
       {
        console.log("deletion operation perform successfully!");
       }
       return res.json({message:"request accepcted"})

    }
    catch(error)
    {
        return res.json({message:"something wents wrong!"});
    }

    
}





module.exports={
    // add,
    serchForDoctor,
    serchForUser,
    handleAccepct,
    newNotificationUser,
    newNotificationDoctor
}

