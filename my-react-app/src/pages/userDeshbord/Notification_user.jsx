import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBell, FaUserCircle } from "react-icons/fa";
import logo from "../../assets/Hello_Doctor_logo.png";

const Notification_user = () => {

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

    }

    catch (error) {

      console.log(error);
      setMessage("Something went wrong!");

    }

    finally {

      setLoading(false);

    }

  }
async function handleLogout() {
    try {
      const res = await fetch(
        "http://localhost:8000/user/logout",
        { method: "GET", credentials: "include" }
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

  }, []);

  // ================= TITLE COLOR =================

  function titleColor(type) {

    if (type === "approved") {

      return "text-green-600";

    }

    if (type === "info") {

      return "text-blue-600";

    }

    if (type === "rejected") {

      return "text-red-600";

    }

    return "text-yellow-600";

  }

  // ================= CARD BORDER =================

  function borderColor(type) {

    if (type === "approved") {

      return "border-green-500";

    }

    if (type === "info") {

      return "border-blue-500";

    }

    if (type === "rejected") {

      return "border-red-500";

    }

    return "border-yellow-500";

  }

  return (

    <div className="min-h-screen bg-slate-100">

      {/* ================= NAVBAR ================= */}

      <div className="flex flex-row items-center h-16 px-4 text-center shadow-lg bg-sky-400 justify-between text-amber-50">

        {/* LOGO */}

        <div className="flex items-center gap-3 m-2">

          <img
            src={logo}
            alt="Hello Doctor Logo"
            className="object-contain w-45 h-35 rounded-full"
          />

        </div>

        {/* NAV LINKS */}

        <div className="flex flex-row items-center ml-auto space-x-4 font-bold">

          <Link
            to={"/userDeshbord"}
            className="p-2 transition-all duration-300 hover:bg-amber-50 hover:text-sky-500 hover:rounded-2xl"
          >
            Dashboard
          </Link>

          <Link to={"/serch-doctor"} className="p-2 transition-all duration-300 hover:bg-amber-50 hover:text-sky-500 hover:rounded-2xl">Search Doctor</Link>

           <button onClick={handleLogout} className="p-2 px-4 transition-all duration-300 bg-red-500 rounded-2xl hover:bg-red-400">Logout</button>
           <Link to={"/user-my-profile"}
             className="flex items-center gap-2 p-2 transition-all duration-300 hover:text-sky-500 hover:bg-amber-50 hover:rounded-2xl"
             >
              <FaUserCircle size={36} />
             
            </Link>

        </div>

      </div>

      {/* ================= MAIN ================= */}

      <div className="p-6">

        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between p-6 bg-white shadow-lg rounded-3xl">

          <div className="flex items-center gap-4">

            <div className="p-4 rounded-2xl bg-sky-100">

              <FaBell className="text-2xl text-sky-500" />

            </div>

            <div>

              <h1 className="text-3xl font-bold text-sky-500">
                Notifications
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage your appointment updates
              </p>

            </div>

          </div>

          <div className="px-5 py-2 font-bold rounded-2xl bg-sky-100 text-sky-600">

            Total : {notifications.length}

          </div>

        </div>

        {/* ================= NOTIFICATIONS ================= */}

        <div className="mt-6">

          {loading ? (

            <div className="p-10 text-center bg-white shadow-lg rounded-3xl">

              <p className="text-2xl font-bold text-gray-600">

                Loading...

              </p>

            </div>

          ) : notifications.length > 0 ? (

            <div className="space-y-5">

              {notifications.map((item, index) => (

                <div
                  key={index}
                  className={`bg-white rounded-3xl shadow-md p-5 border-l-[8px] ${borderColor(
                    item.type
                  )}`}
                >

                  <div className="flex items-start justify-between gap-4">

                    {/* LEFT SIDE */}

                    <div>

                      <h2
                        className={`text-2xl font-bold ${titleColor(
                          item.type
                        )}`}
                      >

                        {item.title}

                      </h2>

                      <p className="mt-3 leading-7 text-gray-600 text-[16px]">

                        {item.message}

                      </p>

                    </div>

                    {/* RIGHT SIDE */}

                    <div className="text-sm font-medium text-right text-gray-500 whitespace-nowrap">

                      <p>

                        {new Date(item.createdAt).toLocaleDateString()}

                      </p>

                      <p className="mt-1">

                        {new Date(item.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}

                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          ) : (

            <div className="py-24 text-center bg-white shadow-lg rounded-3xl">

              <h1 className="text-3xl font-extrabold text-gray-700">

                No Notifications Found

              </h1>

              <p className="mt-3 text-gray-400">

                {message}

              </p>

            </div>

          )}

        </div>

      </div>

    </div>

  );

};

export default Notification_user;