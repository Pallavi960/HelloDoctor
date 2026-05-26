import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import logo from "../../assets/Hello_Doctor_logo.png";

const Myprofile = () => {

  const [doctor, setDoctor] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    password: "",
    fees: "",
    number: "",
  });

  async function collectData() {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/doctor/myprofile", {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();
      if (!result.data) {
        setMessage(result.message);
        return;
      }
      setDoctor(result.data);
      setEditData({
        password: "",
        fees: result.data.fees || "",
        number: result.data.number || "",
      });
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  function editProfile() { setIsEditing(true); }

  async function updateProfile() {
    try {
      const response = await fetch("http://localhost:8000/doctor/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editData),
      });
      const result = await response.json();
      alert(result.message);
      if (result.success) {
        setIsEditing(false);
        collectData();
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    }
  }

  useEffect(() => { collectData(); }, []);

  return (
    <div className="min-h-screen bg-slate-100">

      {/* NAVBAR */}
      <div className="flex items-center h-16 px-4 shadow-lg bg-sky-400 text-amber-50">
        <div className="flex items-center">
          <img src={logo} alt="Hello Doctor Logo" className="object-contain w-45 h-35 rounded-full" />
        </div>
        <div className="flex items-center ml-auto space-x-5 font-bold">
          <Link to={"/doctorDeshbord"} className="p-2 transition-all hover:bg-amber-50 hover:text-sky-500 rounded-2xl">Dashboard</Link>
          <Link to={"/Appontments"} className="p-2 transition-all hover:bg-amber-50 hover:text-sky-500 rounded-2xl">Appointments</Link>
          <Link to={"/add-slot"} className="p-2 transition-all hover:bg-amber-50 hover:text-sky-500 rounded-2xl">Add Time Slot</Link>
          <Link to={"/notification"} className="p-2 transition-all hover:bg-amber-50 hover:text-sky-500 rounded-2xl">Notifications</Link>
          <Link to={"/my-profile"} className="p-1 text-white transition-all hover:text-sky-500">
            <FaUserCircle size={36} />
          </Link>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex justify-center px-5 py-10">
        {loading ? (
          <h1 className="text-3xl font-bold text-sky-500">Loading...</h1>
        ) : doctor ? (
          <div className="w-full max-w-5xl overflow-hidden bg-white shadow-2xl rounded-3xl">

            {/* TOP SECTION */}
            <div className="px-10 py-8 bg-sky-500">
              <div className="flex flex-col items-center gap-5 md:flex-row">

                {/* ===== ONLY THIS PART CHANGED ===== */}
                              {doctor.image ? (
                <img
                  src={`http://localhost:8000/${doctor.image.replace(/\\/g, "/")}`}
                  alt="Doctor"
                  className="w-28 h-28 rounded-full object-cover shadow-lg border-4 border-white"
                />
              ) : (
                <div className="flex items-center justify-center w-28 h-28 text-5xl font-bold text-sky-500 bg-white rounded-full shadow-lg">
                  {doctor.name?.charAt(0)}
                </div>
              )}
                {/* ===== END OF CHANGE ===== */}

                <div className="text-center md:text-left">
                  <h1 className="text-4xl font-bold text-white">Dr. {doctor.name}</h1>
                  <p className="mt-2 text-lg text-sky-100">{doctor.spelization}</p>
                  <div className="inline-block px-4 py-2 mt-4 font-bold text-green-600 bg-white rounded-xl">
                    {doctor.verify}
                  </div>
                </div>
              </div>
            </div>

            {/* DETAILS */}
            <div className="p-8">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="p-5 border rounded-2xl bg-slate-50">
                  <p className="text-sm font-bold text-gray-500">Email</p>
                  <h2 className="mt-2 text-lg font-bold text-gray-800 break-all">{doctor.email}</h2>
                </div>
                <div className="p-5 border rounded-2xl bg-slate-50">
                  <p className="text-sm font-bold text-gray-500">Specialization</p>
                  <h2 className="mt-2 text-lg font-bold text-gray-800">{doctor.spelization}</h2>
                </div>
                <div className="p-5 border rounded-2xl bg-slate-50">
                  <p className="text-sm font-bold text-gray-500">Degree</p>
                  <h2 className="mt-2 text-lg font-bold text-gray-800">{doctor.degree}</h2>
                </div>
                <div className="p-5 border rounded-2xl bg-slate-50">
                  <p className="text-sm font-bold text-gray-500">Experience</p>
                  <h2 className="mt-2 text-lg font-bold text-gray-800">{doctor.experience} Years</h2>
                </div>
                <div className="p-5 border rounded-2xl bg-slate-50">
                  <p className="text-sm font-bold text-gray-500">Consultation Fees</p>
                  <h2 className="mt-2 text-lg font-bold text-gray-800">₹{doctor.fees}</h2>
                </div>
                <div className="p-5 border rounded-2xl bg-slate-50">
                  <p className="text-sm font-bold text-gray-500">Phone Number</p>
                  <h2 className="mt-2 text-lg font-bold text-gray-800">{doctor.number}</h2>
                </div>
              </div>

              {!isEditing && (
                <button onClick={editProfile} className="w-full h-14 mt-8 text-lg font-bold text-white transition-all shadow-md bg-sky-500 rounded-2xl hover:bg-sky-600">
                  Edit Profile
                </button>
              )}

              {isEditing && (
                <div className="p-6 mt-8 border shadow-sm rounded-3xl bg-slate-50">
                  <h1 className="mb-6 text-2xl font-bold text-sky-500">Update Profile</h1>
                  <div className="mb-5">
                    <label className="font-bold text-gray-700">New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={editData.password}
                      onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                      className="w-full p-4 mt-2 border-2 rounded-xl outline-none focus:border-sky-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className="font-bold text-gray-700">Consultation Fees</label>
                      <input
                        type="number"
                        placeholder="Enter fees"
                        value={editData.fees}
                        onChange={(e) => setEditData({ ...editData, fees: e.target.value })}
                        className="w-full p-4 mt-2 border-2 rounded-xl outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700">Phone Number</label>
                      <input
                        type="number"
                        placeholder="Enter phone number"
                        value={editData.number}
                        onChange={(e) => setEditData({ ...editData, number: e.target.value })}
                        className="w-full p-4 mt-2 border-2 rounded-xl outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 mt-8 md:flex-row">
                    <button onClick={updateProfile} className="w-full h-14 text-lg font-bold text-white transition-all bg-green-500 rounded-2xl hover:bg-green-600">
                      Save Changes
                    </button>
                    <button onClick={() => setIsEditing(false)} className="w-full h-14 text-lg font-bold text-gray-700 transition-all bg-gray-200 rounded-2xl hover:bg-gray-300">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <h1 className="text-3xl font-bold text-red-500">{message}</h1>
        )}
      </div>
    </div>
  );
};

export default Myprofile;