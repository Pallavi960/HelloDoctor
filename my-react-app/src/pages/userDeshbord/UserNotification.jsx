import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { Link } from 'react-router-dom'
const UserNotification = () => {
    const [notificationData,setNotificationData]=useState([]);
    const [doctorId,setDoctorId]=useState("");
   
    const [msg,setMsg]=useState("");
   
  
    
    async function collectData() {
       
       const id="69270bbb4c5c98421a6bc41b";
        const res=await fetch(`http://localhost:8000/notification/serchForUser/${id}`);
        // console.log("res",res);
        const Ndata=await res.json();
        setNotificationData(Ndata.data);
        setDoctorId(Ndata.data.doctorId);
        setMsg(Ndata.message);
        console.log(msg);  
    }

async function serchDoctorName() {
  try{
  const res=await fetch(`http://localhost:8000/doctor/getDoctorByid/${doctorId}`);
  const getdata=res.json();
  const name=getdata.data.name;
  setDoctorName(name);
  }
   catch(error)
   {
    alert("doctor name not found!");
   }
}


 
  
 useEffect(() => {
     
     collectData();
   }, []);
  return (
    <div>
    <div className='flex flex-row items-center h-10 text-center bg-sky-500 justify-evenly text-amber-50'>
       
       <div className='m-2 text-2xl font-bold'>
           Hello Doctor
        </div>
        <div className='flex flex-row ml-auto space-x-6 font-bold '>
                <Link to={"/userDeshbord"} className='p-2 m-1 mask-3 hover:bg-amber-50 hover:text-indigo-600 hover:rounded-1xl '>Home</Link>
                <Link to={"/"} className='p-2 m-1 mask-3 hover:bg-amber-50 hover:text-indigo-600 hover:rounded-1xl '>Profile</Link>
        </div>    
        <br />
        
      </div>
        <div className='flex justify-center mt-7'>
        <table border={1} className='border-2 w-250 border-b-neutral-500 '>
        <thead className=' bg-sky-500 border-amber-50 text-amber-50 rounded-2xl'>
            <tr className='p-3 m-4'>
                    <th className="px-4 py-3">Doctor NAME</th>
                    <th className="px-4 py-3">Pationt name</th>
                    <th className="px-4 py-3">info </th>
                    <th className="px-4 py-3">status</th>
           
                    <th className="px-4 py-3">Edit appointment</th>
            </tr>
        </thead>
        <tbody >
      {/* BEFORE SEARCH */}
     

           {notificationData.length>0? (notificationData.map((d,index)=>(
            <tr key={index} className='h-10 my-3 border boborder-b-stone-600 text-neutral-700 rounded-2xl placeholder="serach"'>
                <td className='text-center'>{d.pationtName}</td>
                <td className='text-center'>{d.age}</td>
               
                <td className='text-center'>{d.info}</td>
                <td className='text-center'><button className='m-0 font-medium text-gray-400'>waiting for doctor approval</button></td>
                <td className='text-center'><Link className='text-blue-700 underline'>edit</Link></td>
            </tr>
            
           ))):(
           <tr  className='text-center'>''
            <td colSpan={5}  className='text-2xl text-gray-700'>notthing for you </td>
           </tr>
           )}
        </tbody>
        </table>
        </div>
    </div>
  )
}

export default UserNotification
