import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Role = () => {
  const [role, setRole] = useState("");
   let nevigate=useNavigate();
   
  const handleSubmit = (e) => {
    e.preventDefault();//avoid to relode the page
    
    if (!role) {
      alert("Please select a role!");
      return;
    }
    if(role=="Doctor")
    {
      nevigate("/userDeshbord");   
    }
    else{
      nevigate("/doctorDeshbord");
    }
    
  };

  return (
    <div className="flex items-center justify-center h-185 ">
      
    <div className="flex-col items-center justify-center ">
     <div className="flex-col items-center justify-center col-auto p-5 m-5 text-base text-center text-white rounded shadow-2xl w-80 gap-y-2 h-110 bg-amber-400 rounded-b-2xl rounded-t-2xl">
        <h1 className="font-serif text-2xl font-bold">SELECT YOUR ROLE</h1>
        <img src="https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg" className="m-3 rounded-1xl h-50 w-50 rounded-3xl justify-self-center-safe"    alt="logo" />
        <button className="h-10 m-1 text-base text-white bg-blue-500 w-50 rounded-2xl hover:bg-blue-700 hover:text-blue-50" onClick={() => setRole("Doctor")}>USER</button>
        <br />
        <button className="h-10 m-1 text-base text-white bg-green-500 w-50 rounded-2xl hover:bg-green-700 hover:text-amber-50" onClick={() => setRole("User")}>DOCTOR</button> 
         <br />
         <button className="w-20 h-12 m-1 font-sans font-bold text-center text-black cursor-pointer text-1xl hover:bg-gray-500 bg-amber-50 hover:text-amber-50 rounded-t-2xl rounded-b-2xl" onClick={handleSubmit}>
          continue
         </button>
     </div>
     </div>

    </div>
  );
};

export default Role;
