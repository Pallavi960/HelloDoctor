const mongoose=require("mongoose");
const doctorSchema=new mongoose.Schema(
    {
        name:
        {
            type:String,
            required: true,
            
        },
        email:
        {
            type:String,
            required: true,
            unique:true
        },
        password:
        {
            type:String,
             required: true,
        },
        spelization:
        {
            type:String,
             required: true,
        },
        degree:
        {
            type:String,
             required: true,
        },
        experience:
        {
            type:Number,
            required: true,
        },
        fees:{
            type:Number,
             required: true,
        },
        isAvalible:{
            type:Boolean,
            default:true
       },
       number:{
           type:Number,
           required: true,
       },
       verify:{
           type: String,
           required: true,
           default: "pending",
           enum:["pending","approved","rejected"]
        },

       // added
       image:{
           type:String,
           default:""
       },
       cv:{
           type:String,
           default:""
       },

       timeSlots:[
        {
            day:Date,
            start:Date,
            end:Date,
            isBooked:{
                type:Boolean,
                default:false
            }
        }
       ]
    }
);
const doctors=mongoose.model("doctors", doctorSchema);
module.exports=doctors;