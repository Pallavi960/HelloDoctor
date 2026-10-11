import { API_URL, apiFetch } from "../../config/api.js";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Stethoscope,
  MessageSquareMore,
  Users,
  LogOut,
  Menu,
  CalendarDays,
  BarChart3,
} from "lucide-react";

const AdminSidebar = ({ active }) => {
  const [openSidebar, setOpenSidebar] = useState(true);

  const navigate = useNavigate();

  async function handleLogout() {
    try {
      const res = await apiFetch(
        API_URL + '/admin/logout',
        {
          method: "GET",
          credentials: "include",
        }
      );

      const info = await res.json();

      alert(info.message);

      navigate("/");
    } catch (error) {
      console.log(error);

      alert("Logout failed");
    }
  }

  return (
    <div
      className={`bg-sky-500 text-white h-screen flex flex-col justify-between shadow-2xl transition-all duration-300
      ${openSidebar ? "w-72" : "w-24"}`}
    >
      {/* Top Section */}

      <div>
        {/* Logo */}

        <div className="flex items-center justify-between p-5 border-b border-sky-400">

          {openSidebar && (
            <div>
              <h1 className="text-2xl font-bold">
                Hello Doctor
              </h1>

              <p className="text-xs text-sky-100 mt-1">
                Admin Panel
              </p>
            </div>
          )}

          <button
            className="bg-sky-600 hover:bg-white hover:text-sky-600 p-2 rounded-xl transition-all duration-300"
            onClick={() =>
              setOpenSidebar(!openSidebar)
            }
          >
            <Menu size={20} />
          </button>

        </div>

        {/* Menu */}

        <div className="flex flex-col mt-6 px-3 space-y-3">

          {/* Dashboard */}

          <Link
            to={"/admin-dashboard"}
            className={`flex items-center gap-4 p-3 rounded-2xl font-semibold transition-all duration-300
            ${
              active === "dashboard"
                ? "bg-sky-600 shadow-lg"
                : "hover:bg-white hover:text-sky-600"
            }`}
          >
            <LayoutDashboard size={20} />

            {openSidebar && "Dashboard"}
          </Link>

          {/* Doctors */}

          <Link
            to={"/allDoctors"}
            className={`flex items-center gap-4 p-3 rounded-2xl font-semibold transition-all duration-300
            ${
              active === "doctors"
                ? "bg-sky-600 shadow-lg"
                : "hover:bg-white hover:text-sky-600"
            }`}
          >
            <Stethoscope size={20} />

            {openSidebar && "Doctors"}
          </Link>

          {/* Users */}

          <Link
            to={"/allusers"}
            className={`flex items-center gap-4 p-3 rounded-2xl font-semibold transition-all duration-300
            ${
              active === "users"
                ? "bg-sky-600 shadow-lg"
                : "hover:bg-white hover:text-sky-600"
            }`}
          >
            <Users size={20} />

            {openSidebar && "Users"}
          </Link>

          {/* Appointments */}

          <Link
            to={"/allAppointments"}
            className={`flex items-center gap-4 p-3 rounded-2xl font-semibold transition-all duration-300
            ${
              active === "appointments"
                ? "bg-sky-600 shadow-lg"
                : "hover:bg-white hover:text-sky-600"
            }`}
          >
            <CalendarDays size={20} />

            {openSidebar && "Appointments"}
          </Link>

          {/* Performance Report */}

          <Link
            to={"/get-report"}
            className={`flex items-center gap-4 p-3 rounded-2xl font-semibold transition-all duration-300
            ${
              active === "reports"
                ? "bg-sky-600 shadow-lg"
                : "hover:bg-white hover:text-sky-600"
            }`}
          >
            <BarChart3 size={20} />

            {openSidebar && "Performance Report"}
          </Link>

          {/* Feedback */}

          <Link
            to={"/get-feedback"}
            className={`flex items-center gap-4 p-3 rounded-2xl font-semibold transition-all duration-300
            ${
              active === "feedback"
                ? "bg-sky-600 shadow-lg"
                : "hover:bg-white hover:text-sky-600"
            }`}
          >
            <MessageSquareMore size={20} />

            {openSidebar && "Feedback"}
          </Link>

        </div>
      </div>

      {/* Logout */}

      <div className="p-4 border-t border-sky-400">

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white font-semibold p-3 rounded-2xl transition-all duration-300"
        >
          <LogOut size={20} />

          {openSidebar && "Logout"}

        </button>

      </div>

    </div>
  );
};

export default AdminSidebar;