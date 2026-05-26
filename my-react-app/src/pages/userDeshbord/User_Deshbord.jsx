import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaVideo,
  FaClock,
  FaCalendarAlt,
  FaUserMd,
  FaUserCircle,
  FaStar,
} from "react-icons/fa";

import logo from "../../assets/Hello_Doctor_logo.png";

const User_Deshbord = () => {

  const navigate = useNavigate();

  const [allDoctors, setAlldoctors] = useState([]);
  const [approvedAppointments, setApprovedAppointments] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // ================= FEEDBACK STATES =================
  const [message, setMessage] = useState("");
  const [star, setStar] = useState(0);

  // ================= LIVE CLOCK =================
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // ================= CHECK IF MEETING TIME IS NOW =================
  function isMeetingTime(start, end) {
    const now = currentTime;
    return now >= new Date(start) && now <= new Date(end);
  }

  // ================= FETCH ALL DOCTORS =================
  async function collectData() {
    try {

      const data = await fetch(
        "http://localhost:8000/user/all-doctors",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (data.status === 401) {
        navigate("/user-login");
        return;
      }

      const result = await data.json();

      setAlldoctors(result.data || []);

    } catch (error) {

      console.log(error);

      alert("error occure");

    }
  }

  // ================= FETCH APPROVED APPOINTMENTS =================
  async function fetchApprovedAppointments() {

    try {

      const res = await fetch(
        "http://localhost:8000/appointment/user-appointments",
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.data) {

        const approved = data.data.filter(
          (a) => a.status === "approved"
        );

        setApprovedAppointments(approved);

      }

    } catch (error) {

      console.log(error);

    }
  }

  // ================= JOIN MEETING =================
  async function joinMeeting(appointmentId) {

    try {

      const res = await fetch(
        `http://localhost:8000/appointment/get/${appointmentId}`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.data?.meetingLink) {

        window.open(data.data.meetingLink, "_blank");

      } else {

        alert("Meeting link not available!");

      }

    } catch (error) {

      console.log(error);

      alert("Something went wrong!");

    }
  }

  // ================= ADD FEEDBACK =================
  async function handleFeedbackSubmit(e) {

    e.preventDefault();

    if (!message || !star) {

      alert("Please enter feedback and rating!");

      return;

    }

    try {

      const res = await fetch(
        "http://localhost:8000/user/add-feedback/692c1d22bad16b5a0d46d074",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            message,
            star,
          }),
        }
      );

      const data = await res.json();

      alert(data.message);

      setMessage("");
      setStar(0);

    } catch (error) {

      console.log(error);

      alert("Something went wrong!");

    }
  }

  // ================= LOGOUT =================
  async function handleLogout() {

    try {

      const res = await fetch(
        "http://localhost:8000/user/logout",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();

      alert(data.message);

      navigate("/user-login");

    } catch (error) {

      console.log(error);

      alert("Logout failed!");

    }
  }

  useEffect(() => {

    collectData();

    fetchApprovedAppointments();

  }, []);

  return (

    <div className="bg-gray-100">

      {/* ================= NAVBAR ================= */}
      <div className="flex flex-row items-center h-16 px-4 text-center shadow-lg bg-sky-400 justify-evenly text-amber-50">

        <div className="flex items-center gap-3 m-2">
          <img
            src={logo}
            alt="Hello Doctor Logo"
            className="object-contain w-45 h-35 rounded-full"
          />
        </div>

        <div className="flex flex-row items-center ml-auto space-x-4 font-bold">

          <Link
            to={"/serch-doctor"}
            className="p-2 transition-all duration-300 hover:bg-amber-50 hover:text-sky-500 hover:rounded-2xl"
          >
            Search Doctor
          </Link>

          <Link
            to={"/notification-user"}
            className="p-2 transition-all duration-300 hover:text-sky-500 hover:bg-amber-50 hover:rounded-2xl"
          >
            Notification
          </Link>

          <Link
            to={"/user-appointment"}
            className="p-2 transition-all duration-300 hover:text-sky-500 hover:bg-amber-50 hover:rounded-2xl"
          >
            My Appointments
          </Link>

          <Link
            to={"/user-meeting"}
            className="p-2 transition-all duration-300 hover:text-sky-500 hover:bg-amber-50 hover:rounded-2xl"
          >
            My Meetings
          </Link>

          <button
            onClick={handleLogout}
            className="p-2 px-4 transition-all duration-300 bg-red-500 rounded-2xl hover:bg-red-400"
          >
            Logout
          </button>

          <Link
            to={"/user-my-profile"}
            className="flex items-center gap-2 p-2 transition-all duration-300 hover:text-sky-500 hover:bg-amber-50 hover:rounded-2xl"
          >
            <FaUserCircle size={36} />
          </Link>

        </div>

      </div>

      {/* ================= HERO SECTION ================= */}
      <div className="flex flex-row flex-wrap items-center justify-center p-5">

        <div className="m-3">
          <img
            src="https://entranttechnologies.com/img/doctor_appointment_app_img.png"
            className="shadow-2xl h-[420px] w-[420px] rounded-3xl"
            alt=""
          />
        </div>

        <div className="flex flex-col items-center m-3 rounded-2xl">

          <div className="w-[750px] p-4 mt-5 text-center bg-blue-200 shadow-xl rounded-2xl">

            <h1 className="mb-2 text-3xl font-bold text-sky-700">
              Welcome To Our Healthcare Platform
            </h1>

            <p className="text-lg text-gray-700">
              Find trusted doctors, book appointments instantly and
              manage your healthcare services easily from one platform.
            </p>

          </div>

          <div className="w-[750px] p-5 m-4 mt-5 text-center bg-blue-200 shadow-xl rounded-2xl">

            <p className="text-lg leading-8 text-gray-700">
              Our healthcare management system helps patients connect
              with experienced doctors from different specializations.
              You can search doctors, view available timings, book
              appointments and manage everything from your dashboard.
              Fast, secure and easy appointment booking experience for
              all users.
            </p>

          </div>

          {/* ================= MY MEETINGS SECTION ================= */}
          <div className="w-[750px] mt-5">

            {approvedAppointments.length > 0 && (

              <div className="space-y-4">

                {approvedAppointments.map((appoint, index) => {

                  const meetingActive = isMeetingTime(
                    appoint.start,
                    appoint.end
                  );

                  return (

                    <div
                      key={index}
                      className={`bg-white rounded-2xl shadow-lg p-5 border-l-[6px] transition-all duration-300 hover:shadow-xl ${
                        meetingActive
                          ? "border-green-500"
                          : "border-sky-400"
                      }`}
                    >

                      <div className="flex flex-row items-center justify-between flex-wrap gap-4">

                        {/* LEFT INFO */}
                        <div className="space-y-2">

                          <div className="flex items-center gap-2 text-gray-800 font-bold text-lg">

                            <FaUserMd className="text-sky-500" />

                            {appoint.pationtName}

                          </div>

                          <div className="flex items-center gap-2 text-gray-600 font-semibold">

                            <FaCalendarAlt className="text-sky-400" />

                            {new Date(appoint.day).toLocaleDateString()}

                          </div>

                          <div className="flex items-center gap-2 text-gray-600 font-semibold">

                            <FaClock className="text-sky-400" />

                            {new Date(appoint.start).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}

                            {" - "}

                            {new Date(appoint.end).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}

                          </div>

                        </div>

                        {/* RIGHT */}
                        <div className="flex flex-col items-center gap-3">

                          {meetingActive && (

                            <span className="flex items-center gap-1 bg-green-100 text-green-600 text-xs font-bold px-3 py-1 rounded-full animate-pulse">

                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>

                              LIVE NOW

                            </span>

                          )}

                          <button
                            disabled={!meetingActive}
                            onClick={() => joinMeeting(appoint._id)}
                            className={`flex items-center gap-2 px-6 py-2 font-bold rounded-xl transition-all duration-300 ${
                              meetingActive
                                ? "bg-green-500 hover:bg-green-600 text-white cursor-pointer shadow-lg"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                          >

                            <FaVideo />

                            {meetingActive ? "Join Meeting" : "Not Yet"}

                          </button>

                        </div>

                      </div>

                    </div>

                  );
                })}

              </div>

            )}

          </div>

        </div>

      </div>

      {/* ================= TITLE ================= */}
      <div className="h-14 pt-1 overflow-hidden text-4xl font-bold text-center shadow-xl bg-sky-500 m-7 rounded-2xl text-amber-50">

        <h1>Our Doctors</h1>

      </div>

      {/* ================= DOCTOR CARDS ================= */}
      <div className="flex flex-col items-center justify-center">

        <div className="grid grid-cols-3 gap-14 p-5">

          {allDoctors.map((doctor, index) => (

            <div
              key={index}
              className="flex flex-col justify-center p-4 transition-all duration-300 bg-white shadow-2xl h-[470px] w-[300px] rounded-3xl hover:scale-105"
            >

              <div>

                <img
                  src={
                    doctor.image
                      ? `http://localhost:8000/${doctor.image.replace(/\\/g, "/")}`
                      : "https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg"
                  }
                  className="w-40 h-40 p-2 m-2 border-4 border-blue-200 rounded-full justify-self-center object-cover"
                  alt="doctor"
                />

              </div>

              <div>

                <div className="m-2 text-2xl font-bold text-center text-gray-800">

                  Dr. {doctor.name}

                </div>

                <div className="flex flex-col pl-5 m-3 space-y-2 text-md font-semibold text-gray-700">

                  <span>Specialization : {doctor.spelization}</span>

                  <span>Experience : {doctor.experience} Years</span>

                  <span>Fees : ₹ {doctor.fees}</span>

                  <span>Contact : {doctor.number}</span>

                </div>

                <div className="mt-5">

                  <Link
                    to={`/book/${doctor._id}`}
                    className="block py-3 text-lg font-bold text-center transition-all duration-300 bg-blue-500 rounded-2xl hover:bg-blue-600 hover:text-white text-amber-50"
                  >

                    BOOK APPOINTMENT

                  </Link>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* ================= FOOTER ================= */}
      <div className="mt-12 bg-sky-100 border-t-4 border-sky-400 shadow-inner">

        <div className="flex flex-row flex-wrap justify-between gap-10 px-14 py-12">

          {/* LEFT */}
          <div className="max-w-md">

            <div className="flex items-center gap-1">

              <img
                src={logo}
                alt="logo"
                className="w-50 h-50"
              />

            </div>

            <p className="mt-3 text-[16px] text-gray-700">

              Hello Doctor helps patients connect with experienced doctors,
              book appointments easily, and manage healthcare services
              securely from one platform.

            </p>

            <div className="w-24 h-1 mt-6 rounded-full bg-sky-500"></div>

          </div>

          {/* QUICK LINKS */}
          <div>

            <h1 className="mb-6 text-2xl font-bold text-sky-600">
              Quick Links
            </h1>

            <ul className="space-y-4 text-[17px] text-gray-700 font-semibold">

              <li>
                <Link
                  to={"/serch-doctor"}
                  className="transition-all duration-300 hover:text-sky-500"
                >
                  Search Doctor
                </Link>
              </li>

              <li>
                <Link
                  to={"/user-appointment"}
                  className="transition-all duration-300 hover:text-sky-500"
                >
                  My Appointment
                </Link>
              </li>

              <li>
                <Link
                  to={"/notification-user"}
                  className="transition-all duration-300 hover:text-sky-500"
                >
                  Notification
                </Link>
              </li>

              <li>
                <Link
                  to={"/user-register"}
                  className="transition-all duration-300 hover:text-sky-500"
                >
                  My Profile
                </Link>
              </li>

            </ul>

          </div>

          {/* FEEDBACK */}
          <div className="bg-white border border-sky-200 rounded-3xl shadow-lg p-6 w-[360px]">

            <form
              onSubmit={handleFeedbackSubmit}
              className="flex flex-col"
            >

              <h1 className="mb-5 text-3xl font-bold text-center text-sky-600">

                Feedback

              </h1>

              {/* STAR RATING */}
              <div className="flex justify-center gap-2 mb-5">

                {[1, 2, 3, 4, 5].map((item) => (

                  <button
                    type="button"
                    key={item}
                    onClick={() => setStar(item)}
                    className={`text-3xl transition-all duration-200 ${
                      item <= star
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >

                    <FaStar />

                  </button>

                ))}

              </div>

              {/* FEEDBACK MESSAGE */}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="p-3 text-gray-700 border border-sky-200 rounded-xl focus:outline-none focus:border-sky-500"
                placeholder="Write Feedback"
                rows={4}
              ></textarea>

              <button
                type="submit"
                className="h-12 mt-5 text-lg font-bold transition-all duration-300 rounded-xl bg-sky-500 hover:bg-sky-600 text-white"
              >

                Submit Feedback

              </button>

            </form>

          </div>

        </div>

        {/* BOTTOM */}
        <div className="py-5 text-center border-t border-sky-200 text-gray-600 font-medium">

          © 2026 Hello Doctor. All Rights Reserved.

        </div>

      </div>

    </div>

  );
};

export default User_Deshbord;