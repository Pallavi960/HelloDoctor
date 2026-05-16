const jwt=require("jsonwebtoken");
const secret="Pallavi@1234";

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
