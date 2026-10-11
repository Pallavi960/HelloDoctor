const jwt=require("jsonwebtoken");
const secret=process.env.JWT_SECRET;

function setUser(user,role)
{
    const playload={
        id:user._id,
        role:role
    }
    return jwt.sign(playload,secret,{expiresIn:"1d"});
}

function getUser(token)
{
    return jwt.verify(token,secret);
}
module.exports={
    setUser,getUser
}
