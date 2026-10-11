import { API_URL, apiFetch } from "../../config/api.js";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaClock,
  FaArrowLeft,
  FaUserCircle,
} from "react-icons/fa";

// ================= IMPORT LOGO =================
import logo from "../../assets/Hello_Doctor_logo.png";

const AddTimeslot = () => {

  const navigate = useNavigate();

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

  // ================= LOGOUT =================

  async function handleLogout() {

    try {

      const res = await apiFetch(
        API_URL + '/doctor/logout',
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();

      alert(data.message);

      navigate("/doctor-login");

    } catch (error) {

      console.log(error);

      alert("Logout failed");

    }
  }

  // ================= ADD SLOT =================

  async function HandleSubmit(e) {

    e.preventDefault();

    if (!day || !start || !end) {

      alert("All fields are required!");

      return;

    }

    try {

      const data = { day, start, end };

      const res = await apiFetch(
        API_URL + '/doctor/add-slot',
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(data),

          credentials: "include",
        }
      );

      const resData = await res.json();

      alert(resData.message);

      setDay("");
      setStart("");
      setEnd("");

      // ================= REDIRECT =================
      navigate("/doctorDeshbord");

    } catch (error) {

      console.log(error);

      alert("Something went wrong!");

    }
  }

  return (

    <div className="min-h-screen bg-slate-100">

      {/* ================= NAVBAR ================= */}

      <div className="flex items-center h-16 px-4 shadow-lg bg-sky-400 text-amber-50">

        {/* ================= LOGO ================= */}

        <div className="flex items-center">

          <img
            src={logo}
            alt="Hello Doctor Logo"
            className="object-contain w-45 h-35 rounded-full"
          />

        </div>

        {/* ================= NAV ITEMS ================= */}

        <div className="flex items-center ml-auto space-x-5 font-bold">

          <Link
            to={"/doctorDeshbord"}
            className="p-2 transition-all hover:bg-amber-50 hover:text-sky-500 rounded-2xl"
          >
            Dashboard
          </Link>

          <Link
            to={"/Appontments"}
            className="p-2 transition-all hover:bg-amber-50 hover:text-sky-500 rounded-2xl"
          >
            Appointments
          </Link>

          <Link
            to={"/notification"}
            className="p-2 transition-all hover:bg-amber-50 hover:text-sky-500 rounded-2xl"
          >
            Notifications
          </Link>

          <button
            onClick={handleLogout}
            className="px-4 py-2 transition-all bg-red-500 rounded-2xl hover:bg-red-600"
          >
            Logout
          </button>

          <Link
            to={"/my-profile"}
            className="p-1 transition-all hover:text-sky-500"
          >
            <FaUserCircle size={34} />
          </Link>

        </div>

      </div>

      {/* ================= MAIN ================= */}

      <div className="flex items-center justify-center px-4 py-10">

        <form
          onSubmit={HandleSubmit}
          className="w-full max-w-2xl"
        >

          <div className="w-full p-7 bg-white shadow-2xl rounded-[28px]">

            {/* ================= HEADER ================= */}

            <div className="flex items-center gap-3 mb-7">

              <div className="flex items-center justify-center w-12 h-12 text-white rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 shadow-lg">

                <FaClock className="text-2xl" />

              </div>

              <div>

                <h1 className="text-2xl font-black text-slate-700">
                  Add Time Slot
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Create your available appointment schedule
                </p>

              </div>

            </div>

            {/* ================= DATE ================= */}

            <div className="mb-5">

              <label className="block mb-2 text-base font-bold text-slate-700">
                Select Date
              </label>

              <input
                type="date"
                value={day}
                onChange={addDay}
                className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-4 focus:ring-sky-200"
              />

            </div>

            {/* ================= START TIME ================= */}

            <div className="mb-5">

              <label className="block mb-2 text-base font-bold text-slate-700">
                Start Time
              </label>

              <input
                type="time"
                value={start}
                onChange={addStart}
                className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-4 focus:ring-sky-200"
              />

            </div>

            {/* ================= END TIME ================= */}

            <div className="mb-7">

              <label className="block mb-2 text-base font-bold text-slate-700">
                End Time
              </label>

              <input
                type="time"
                value={end}
                onChange={addEnd}
                className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-4 focus:ring-sky-200"
              />

            </div>

            {/* ================= BUTTONS ================= */}

            <div className="flex gap-4">

              <Link
                to={"/doctorDeshbord"}
                className="flex items-center justify-center gap-2 w-1/3 py-3 font-bold border-2 border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 transition-all"
              >

                <FaArrowLeft />

                Back

              </Link>

              <button
                type="submit"
                className="w-2/3 py-3 text-base font-black text-white transition-all duration-300 shadow-xl rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:scale-[1.02]"
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