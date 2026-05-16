import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react';



const Notification_user = () => {
  
const[notification,setNotification]=useState([]);
const[message,setMessage]=useState("");
const[selectAppoint,setSelectAppoint]=useState(null);




async function handleAccepct(id) {
  try{
    const res=await fetch(`http://localhost:8000/appointment/accept/${id}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    notification.isRead=true;
    const ress=await res.json();
    alert(ress.message);
    console.log(ress);
    console.log(selectAppoint);
  }
  catch(error)
  {
    alert("something wents wrong!",error);
    return;
  }
}


async function handleReject(id) {
  try{
    const res=await fetch(`http://localhost:8000/appointment/reject/${id}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const ress=await res.json();
    alert(ress.message);
    console.log(ress);

  }
  catch(error)
  {
    alert("something wents wrong!",error);
    return;
  }
}


async  function collectData()
{
  try{
     const res = await fetch("http://localhost:8000/notification/doctorNotification", {
            method: "GET",
            credentials: "include"  
        });
        const result=await res.json();
        if(result.data.length===0 || !result.data)
        {
          setNotification([]);
          setMessage(result.message);
        
        }
        else{
          setMessage(result.message);
          console.log(result.data);

    const appointmentWithdetails=await Promise.all(
        result.data.map(async(item)=>
        {
            try{    
            const appointId=item.appointmentId;
            const appointRes=await fetch(`http://localhost:8000/appointment/getAppointmentByid/${appointId}`,
              {credentials:"include"}
            );
            const details=await appointRes.json();

            return {
                ...item,
                appointment: details.data

            }
             }
             catch(error)
             {
                return{
                    ...item,
                     appointment:null
                }
                
             }  
        })
    ) 
    
    console.log("appointment with the details",appointmentWithdetails);
    setNotification(appointmentWithdetails);

    }
    }
    catch(error)
    {
        console.log("something wents wrong!",error);
    } 
}
  useEffect(()=>
  {
    collectData();
  },[]);
  
  return (
       <div>
         <div className='flex flex-row items-center h-12 text-center bg-sky-500 justify-evenly text-amber-50'>
         
           <div className='m-2 text-2xl font-bold'>
              Hello Doctor
           </div>
           <div className='flex flex-row ml-auto space-x-6 font-bold '>
               
                  <Link to={"/userDeshbord"} className='p-2 m-1 mask-3 hover:bg-amber-50 hover:text-sky-500 hover:rounded-1xl hover:rounded-2xl '>Home</Link>
                  <Link to={"/notification-user"} className='p-2 m-1 mask-3 hover:text-sky-500 hover:rounded-1xl hover:bg-amber-50 hover:rounded-2xl '>Profile</Link>

           </div>
           <br/>
         </div>
         <div className='flex flex-col justify-center items-center'>
              <div className='w-5xl mt-5'>
               {
               notification.map((t, index) => (
              <div
                  key={index}
                  className="w-full max-w-4xl bg-white rounded-2xl shadow-md hover:shadow-lg transition p-5 mb-4 flex justify-between items-center">

                  <div className="space-y-2">
                  <p className="font-semibold text-lg text-emerald-600">
                        {t.message}</p>
                  <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    <span className="font-medium text-gray-600">Patient Name:</span>{" "}
                      {t.appointment.pationtName}
                  </p>
                  <p>
                  <span className="font-medium text-gray-600">Start:</span>{" "}
                    {t.appointment.start}
                  </p>
                  <p>
                  <span className="font-medium text-gray-600">End:</span>{" "}
                  {t.appointment.end}
                  </p>
                </div>
              </div>
             
              {
                selectAppoint &&(
                  <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
                    <div className='bg-white rounded-2xl p-6 max-w-md w-full shadow-lg relative'>
                    <div className='flex flex-col space-y-2 text-gray-700 text-sm'>
                       <h2 className="text-2xl font-semibold mb-4 text-sky-600">Appointment Details</h2>
                      <button  className="absolute top-3 right-3 text-red-500 font-bold text-lg" onClick={() =>  setSelectAppoint(null)}>x</button>
                      <p> <span className="font-medium text-gray-600">Pationt Name:</span>{" "}{selectAppoint.appointment.pationtName}</p>
                      <p> <span className="font-medium text-gray-600">Pationt Age:</span>{" "}{selectAppoint.appointment.age}</p>
                      <p> <span className="font-medium text-gray-600">Mobile Number:</span>{" "}{selectAppoint.appointment.mobileNumber}</p>
                      <p> <span className="font-medium text-gray-600">day</span>{" "}{selectAppoint.appointment.day}</p>
                      <p> <span className="font-medium text-gray-600">Start Time:</span>{" "}{selectAppoint.appointment.start}</p>
                      <p> <span className="font-medium text-gray-600">End Time:</span>{" "}{selectAppoint.appointment.end}</p>

                      <div >  
                        {
                         selectAppoint?.appointment?.status !== "pending"?(
                          <p className='text-white m-2  h-8 text-center p-1 rounded font-bold bg-amber-500 font-sans'>you {selectAppoint.appointment.status} this appointment</p>
                        ):
                        (
                         <div className='flex flex-row justify-evenly m-2'>
                          <p>status is:{ t.isRead}</p>
                          <br />
                          <button className='bg-emerald-600 h-8 w-30 text-white rounded cursor-pointer' onClick={()=>handleAccepct(selectAppoint.appointment._id)}>Accept</button>
                          <button className='bg-red-400 w-30 text-white rounded cursor-pointer'  onClick={()=>handleReject(selectAppoint.appointment._id)}>Reject</button>
                        </div>
                        )

                       } 
                      </div>
                    
                    </div>

                    </div>
                  </div>
                )
              }
             
              <div className="flex items-end h-full">
              <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-500 rounded-lg hover:bg-blue-50 transition" onClick={() => setSelectAppoint(t)}>
                See Details
            </button>
          </div>
        </div>       
          ))                         
              }
              </div>
              
         </div>
         
       </div>
  )
}

export default Notification_user
