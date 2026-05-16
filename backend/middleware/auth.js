const{getUser}=require("../services/userAuth")

const auth=(req,res,next)=>
{
  const token=req.cookies?.uuid;
  if(!token)
  {
    return res.status(401).json({
        success:false,
        message:"login required"
    });
  }

 try{
    const user=getUser(token);
 if(!user)
 {
     return res.status(401).json({
        success:false,
        message:"session failed!"
    });
 }
   req.user=user;
   next();
}
catch(error)
{
  return res.status(404).json({message:"error to find use id!"});
}
}

const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({
        success: false,
        message: "Access denied!"
      });
    }
    next();
  };
};

module.exports={
    auth,
    requireRole
}