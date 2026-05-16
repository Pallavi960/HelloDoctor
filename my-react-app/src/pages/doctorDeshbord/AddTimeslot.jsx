import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaClock, FaArrowLeft } from "react-icons/fa";

const AddTimeslot = () => {
  const [day, setDay] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  function addDay(e) {
    setDay(e.target.value);
  }

  function addStart(e) {
    setStart(e.target.value);
  }

  function addEnd(e) {
    setEnd(e.target.value);
  }

  async function HandleSubmit(e) {
    e.preventDefault();

    if (!day || !start || !end) {
      alert("All fields are required!");
      return;
    }

    try {
      const data = { day, start, end };

      const res = await fetch("http://localhost:8000/doctor/add-slot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const resData = await res.json();

      alert(resData.message);

      setDay("");
      setStart("");
      setEnd("");
    } catch (error) {
      alert("Something went wrong!");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-sky-100">
      {/* Navbar */}
      <div className="flex items-center h-14 px-6 text-white shadow-lg bg-gradient-to-r from-sky-500 to-blue-600">
        <div className="text-2xl font-bold tracking-wide">
          Hello Doctor
        </div>

        <div className="flex ml-auto space-x-4 text-sm font-medium">
          <Link
            to={"/doctorDeshbord"}
            className="px-4 py-2 transition-all duration-300 hover:bg-white hover:text-sky-600 rounded-xl"
          >
            Dashboard
          </Link>

          <Link
            to={"/"}
            className="px-4 py-2 transition-all duration-300 hover:bg-white hover:text-sky-600 rounded-xl"
          >
            Profile
          </Link>
        </div>
      </div>

      {/* Main */}
      <div className="flex items-center justify-center px-4 py-12">
        <form onSubmit={HandleSubmit} className="w-full max-w-3xl">
          {/* Increased Width Here */}
          <div className="w-full p-10 border shadow-2xl bg-white/80 backdrop-blur-lg rounded-[35px] border-white/30">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center w-14 h-14 text-white shadow-lg rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600">
                <FaClock className="text-2xl" />
              </div>

              <div>
                <h1 className="text-3xl font-black text-slate-700">
                  Add Time Slot
                </h1>

                <p className="text-sm text-slate-500">
                  Create your available schedule
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="mb-5">
              <label className="block mb-2 font-semibold text-slate-700">
                Select Date
              </label>

              <input
                type="date"
                value={day}
                onChange={addDay}
                className="w-full px-4 py-3 border bg-slate-50 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-200"
              />
            </div>

            {/* Start */}
            <div className="mb-5">
              <label className="block mb-2 font-semibold text-slate-700">
                Start Time
              </label>

              <input
                type="time"
                value={start}
                onChange={addStart}
                className="w-full px-4 py-3 border bg-slate-50 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-200"
              />
            </div>

            {/* End */}
            <div className="mb-8">
              <label className="block mb-2 font-semibold text-slate-700">
                End Time
              </label>

              <input
                type="time"
                value={end}
                onChange={addEnd}
                className="w-full px-4 py-3 border bg-slate-50 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-200"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <Link
                to={"/doctorDeshbord"}
                className="flex items-center justify-center w-1/3 gap-2 py-3 font-semibold border border-slate-300 rounded-2xl text-slate-600 hover:bg-slate-100"
              >
                <FaArrowLeft />
                Back
              </Link>

              <button
                type="submit"
                className="w-2/3 py-3 font-bold text-white shadow-lg rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:scale-105"
              >
                Add Slot
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTimeslot;