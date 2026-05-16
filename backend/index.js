const express =require("express");
const doctorRoute=require("./routes/doctor");
const {connectMongoDB}=require("./connection");
const userRoute = require("./routes/users");
const appointmentRoute=require("./routes/appointment");
const adminRoute = require("./routes/admin");
const cors = require("cors");
const notificationRoute = require("./routes/notification");
const cookieParser = require("cookie-parser");



const app=express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: "http://localhost:5173", // ⚠️ change to your frontend URL
    credentials: true
}));

app.use(cookieParser());
//routes
app.use("/doctor",doctorRoute);
app.use("/user",userRoute);
app.use("/appointment",appointmentRoute);
app.use("/notification",notificationRoute);
app.use("/admin",adminRoute);



connectMongoDB("mongodb://localhost:27017/helloDoctor").then(() => {
    console.log("connected");
}).catch((err) => {
    console.log("error to connect");
});

let port=8000;
app.listen(port,()=>
{
    console.log(`server is running on the ${port}`);
})