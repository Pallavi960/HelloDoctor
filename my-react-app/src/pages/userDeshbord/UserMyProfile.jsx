import { API_URL, apiFetch } from "../../config/api.js";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import logo from "../../assets/Hello_Doctor_logo.png";

const UserMyProfile = () => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  const [editData, setEditData] = useState({
    password: "",
    confirmPassword: "",
  });

  // ================= GET PROFILE =================

  async function collectData() {

    try {

      setLoading(true);

      const response = await apiFetch(
        API_URL + '/user/myprofile',
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!result.data) {

        setMessage(result.message);

        return;

      }

      setUser(result.data);

    }

    catch (error) {

      console.log(error);

      setMessage("Something went wrong!");

    }

    finally {

      setLoading(false);

    }

  }

  // ================= EDIT PROFILE =================

  function editProfile() {

    setIsEditing(true);

  }

  // ================= UPDATE PROFILE =================

  async function updateProfile() {

    // CHECK PASSWORD MATCH

    if (editData.password !== editData.confirmPassword) {

      alert("Passwords do not match");

      return;

    }

    try {

      const response = await apiFetch(
        API_URL + '/user/update-user-profile',
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            password: editData.password,
          }),
        }
      );

      const result = await response.json();

      alert(result.message);

      if (result.success) {

        setIsEditing(false);

        setEditData({
          password: "",
          confirmPassword: "",
        });

      }

    }

    catch (error) {

      console.log(error);

      alert("Something went wrong!");

    }

  }

  // ================= USE EFFECT =================

  useEffect(() => {

    collectData();

  }, []);

  return (

    <div className="min-h-screen bg-slate-100">

      {/* ================= NAVBAR ================= */}

      <div className="flex items-center h-16 px-4 shadow-lg bg-sky-400 text-white">

        {/* ================= LOGO ================= */}

        <div className="flex items-center">

          <img
            src={logo}
            alt="Hello Doctor Logo"
            className="object-contain w-45 h-35"
          />

        </div>

        {/* ================= NAV ITEMS ================= */}

        <div className="flex items-center ml-auto space-x-5 font-bold">

          <Link
            to={"/userDeshbord"}
            className="p-2 transition-all hover:bg-white hover:text-sky-500 rounded-2xl"
          >
            Dashboard
          </Link>

          <Link
            to={"/user-appointment"}
            className="p-2 transition-all hover:bg-white hover:text-sky-500 rounded-2xl"
          >
            Appointments
          </Link>

          <Link
            to={"/notification-user"}
            className="p-2 transition-all hover:bg-white hover:text-sky-500 rounded-2xl"
          >
            Notifications
          </Link>

          {/* ================= ACTIVE PROFILE ================= */}

          

        </div>

      </div>

      {/* ================= MAIN SECTION ================= */}

      <div className="flex justify-center px-5 py-10">

        {loading ? (

          <h1 className="text-3xl font-bold text-sky-500">
            Loading...
          </h1>

        ) : user ? (

          <div className="w-full max-w-4xl overflow-hidden bg-white shadow-2xl rounded-3xl">

            {/* ================= TOP SECTION ================= */}

            <div className="px-8 py-10 bg-gradient-to-r from-sky-500 to-cyan-400">

              <div className="flex flex-col items-center gap-5 md:flex-row">

                {/* PROFILE CIRCLE */}

                <div className="flex items-center justify-center w-28 h-28 text-5xl font-bold text-sky-500 bg-white rounded-full shadow-lg">

                  {user.name?.charAt(0)}

                </div>

                {/* USER INFO */}

                <div className="text-center md:text-left">

                  <h1 className="text-4xl font-bold text-white">

                    {user.name}

                  </h1>

                  <p className="mt-2 text-lg text-sky-100">

                    Welcome to your healthcare profile

                  </p>

                  <div className="inline-block px-4 py-2 mt-4 font-semibold text-sky-600 bg-white rounded-xl">

                    Active User

                  </div>

                </div>

              </div>

            </div>

            {/* ================= DETAILS ================= */}

            <div className="p-8">

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* EMAIL */}

                <div className="p-5 border rounded-2xl bg-slate-50">

                  <p className="text-sm font-bold text-gray-500">
                    Email Address
                  </p>

                  <h2 className="mt-2 text-lg font-bold text-gray-800 break-all">

                    {user.email}

                  </h2>

                </div>

                {/* PHONE */}

                <div className="p-5 border rounded-2xl bg-slate-50">

                  <p className="text-sm font-bold text-gray-500">
                    Phone Number
                  </p>

                  <h2 className="mt-2 text-lg font-bold text-gray-800">

                    {user.number || "Not Added"}

                  </h2>

                </div>

                {/* STATUS */}

                <div className="p-5 border rounded-2xl bg-slate-50 md:col-span-2">

                  <p className="text-sm font-bold text-gray-500">
                    Account Status
                  </p>

                  <h2 className="mt-2 text-lg font-bold text-green-500">

                    Active

                  </h2>

                </div>

              </div>

              {/* ================= EDIT BUTTON ================= */}

              {!isEditing && (

                <button
                  onClick={editProfile}
                  className="w-full h-14 mt-8 text-lg font-bold text-white transition-all shadow-md bg-sky-500 rounded-2xl hover:bg-sky-600"
                >
                  Change Password
                </button>

              )}

              {/* ================= EDIT FORM ================= */}

              {isEditing && (

                <div className="p-6 mt-8 border shadow-sm rounded-3xl bg-slate-50">

                  <h1 className="mb-6 text-2xl font-bold text-sky-500">
                    Update Password
                  </h1>

                  {/* NEW PASSWORD */}

                  <div className="mb-5">

                    <label className="font-bold text-gray-700">
                      New Password
                    </label>

                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={editData.password}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          password: e.target.value,
                        })
                      }
                      className="w-full p-4 mt-2 border-2 rounded-xl outline-none focus:border-sky-500"
                    />

                  </div>

                  {/* CONFIRM PASSWORD */}

                  <div>

                    <label className="font-bold text-gray-700">
                      Confirm Password
                    </label>

                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={editData.confirmPassword}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full p-4 mt-2 border-2 rounded-xl outline-none focus:border-sky-500"
                    />

                  </div>

                  {/* BUTTONS */}

                  <div className="flex flex-col gap-4 mt-8 md:flex-row">

                    <button
                      onClick={updateProfile}
                      className="w-full h-14 text-lg font-bold text-white transition-all bg-green-500 rounded-2xl hover:bg-green-600"
                    >
                      Save Password
                    </button>

                    <button
                      onClick={() => setIsEditing(false)}
                      className="w-full h-14 text-lg font-bold text-gray-700 transition-all bg-gray-200 rounded-2xl hover:bg-gray-300"
                    >
                      Cancel
                    </button>

                  </div>

                </div>

              )}

            </div>

          </div>

        ) : (

          <h1 className="text-3xl font-bold text-red-500">
            {message}
          </h1>

        )}

      </div>

    </div>

  );

};

export default UserMyProfile;