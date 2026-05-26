import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBell, FaUserCircle, FaVideo } from "react-icons/fa";

const UserNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= FETCH NOTIFICATIONS =================
  async function collectData() {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:8000/user/notificationUser",
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      console.log("notification data:", data);

      if (!data.data || data.data.length === 0) {
        setNotifications([]);
        setMessage(data.message || "No notifications found");
      } else {
        setNotifications(data.data);
      }
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  // ================= FETCH MEETING LINK =================
  async function getMeetingLink(appointmentId) {
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
        alert("Meeting link not available yet!");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    }
  }

  useEffect(() => {
    collectData();
  }, []);

  // ================= STATUS COLOR =================
  function getTypeStyle(type) {
    if (type === "approved") {
      return "bg-blue-100 text-blue-600";
    }
    if (type === "info") {
      return "bg-green-100 text-green-600";
    }
    if (type === "rejected") {
      return "bg-red-100 text-red-600";
    }
    return "bg-yellow-100 text-yellow-600";
  }

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ================= NAVBAR ================= */}
      <div className="flex items-center h-14 px-6 shadow-md bg-sky-400 text-white">

        <div className="text-2xl font-bold">
          User Notifications
        </div>

        <div className="flex ml-auto space-x-5 font-bold">
          <Link
            to={"/userDeshbord"}
            className="p-2 transition-all hover:bg-white hover:text-sky-500 rounded-xl"
          >
            Dashboard
          </Link>

          <Link
            to={"/my-profile"}
            className="p-1 transition-all hover:text-sky-200"
          >
            <FaUserCircle size={34} />
          </Link>
        </div>

      </div>

      {/* ================= MAIN ================= */}
      <div className="p-6">

        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow-lg p-6 flex justify-between items-center">

          <div className="flex items-center gap-4">

            <div className="bg-sky-100 p-4 rounded-2xl">
              <FaBell className="text-sky-500 text-2xl" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-sky-500">
                Notifications
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage your appointment updates
              </p>
            </div>

          </div>

          <div className="bg-sky-100 text-sky-600 px-5 py-2 rounded-2xl font-bold">
            Total : {notifications.length}
          </div>

        </div>

        {/* ================= NOTIFICATION LIST ================= */}
        <div className="mt-6">

          {loading ? (
            <div className="bg-white rounded-3xl shadow-lg p-10 text-center">
              <p className="text-2xl font-bold text-gray-600">
                Loading...
              </p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-5">

              {notifications.map((item, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-3xl shadow-md p-5 border-l-[8px] ${
                    item.type === "approved"
                      ? "border-blue-400"
                      : item.type === "rejected"
                      ? "border-red-400"
                      : item.type === "info"
                      ? "border-green-400"
                      : "border-sky-400"
                  }`}
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    {/* LEFT */}
                    <div className="flex-1">

                      <div className="flex items-center gap-3 flex-wrap">

                        <h2 className="text-xl font-bold text-gray-700">
                          {item.title}
                        </h2>

                        <span
                          className={`px-3 py-1 rounded-xl text-xs font-bold capitalize ${getTypeStyle(item.type)}`}
                        >
                          {item.type}
                        </span>

                      </div>

                      <p className="text-gray-600 mt-3 text-[16px]">
                        {item.message}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-5 text-sm text-gray-500">

                        <span>
                          Appointment ID :
                          <span className="font-semibold text-gray-700 ml-1">
                            {item.appointmentId}
                          </span>
                        </span>

                        <span>
                          Status :
                          <span
                            className={`ml-1 font-bold capitalize ${
                              item.isRead
                                ? "text-green-600"
                                : "text-orange-500"
                            }`}
                          >
                            {item.isRead ? "Read" : "Unread"}
                          </span>
                        </span>

                      </div>

                      {/* ✅ JOIN MEETING BUTTON — only for approved notifications */}
                      {item.type === "approved" && (
                        <button
                          onClick={() => getMeetingLink(item.appointmentId)}
                          className="mt-5 flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all"
                        >
                          <FaVideo />
                          Join Meeting
                        </button>
                      )}

                    </div>

                    {/* RIGHT */}
                    <div className="text-sm text-gray-500 font-medium text-right">
                      {new Date(item.createdAt).toLocaleDateString()}
                      <br />
                      {new Date(item.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>

                  </div>

                </div>
              ))}

            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-lg py-24 text-center">
              <h1 className="text-3xl font-extrabold text-gray-700">
                No Notifications Found
              </h1>
              <p className="text-gray-400 mt-3">
                {message}
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default UserNotification;