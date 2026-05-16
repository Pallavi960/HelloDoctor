import React from 'react'
import { useState} from 'react'
import { Link } from 'react-router-dom';
// import "./RegisterDoctor.css"
function RegisterDoctor() {
    const[name,Setname]=useState("");
    const[email,Setemail]=useState("");
    const[degree,Setdegree]=useState("");
    const[spelization,Setspelization]=useState("");
    const [experience,Setexperience]=useState("");
    const [fees,Setfees]=useState("");
    const [password,setPassword]=useState("");
    const[number,setNumber]=useState("");

    function handleName(e)
    {
        Setname(e.target.value);
    }
    function handleEmail(e)
    {
        Setemail(e.target.value);
    }
    function handleDegree(e)
    {
       Setdegree(e.target.value);
    }
    function handleSpelization(e)
    {
        Setspelization(e.target.value);
    }
    function handlExperience(e)
    {
        Setexperience(e.target.value);
    }
    function handlFees(e)
    {
       Setfees(e.target.value);
    }
     function handlNumber(e)
    {
       setNumber(e.target.value);
    }

    function handlePassword(e)
    {
        setPassword(e.target.value);
    }



    function collectData(e)
    {
         e.preventDefault();
         const userData={name,email,degree,spelization,experience,fees,number,password};
         console.log(userData);
         fetch("http://localhost:8000/doctor/register",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
            })
            .then(res=>res.json())
            .then(data => {
            console.log("Response from backend:", data);
            alert(data.message);   
            
            
           }
        )
        .catch((error)=>console.log(error));
            Setname("");
            setNumber("");
            Setdegree("");
            Setexperience("");
            Setfees("");
            Setspelization("");
            Setemail("");
            setPassword("");
   }
    



  return (
    <div className="flex items-center justify-center bg-blue-100 h-185 mask-auto">
      <div className='flex flex-col items-center justify-center shadow-2xl w-170 h-120 rounded-2xl bg-amber-50'>
      <form onSubmit={collectData} className='flex flex-col items-center justify-center'>
         
        <div>
        <h1 className='h-10 m-2 font-sans text-4xl font-bold text-center rounded-md'>Regristation form</h1>
        </div>
        <div>
        <input type="text"  className='p-2 m-2 text-center h-11 w-70 rounded-2xl bg-amber-200' value={name} onChange={handleName} placeholder='name'/>
        <input type="text"  className='p-2 m-2 text-center h-11 w-70 rounded-2xl bg-amber-200' value={email} onChange={handleEmail} placeholder='email'/>
        </div>
        
        <div>
        <input type="text"  className='p-2 m-2 text-center h-11 w-70 rounded-2xl bg-amber-200' value={degree} onChange={handleDegree} placeholder='degree'/>
        <input type="text"  className='p-2 m-2 text-center h-11 w-70 rounded-2xl bg-amber-200' value={spelization} onChange={handleSpelization}   placeholder='spelization'/>
        </div>
        
        <div>
        <input type="number"  className='p-2 m-2 text-center h-11 w-70 rounded-2xl bg-amber-200' value={experience}  onChange={handlExperience} placeholder='experience'/>
        <input type="number"  className='p-2 m-2 text-center h-11 w-70 rounded-2xl bg-amber-200' value={fees} onChange={handlFees} placeholder='fees'/>
        </div>
         
        <div>
        <input type="number" className='p-2 m-2 text-center h-11 w-70 rounded-2xl bg-amber-200' value={number} onChange={handlNumber} placeholder='contact number' />
        <input type="password"  className='p-2 m-2 text-center h-11 w-70 rounded-2xl bg-amber-200' value={password} onChange={handlePassword} placeholder='password'/>
        </div>
        
        <div className='text-1xl'>
          Already registered? <Link to={"/"} className='text-blue-700'>Log in</Link>
        </div>
        <br />
       
        <button className="h-12 m-2 font-sans text-lg font-bold text-white bg-blue-500 text-1xl text w-70 rounded-xl hover:bg-blue-700">submit</button>
         
        
      </form>
    </div>
    </div>
  )
}

export default RegisterDoctor
