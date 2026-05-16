import React, { useState } from 'react'
import { Link } from 'react-router-dom';


function Login() {

  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
 
     function handleName(e)
     {
      setName(e.target.value);
     }
     function handleEmail(e)
     {
      setEmail(e.target.value);
     }
     function handlePassword(e)
     {
      setPassword(e.target.value);
     }

   function Collectdata(e) {
    e.preventDefault();
   const userData={name,email,password};
   fetch("http://localhost:8000/user/register",{
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify(userData),
   })
   .then(res=>res.json())
   .then(data => {
  console.log("Response from backend:", data);
  alert(data.message);   // show EXACT backend messagez
}
).catch((error)=>console.log(error));
   }

  return (
    <div className="flex items-center justify-center bg-blue-100 h-185 mask-auto">
      
        <form method="post" onSubmit={Collectdata}>
          <div className='flex flex-col items-center justify-center shadow-2xl w-90 h-90 border-zinc-950 rounded-4xl bg-amber-50'>
            <h1 className='text-3xl font-bold'>REGISTER</h1>
            <input type="text" className='p-3 m-2 text-center h-11 w-70 rounded-2xl bg-amber-200' placeholder="Name" value={name} onChange={handleName} />
            <input type="email" className='h-10 p-3 m-2 text-center w-70 rounded-xl bg-amber-200 '  placeholder="Email"  value={email} onChange={handleEmail}/>

            <input type="password" className='h-10 p-3 m-2 text-center rounded-xl w-70 bg-amber-200' placeholder="Password" value={password}  onChange={handlePassword}/>
            <button className="h-12 m-2 font-sans font-bold text-white bg-blue-500 text w-60 rounded-xl hover:bg-blue-700">Submit</button>
            <p className='font-normal'>Already have an Account? <Link to={"/user-login"} className='text-blue-600'>Login</Link></p>
            </div>
        </form>
      
      
    </div>
  )
}

export default Login
