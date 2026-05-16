const users=require("../models/users");
const{ v4:uuidv4 } =require("uuid");
const { setUser }=require("../services/userAuth");

async function register(req,res) {
    try{
    const {name,email,password}=req.body;
    if(!email || !name || !password)
    {
        return res.json({message:"name email and password must require!"});
    }
    const existsEmail=await users.findOne({email});
    if(existsEmail)
    {
        return res.json({message:"this mail id is already registerd!"});
    }
  
     await users.create(
        {
                name,email,password
       });
     res.json({message:"account created successfully!"});  
    
    }
    catch(error)
    {
        console.log(error);
        return res.json({message:"something wents wrong!"});
    }
    
}

//complete postman request and test it
async function login(req,res) {
    try{
        const {email,password}=req.body;
        if(!email || !password)
        {
            return res.json({message:"email and password must require fo the login!"});
        }
        else{
            const finduser= await users.findOne({email});
             if(!finduser)
            {

                return res.json(
                    {
                        success:false,
                        message:"please register first"
                    });
            }
            if(finduser.password===password)
            {    
                const token=setUser(finduser,"user");
                console.log("token:",token);
                res.cookie("uuid",token);
                
                return res.json(
                    {
                        success:true,
                        message:"login user  successfully!"
                    });
            }
            else{
                return res.json(
                    {
                        success:false,
                        message:"password not mathch!"
                    });
            }
        }
    }
    
   catch(error)
    {
        console.log(error);
        return res.json({
            success:false,
            message:"something wents wrong!"});
    }
}

async function logout(req,res) {
    try{
        res.clearCookie("uuid");
        return res.json({
            success:true,
            message:"logout successfully!"
        });
    }           
    catch(error)
    {
        console.log(error); 
        return res.json({
            success:false,
            message:"something wents wrong!"
        });
    }   
}


async function countUsers(req,res) {
    try{
         const c = await users.countDocuments();
       
         return res.json({
            message:"get this data for userCount",
            count:c
         })
    }
    catch(error)
    {
        return res.json({
            message:"something wents wrong!"
        })
    }  
}

async function countUsers(req,res) {
    try{
         const c = await users.countDocuments();
            return res.json({
            message:"get this data for userCount",
            count:c
         })
    }   
    catch(error)
    {
        return res.json({
            message:"something wents wrong!"
        })
    }
}

async function getUserById(req,res) {
    const id=req.params.id;
    console.log("user id",id);
    if(!id)
    {
        return res.json({message:"error to get id!"});
    }
    try{        
        const user=await users.findById(id);
        console.log(user);  
            if(!user)
            {
                console.log(user);
                return res.json({       
                    message:"notthing find for you!",
                    data: []
                });
            }           
            else{
                return res.json({
                    message:"get this for you!",    
                    data:user
                });
            }

    }
    catch(error)
    {
        return res.json({
            message:"something wents wronng!",
            data:[]
        })
    }       
}






module.exports={
    register,
    login,
    logout,
    countUsers,
    getUserById,
    
}
