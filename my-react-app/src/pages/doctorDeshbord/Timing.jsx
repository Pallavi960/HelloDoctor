import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom';


 const SerchDoctor = () => {
    const[id,setid]=useState("");
    const[slot,setSlot]=useState("");
    const[message,setMessage]=useState("");
    function setId(e)
    {
        setid(e.target.value);
    }

 async function handleSlot(e) {
    e.preventDefault();
    const data=await fetch(`http://localhost:8000/doctor/my-timing/${id}`);
    const res=data.json();
    if(res.getSlot.length===0)
    {
        setMessage(res.message);
        alert(message);
    }
    else{
        setSlot(res.getSlot);
        setMessage(res.message);    
    }
    
 }
  


  return (
      
    <div>
        <div className='flex flex-row items-center h-10 text-center bg-sky-500 justify-evenly text-amber-50'>
        <div className='m-2 text-2xl font-bold'>
           Hello Doctor
        </div>
        <div className='flex flex-row ml-auto space-x-6 font-bold '>
                <Link to={"/serch-doctor"} className='p-2 m-1 mask-3 hover:bg-amber-50 hover:text-blue-500 hover:rounded-1xl '>Back</Link>
                <Link to={"/book-Appointment "} className='p-2 m-1 mask-3 hover:text-blue-500 hover:rounded-1xl hover:bg-amber-50'>Book Appointment</Link>
                <Link to={"/my-Appointments" } className='p-2 m-1 mask-3 hover:text-blue-500 hover:rounded-1xl hover:bg-amber-50'>My Appointments</Link>
                <Link to={"/user-login"} className='p-2 m-1 mask-3 hover:text-blue-500 hover:rounded-1xl hover:bg-amber-50'>Login</Link>
                <Link to={"/user-register"} className='p-2 m-1 mask-3 pe-5 hover:text-blue-500 hover:rounded-1xl hover:bg-amber-50'>Profile</Link>
        </div>
        <br />
        
      </div>

      
     <div>
    <div>
      
      <form  onSubmit={handleSlot} id='searchbar'  className='flex items-center justify-center mt-5'>
            <input type="text"  value={id} onChange={setId}   placeholder='spelization' className='pl-3 m-2 border-2 border-gray-800 h-9 rounded-2x1 w-80'/>
            <button className='w-20 bg-sky-600 rounded-2xl h-9 text-amber-50'>search</button>
      </form>
      <div className='flex justify-center mt-7'>
        <table border={1} className='border-2 w-250 border-b-neutral-500 '>
        <thead className=' bg-sky-500 border-amber-50 text-amber-50 rounded-2xl'>
            <tr className='p-3 m-4'>
                    <th className="px-4 py-3">  DAY</th>
                    <th className="px-4 py-3">START</th>
                    <th className="px-4 py-3">END</th>
                   
                    <th className="px-4 py-3">ACTION</th>
            </tr>
        </thead>
        <tbody >
           {slot.length>0? (slot.map((d,index)=>(
            <tr key={index} className='h-10 my-3 border boborder-b-stone-600 text-neutral-700 rounded-2xl placeholder="serach"'>
                <td className='text-center'>{d.day}</td>
                <td className='text-center'>{d.start}</td>
                <td className='text-center'>{d.end}</td>
                
                <td className='text-center '><button className='m-0 font-medium bg-green-600 rounded-1xl w-25 text-amber-50 hover:bg-green-500'>edit</button></td>
            </tr>
            
           ))):(
           <tr >
            <td colSpan={5}  className='text-2xl text-center text-red-500'>{message} </td>
           </tr>
           )}
        </tbody>
        </table>
        </div>
    </div>
        </div>
    </div>
  )
} 

export default SerchDoctor
