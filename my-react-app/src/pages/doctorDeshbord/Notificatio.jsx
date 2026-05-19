import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaBell,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";

// ================= IMPORT LOGO =================
import logo from "../../assets/Hello_Doctor_logo.png";

const Notification = () => {

  const navigate = useNavigate();

  const [notification, setNotification] = useState([]);
  const [message, setMessage] = useState("");
  const [selectAppoint, setSelectAppoint] = useState(null);

  // ================= LOGOUT =================

  async function handleLogout() {

    try {

      const res = await fetch(
        "http://localhost:8000/doctor/logout",
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

  // ================= ACCEPT =================

  async function handleAccept(id) {

    try {

      const res = await fetch(
        `http://localhost:8000/appointment/accept/${id}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      const data = await res.json();

      alert(data.message);

      collectData();

      setSelectAppoint(null);

    } catch (error) {

      console.log(error);

      alert("Something went wrong!");

    }

  }

  // ================= REJECT =================

  async function handleReject(id) {

    try {

      const res = await fetch(
        `http://localhost:8000/appointment/reject/${id}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      const data = await res.json();

      alert(data.message);

      collectData();

      setSelectAppoint(null);

    } catch (error) {

      console.log(error);

      alert("Something went wrong!");

    }

  }

  // ================= FETCH NOTIFICATIONS =================

  async function collectData() {

    try {

      const res = await fetch(
        "http://localhost:8000/doctor/notificationDoctor",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await res.json();

      console.log("notification result:", result);

      if (!result.data || result.data.length === 0) {

        setNotification([]);

        setMessage(result.message);

      } else {

        const appointmentWithDetails = await Promise.all(
          result.data.map(async (item) => {

            try {

              const appointId = item.appointmentId;

              const appointRes = await fetch(
                `http://localhost:8000/appointment/getAppointmentByid/${appointId}`,
                {
                  credentials: "include",
                }
              );

              const details = await appointRes.json();

              return {
                ...item,
                appointment: details.data,
              };

            } catch (error) {

              return {
                ...item,
                appointment: null,
              };

            }

          })
        );

        setNotification(appointmentWithDetails);

      }

    } catch (error) {

      console.log(error);

      setMessage("Something went wrong!");

    }

  }

  useEffect(() => {

    collectData();

  }, []);

  // ================= STATUS STYLE =================

  function statusStyle(status) {

    if (status === "approved") {
      return "bg-green-500";
    }

    if (status === "rejected") {
      return "bg-red-500";
    }

    if (status === "completed") {
      return "bg-blue-500";
    }

    return "bg-orange-500";

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

        <div className="flex items-center ml-auto space-x-5 font-bold ">

          <Link
            to={"/doctorDeshbord"}
            className="px-5 py-3 transition-all duration-300 hover:bg-white hover:text-sky-500 rounded-2xl"
          >
            Dashboard
          </Link>

          <Link
            to={"/Appontments"}
            className="flex items-center gap-2 px-5 py-3 transition-all duration-300 hover:bg-white hover:text-sky-500 rounded-2xl"
          >
           
            Appointments
          </Link>

         

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-3 transition-all duration-300 hover:bg-red-400 rounded-2xl bg-red-500"
          >
            Logout
          </button>

          <Link
            to={"/my-profile"}
            className="transition-all duration-300 hover:text-sky-200"
          >
            <FaUserCircle size={44} />
          </Link>

        </div>

      </div>

      {/* ================= MAIN ================= */}

      <div className="flex flex-col items-center p-6">

        <div className="w-full max-w-5xl">

          <div className="flex items-center gap-4 mb-8">

            <div className="flex items-center justify-center w-16 h-16 text-white shadow-lg rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600">

              <FaBell className="text-3xl" />

            </div>

            <div>

              <h1 className="text-4xl font-black text-slate-700">
                Doctor Notifications
              </h1>

              <p className="mt-1 text-slate-500">
                Manage your latest appointment updates
              </p>

            </div>

          </div>

          {/* ================= EMPTY ================= */}

          {notification.length === 0 ? (

            <div className="p-10 text-center bg-white shadow-2xl rounded-[30px]">

              <h1 className="text-3xl font-bold text-slate-700">
                No Notifications
              </h1>

              <p className="mt-3 text-lg text-slate-500">
                {message}
              </p>

            </div>

          ) : (

            <div className="space-y-6">

              {notification.map((t, index) => (

                <div
                  key={index}
                  className="flex flex-col justify-between gap-5 p-6 transition-all duration-300 bg-white shadow-xl md:flex-row md:items-center rounded-3xl hover:shadow-2xl"
                >

                  {/* ================= LEFT ================= */}

                  <div className="space-y-3">

                    <h2 className="text-2xl font-bold text-sky-600">

                      {t.title}

                    </h2>

                    <p className="text-lg font-medium text-slate-700">

                      {t.message}

                    </p>

                    {t.appointment && (

                      <div className="pt-2 space-y-2 text-slate-600">

                        <p>

                          <span className="font-bold">
                            Patient :
                          </span>{" "}

                          {t.appointment.pationtName}

                        </p>

                        <p>

                          <span className="font-bold">
                            Date :
                          </span>{" "}

                          {new Date(
                            t.appointment.day
                          ).toLocaleDateString()}

                        </p>

                        <p>

                          <span className="font-bold">
                            Time :
                          </span>{" "}

                          {new Date(
                            t.appointment.start
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}

                        </p>

                      </div>

                    )}

                  </div>

                  {/* ================= RIGHT ================= */}

                  <div className="flex flex-col items-start gap-4 md:items-end">

                    <div
                      className={`px-5 py-2 text-white rounded-2xl font-bold capitalize shadow-md ${statusStyle(
                        t?.appointment?.status
                      )}`}
                    >

                      {t?.appointment?.status || "pending"}

                    </div>

                    <button
                      onClick={() => setSelectAppoint(t)}
                      className="px-6 py-3 font-bold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl hover:scale-105"
                    >
                      See Details
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

      {/* ================= MODAL ================= */}

      {selectAppoint && (

        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40">

          <div className="relative w-full max-w-xl p-8 bg-white shadow-2xl rounded-[35px]">

            {/* CLOSE BUTTON */}

            <button
              onClick={() => setSelectAppoint(null)}
              className="absolute text-3xl font-bold text-red-500 top-4 right-5"
            >
              ×
            </button>

            {/* ================= TITLE ================= */}

            <h1 className="mb-8 text-4xl font-black text-center text-sky-600">

              Appointment Details

            </h1>

            {/* ================= DETAILS ================= */}

            {selectAppoint.appointment && (

              <div className="space-y-4 text-lg text-slate-700">

                <p>

                  <span className="font-bold">
                    Patient Name :
                  </span>{" "}

                  {selectAppoint.appointment.pationtName}

                </p>

                <p>

                  <span className="font-bold">
                    Age :
                  </span>{" "}

                  {selectAppoint.appointment.age}

                </p>

                <p>

                  <span className="font-bold">
                    Mobile :
                  </span>{" "}

                  {selectAppoint.appointment.mobileNumber}

                </p>

                <p>

                  <span className="font-bold">
                    Date :
                  </span>{" "}

                  {new Date(
                    selectAppoint.appointment.day
                  ).toLocaleDateString()}

                </p>

                <p>

                  <span className="font-bold">
                    Start :
                  </span>{" "}

                  {new Date(
                    selectAppoint.appointment.start
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}

                </p>

                <p>

                  <span className="font-bold">
                    End :
                  </span>{" "}

                  {new Date(
                    selectAppoint.appointment.end
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}

                </p>

                <p>

                  <span className="font-bold">
                    Status :
                  </span>{" "}

                  <span
                    className={`px-4 py-2 text-white rounded-2xl text-sm capitalize ${statusStyle(
                      selectAppoint.appointment.status
                    )}`}
                  >

                    {selectAppoint.appointment.status}

                  </span>

                </p>

              </div>

            )}

            {/* ================= ACTION BUTTONS ================= */}

            <div className="flex justify-between gap-4 mt-10">

              {selectAppoint?.appointment?.status === "pending" ? (

                <>

                  <button
                    onClick={() =>
                      handleAccept(
                        selectAppoint.appointment._id
                      )
                    }
                    className="w-full py-4 text-lg font-black text-white transition-all duration-300 bg-green-500 shadow-lg rounded-2xl hover:bg-green-600"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      handleReject(
                        selectAppoint.appointment._id
                      )
                    }
                    className="w-full py-4 text-lg font-black text-white transition-all duration-300 bg-red-500 shadow-lg rounded-2xl hover:bg-red-600"
                  >
                    Reject
                  </button>

                </>

              ) : (

                <div className="w-full">

                  <p
                    className={`w-full py-4 text-lg font-bold text-center text-white rounded-2xl capitalize ${statusStyle(
                      selectAppoint.appointment.status
                    )}`}
                  >

                    You already{" "}
                    {selectAppoint.appointment.status}{" "}
                    this appointment

                  </p>

                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );

};

export default Notification;