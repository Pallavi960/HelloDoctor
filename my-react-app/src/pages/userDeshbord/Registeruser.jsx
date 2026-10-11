import { API_URL, apiFetch } from "../../config/api.js";
import React, { useState } from 'react'
import { Link } from 'react-router-dom';

function Registeruser() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleName(e) {
    setName(e.target.value);
  }
  function handleEmail(e) {
    setEmail(e.target.value);
  }
  function handlePassword(e) {
    setPassword(e.target.value);
  }

  function Collectdata(e) {
    e.preventDefault();
    const userData = { name, email, password };
    apiFetch(API_URL + '/user/register', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then(res => res.json())
      .then(data => {
        console.log("Response from backend:", data);
        alert(data.message);
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <form method="post" onSubmit={Collectdata}>
        <div className="flex flex-col items-center justify-center shadow-2xl w-90 h-90 rounded-2xl bg-white border border-slate-100 px-8 py-10 gap-1">

          {/* Title */}
          <h1 className="text-2xl font-extrabold text-blue-900 mb-3">User Register</h1>

          {/* Name */}
          <input
            type="text"
            className="p-3 m-2 text-center h-11 w-70 rounded-xl bg-sky-50 border-2 border-transparent focus:border-sky-400 focus:outline-none text-slate-700 placeholder-slate-400"
            placeholder="Name"
            value={name}
            onChange={handleName}
          />

          {/* Email */}
          <input
            type="email"
            className="p-3 m-2 text-center h-11 w-70 rounded-xl bg-sky-50 border-2 border-transparent focus:border-sky-400 focus:outline-none text-slate-700 placeholder-slate-400"
            placeholder="Email"
            value={email}
            onChange={handleEmail}
          />

          {/* Password */}
          <input
            type="password"
            className="p-3 m-2 text-center h-11 w-70 rounded-xl bg-sky-50 border-2 border-transparent focus:border-sky-400 focus:outline-none text-slate-700 placeholder-slate-400"
            placeholder="Password"
            value={password}
            onChange={handlePassword}
          />

          {/* Submit Button */}
          <button className="h-12 m-2 font-extrabold text-white bg-gradient-to-r from-cyan-400 to-sky-500 w-60 rounded-xl hover:scale-105 transition-all shadow-md">
            Submit
          </button>

          {/* Login Link */}
          <p className="font-normal text-slate-500 text-sm mt-1">
            Already have an Account?{" "}
            <Link to="/user-login" className="text-sky-600 font-bold hover:underline">
              Login
            </Link>
          </p>

        </div>
      </form>

    </div>
  )
}

export default Registeruser