import { API_URL, apiFetch } from "../../config/api.js";
import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom';

function RegisterDoctor() {
    const [name, Setname] = useState("");
    const [email, Setemail] = useState("");
    const [degree, Setdegree] = useState("");
    const [spelization, Setspelization] = useState("");
    const [experience, Setexperience] = useState("");
    const [fees, Setfees] = useState("");
    const [password, setPassword] = useState("");
    const [number, setNumber] = useState("");
    const [image, setImage] = useState(null);   // added
    const [cv, setCv] = useState(null);          // added

    function handleName(e) { Setname(e.target.value); }
    function handleEmail(e) { Setemail(e.target.value); }
    function handleDegree(e) { Setdegree(e.target.value); }
    function handleSpelization(e) { Setspelization(e.target.value); }
    function handlExperience(e) { Setexperience(e.target.value); }
    function handlFees(e) { Setfees(e.target.value); }
    function handlNumber(e) { setNumber(e.target.value); }
    function handlePassword(e) { setPassword(e.target.value); }
    function handleImage(e) { setImage(e.target.files[0]); }   // added
    function handleCv(e) { setCv(e.target.files[0]); }          // added

    function collectData(e) {
        e.preventDefault();

        // changed to FormData instead of JSON
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("degree", degree);
        formData.append("spelization", spelization);
        formData.append("experience", experience);
        formData.append("fees", fees);
        formData.append("number", number);
        formData.append("password", password);
        formData.append("image", image);  // added
        formData.append("cv", cv);         // added

        apiFetch(API_URL + '/doctor/register', {
            method: "POST",
            // no Content-Type header — browser sets it automatically for FormData
            body: formData,
        })
            .then(res => res.json())
            .then(data => {
                console.log("Response from backend:", data);
                alert(data.message);
            })
            .catch((error) => console.log(error));

        Setname("");
        setNumber("");
        Setdegree("");
        Setexperience("");
        Setfees("");
        Setspelization("");
        Setemail("");
        setPassword("");
        setImage(null);  // added
        setCv(null);      // added
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 py-10">
            <div className="flex flex-col items-center justify-center shadow-2xl w-170 rounded-2xl bg-white border border-slate-100 px-10 py-10">

                <form onSubmit={collectData} className="flex flex-col items-center justify-center w-full">

                    <h1 className="text-2xl font-extrabold text-blue-900 mb-6 text-center">
                        Doctor Register
                    </h1>

                    {/* Row 1 — Name & Email */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="p-2 m-2 text-center h-11 w-70 rounded-xl bg-sky-50 border-2 border-transparent focus:border-sky-400 focus:outline-none text-slate-700 placeholder-slate-400"
                            value={name}
                            onChange={handleName}
                            placeholder="Name"
                        />
                        <input
                            type="text"
                            className="p-2 m-2 text-center h-11 w-70 rounded-xl bg-sky-50 border-2 border-transparent focus:border-sky-400 focus:outline-none text-slate-700 placeholder-slate-400"
                            value={email}
                            onChange={handleEmail}
                            placeholder="Email"
                        />
                    </div>

                    {/* Row 2 — Degree & Specialization */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="p-2 m-2 text-center h-11 w-70 rounded-xl bg-sky-50 border-2 border-transparent focus:border-sky-400 focus:outline-none text-slate-700 placeholder-slate-400"
                            value={degree}
                            onChange={handleDegree}
                            placeholder="Degree"
                        />
                        <input
                            type="text"
                            className="p-2 m-2 text-center h-11 w-70 rounded-xl bg-sky-50 border-2 border-transparent focus:border-sky-400 focus:outline-none text-slate-700 placeholder-slate-400"
                            value={spelization}
                            onChange={handleSpelization}
                            placeholder="Specialization"
                        />
                    </div>

                    {/* Row 3 — Experience & Fees */}
                    <div className="flex gap-2">
                        <input
                            type="number"
                            className="p-2 m-2 text-center h-11 w-70 rounded-xl bg-sky-50 border-2 border-transparent focus:border-sky-400 focus:outline-none text-slate-700 placeholder-slate-400"
                            value={experience}
                            onChange={handlExperience}
                            placeholder="Experience"
                        />
                        <input
                            type="number"
                            className="p-2 m-2 text-center h-11 w-70 rounded-xl bg-sky-50 border-2 border-transparent focus:border-sky-400 focus:outline-none text-slate-700 placeholder-slate-400"
                            value={fees}
                            onChange={handlFees}
                            placeholder="Fees"
                        />
                    </div>

                    {/* Row 4 — Contact & Password */}
                    <div className="flex gap-2">
                        <input
                            type="number"
                            className="p-2 m-2 text-center h-11 w-70 rounded-xl bg-sky-50 border-2 border-transparent focus:border-sky-400 focus:outline-none text-slate-700 placeholder-slate-400"
                            value={number}
                            onChange={handlNumber}
                            placeholder="Contact Number"
                        />
                        <input
                            type="password"
                            className="p-2 m-2 text-center h-11 w-70 rounded-xl bg-sky-50 border-2 border-transparent focus:border-sky-400 focus:outline-none text-slate-700 placeholder-slate-400"
                            value={password}
                            onChange={handlePassword}
                            placeholder="Password"
                        />
                    </div>

                    {/* Row 5 — Image & CV (added) */}
                    <div className="flex gap-2">
                        <div className="flex flex-col m-2 w-70">
                            <label className="text-slate-500 text-sm mb-1 text-center">Profile Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImage}
                                className="p-2 rounded-xl bg-sky-50 border-2 border-transparent focus:border-sky-400 focus:outline-none text-slate-700"
                            />
                        </div>
                        <div className="flex flex-col m-2 w-70">
                            <label className="text-slate-500 text-sm mb-1 text-center">Upload CV (PDF)</label>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleCv}
                                className="p-2 rounded-xl bg-sky-50 border-2 border-transparent focus:border-sky-400 focus:outline-none text-slate-700"
                            />
                        </div>
                    </div>

                    {/* Login Link */}
                    <p className="text-slate-500 text-sm mt-3">
                        Already registered?{" "}
                        <Link to="/doctor-login" className="text-sky-600 font-bold hover:underline">
                            Log in
                        </Link>
                    </p>

                    <br />

                    {/* Submit Button */}
                    <button className="h-12 m-2 font-extrabold text-white bg-gradient-to-r from-cyan-400 to-sky-500 text-lg w-70 rounded-xl hover:scale-105 transition-all shadow-md">
                        Submit
                    </button>

                </form>
            </div>
        </div>
    )
}

export default RegisterDoctor