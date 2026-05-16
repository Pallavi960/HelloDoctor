const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({

    doctorId:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"doctor",
        required:true
    },

    userId:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },

    slotId:
    {
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },

    pationtName:
    {
        type:String,
        required:true
    },

    mobileNumber:
    {
        type:Number,
        required:true
    },

    age:
    {
        type:Number,
        required:true
    },

    day:
    {
        type:Date,
        required:true
    },

    start:
    {
        type:Date,
        required:true
    },

    end:
    {
        type:Date,
        required:true
    },

    status:
    {
        type:String,
        required:true,
        default:"pending",

        enum:[
            "pending",
            "approved",
            "rejected",
            "completed"
        ]
    }

},
{
    timestamps:true
});

const appointment =
mongoose.model(
    "appointment",
    appointmentSchema
);

module.exports = appointment;