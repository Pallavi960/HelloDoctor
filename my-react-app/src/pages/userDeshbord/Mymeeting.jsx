import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaVideo,
  FaClock,
  FaCalendarAlt,
  FaUserMd,
  FaPhoneAlt,
  FaBirthdayCake,
} from "react-icons/fa";

import { MdVerified } from "react-icons/md";

import logo from "../../assets/Hello_Doctor_logo.png";

const MyMeeting = () => {

  const navigate = useNavigate();

  const [approvedAppointments, setApprovedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // ================= LIVE CLOCK =================
  useEffect(() => {

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);

  }, []);

  // ================= CHECK CURRENT MEETING TIME =================
  function isMeetingTime(start, end) {

    const now = currentTime;

    return (
      now >= new Date(start) &&
      now <= new Date(end)
    );
  }

  // ================= FETCH USER APPOINTMENTS =================
  async function fetchApprovedAppointments() {

    try {

      setLoading(true);

      const res = await fetch(
        "http://localhost:8000/user/user-appointment",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (res.status === 401) {
        navigate("/user-login");
        return;
      }

      const data = await res.json();

      // ONLY APPROVED APPOINTMENTS
      const approved = (data.data || []).filter(
        (appoint) => appoint.status === "approved"
      );

      setApprovedAppointments(approved);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  }

  // ================= JOIN MEETING =================
  function joinMeeting(meetingLink) {

    // CHECK LINK EXISTS
    if (!meetingLink) {
      alert("Meeting link not available!");
      return;
    }

    // OPEN JITSI MEETING
    window.open(
      meetingLink,
      "_blank",
      "noopener,noreferrer"
    );
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
    fetchApprovedAppointments();
  }, []);

  return (

    <div className="bg-gray-100 min-h-screen">

      {/* ================= NAVBAR ================= */}
      <div className="flex flex-row items-center h-16 px-4 shadow-lg bg-sky-400 justify-evenly text-amber-50">

        <div className="flex items-center gap-3 m-2">

          <img
            src={logo}
            alt="Hello Doctor Logo"
            className="object-contain w-45 h-35 rounded-full"
          />

        </div>

        <div className="flex flex-row ml-auto space-x-4 font-bold">

          <Link
            to={"/userDeshbord"}
            className="p-2 transition-all duration-300 hover:bg-amber-50 hover:text-sky-500 hover:rounded-2xl"
            >
            Dashboard
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
            to={"/user-my-profile"}
            className="p-2 transition-all duration-300 hover:text-sky-500 hover:bg-amber-50 hover:rounded-2xl"
          >
            Profile
          </Link>

          <button
            onClick={handleLogout}
            className="p-2 px-4 transition-all duration-300 bg-red-500 rounded-2xl hover:bg-red-400"
          >
            Logout
          </button>

        </div>
      </div>

      {/* ================= PAGE HEADER ================= */}
     

      {/* ================= CONTENT ================= */}
      <div className="px-7 py-6">

        {/* ================= LOADING ================= */}
        {loading ? (

          <div className="flex items-center justify-center h-64">

            <div className="text-center">

              <div className="w-14 h-14 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

              <p className="text-gray-500 font-semibold">
                Loading your meetings...
              </p>

            </div>
          </div>

        ) : approvedAppointments.length === 0 ? (

          /* ================= EMPTY STATE ================= */
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center border-2 border-dashed border-sky-200 mt-4">

            <FaVideo className="text-sky-200 text-7xl mx-auto mb-5" />

            <h3 className="text-2xl font-bold text-gray-500">
              No Approved Meetings Yet
            </h3>

            <p className="text-gray-400 mt-3 text-base">
              Once your appointment is approved by the doctor,
              it will appear here.
            </p>

            <button
              onClick={() => navigate("/serch-doctor")}
              className="mt-7 bg-sky-500 hover:bg-sky-600 text-white font-bold px-8 py-3 rounded-2xl transition-all duration-300"
            >
              Find a Doctor
            </button>

          </div>

        ) : (

          /* ================= MEETING CARDS ================= */
          <div className="grid grid-cols-1 gap-5 mt-4">

            {approvedAppointments.map((appoint, index) => {

              const meetingActive = isMeetingTime(
                appoint.start,
                appoint.end
              );

              return (

                <div
                  key={index}
                  className={`bg-white rounded-2xl shadow-lg p-6 border-l-[6px] transition-all duration-300 hover:shadow-xl ${
                    meetingActive
                      ? "border-green-500"
                      : "border-sky-400"
                  }`}
                >

                  <div className="flex flex-row items-center justify-between flex-wrap gap-6">

                    {/* ================= LEFT ================= */}
                    <div className="flex flex-col gap-3">

                      {/* NAME */}
                      <div className="flex items-center gap-2 text-gray-800 font-bold text-xl">

                        <FaUserMd className="text-sky-500" />

                        {appoint.pationtName}

                        <span className="flex items-center gap-1 bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">

                          <MdVerified size={13} />

                          Approved

                        </span>
                      </div>

                      {/* DATE */}
                      <div className="flex items-center gap-2 text-gray-600 font-semibold">

                        <FaCalendarAlt className="text-sky-400" />

                        <span>
                          {new Date(appoint.day).toLocaleDateString(
                            "en-IN",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>

                      </div>

                      {/* TIME */}
                      <div className="flex items-center gap-2 text-gray-600 font-semibold">

                        <FaClock className="text-sky-400" />

                        <span>

                          {new Date(appoint.start).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}

                          {" → "}

                          {new Date(appoint.end).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}

                        </span>

                      </div>

                      {/* MOBILE */}
                      <div className="flex items-center gap-2 text-gray-600 font-semibold">

                        <FaPhoneAlt className="text-sky-400" />

                        <span>{appoint.mobileNumber}</span>

                      </div>

                      {/* AGE */}
                      <div className="flex items-center gap-2 text-gray-600 font-semibold">

                        <FaBirthdayCake className="text-sky-400" />

                        <span>Age: {appoint.age}</span>

                      </div>

                    </div>

                    {/* ================= RIGHT ================= */}
                    <div className="flex flex-col items-center gap-4 min-w-[180px]">

                      {/* STATUS */}
                      {meetingActive ? (

                        <span className="flex items-center gap-2 bg-green-100 text-green-600 text-sm font-bold px-4 py-1.5 rounded-full animate-pulse border border-green-200">

                          <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>

                          LIVE NOW

                        </span>

                      ) : (

                        <span className="flex items-center gap-2 bg-sky-100 text-sky-600 text-sm font-bold px-4 py-1.5 rounded-full border border-sky-200">

                          <FaClock size={12} />

                          Scheduled

                        </span>
                      )}

                      {/* JOIN BUTTON */}
                      <button
                        disabled={!meetingActive || !appoint.meetingLink}
                        onClick={() =>
                          joinMeeting(appoint.meetingLink)
                        }
                        className={`flex items-center gap-2 px-7 py-3 font-bold rounded-xl transition-all duration-300 text-base ${
                          meetingActive && appoint.meetingLink
                            ? "bg-green-500 hover:bg-green-600 text-white cursor-pointer shadow-lg hover:scale-105"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >

                        <FaVideo />

                        {meetingActive
                          ? "Join Meeting"
                          : "Not Yet"}

                      </button>

                      {/* HINT */}
                      {!meetingActive && (
                        <p className="text-xs text-gray-400 text-center font-medium">
                          Button activates at meeting time
                        </p>
                      )}

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyMeeting;