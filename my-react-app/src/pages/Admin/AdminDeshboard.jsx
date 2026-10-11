import { API_URL, apiFetch } from "../../config/api.js";
import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";

const AdminDeshboard = () => {

  const [request, setRequest] = useState([]);
  const [message, setMessage] = useState("");
  const [doctorData, setDoctordata] = useState(null);
  const [countDoctors, setDoctorcount] = useState(0);
  const [countUsers, setcountUsers] = useState(0);

  async function handleAccept(id) {
    try {
      const res = await apiFetch(`${API_URL}/admin/approveRequest/${id}`, { credentials: "include" });
      const info = await res.json();
      alert(info.message);
      setDoctordata(null);
      handleRequest();
      handlecountDoctors();
    } catch (error) {
      alert("error approving doctor");
    }
  }

  async function handlecountDoctors() {
    try {
      const res = await apiFetch(`${API_URL}/doctor/count-doctors`);
      const info = await res.json();
      setDoctorcount(info.count);
    } catch (error) {
      console.log(error);
    }
  }

  async function handlecountUsers() {
    try {
      const res = await apiFetch(`${API_URL}/user/user-count`);
      const info = await res.json();
      setcountUsers(info.count);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleReject(id, reason) {
    try {
      const res = await apiFetch(`${API_URL}/admin/rejectRequest/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
        credentials: "include",
      });
      const info = await res.json();
      alert(info.message);
      setDoctordata(null);
      handleRequest();
    } catch (error) {
      alert("error rejecting doctor");
    }
  }

  async function handleRequest() {
    try {
      const res = await apiFetch(`${API_URL}/admin/getPendinglist`, { credentials: "include" });
      const info = await res.json();
      setRequest(info.data || []);
      setMessage(info.message);
    } catch (error) {
      console.log(error);
    }
  }

  function openCV(cvPath) {
    const url = API_URL + '/' + cvPath.replace(/\\/g, "/");
    window.open(url, "_blank");
  }

  function getImageUrl(imagePath) {
    return API_URL + '/' + imagePath.replace(/\\/g, "/");
  }

  useEffect(() => {
    handleRequest();
    handlecountDoctors();
    handlecountUsers();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      <AdminSidebar active="dashboard" />

      <div className="flex-1 overflow-y-auto p-5">

        {/* NAVBAR */}
        <div className="bg-white rounded-3xl p-5 shadow-md flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-sky-500">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Manage doctors and users</p>
          </div>
          <div className="bg-sky-100 text-sky-600 px-4 py-2 rounded-2xl font-semibold text-sm">
            Hello Admin
          </div>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-3 gap-5 mt-5">
          <div className="bg-white rounded-3xl p-5 shadow-md">
            <h1 className="text-gray-500 font-semibold">Total Doctors</h1>
            <p className="text-5xl font-bold text-sky-500 mt-4">{countDoctors}</p>
          </div>
          <div className="bg-white rounded-3xl p-5 shadow-md">
            <h1 className="text-gray-500 font-semibold">Total Users</h1>
            <p className="text-5xl font-bold text-green-500 mt-4">{countUsers}</p>
          </div>
          <div className="bg-white rounded-3xl p-5 shadow-md">
            <h1 className="text-gray-500 font-semibold">Pending Requests</h1>
            <p className="text-5xl font-bold text-yellow-500 mt-4">{request.length}</p>
          </div>
        </div>

        {/* REQUEST TABLE */}
        <div className="bg-white rounded-3xl shadow-md mt-6 p-5">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-2xl font-bold text-sky-500">Pending Doctor Requests</h1>
            <div className="bg-sky-100 text-sky-600 px-4 py-2 rounded-2xl font-semibold text-sm">
              {request.length} Requests
            </div>
          </div>
          <table className="w-full border-separate border-spacing-y-3">
            <thead className="bg-sky-500 text-white">
              <tr>
                <th className="py-3 rounded-l-2xl">Doctor Name</th>
                <th>Specialization</th>
                <th>Email</th>
                <th className="rounded-r-2xl">Action</th>
              </tr>
            </thead>
            <tbody>
              {request.length > 0 ? (
                request.map((t, index) => (
                  <tr key={index} className="bg-gray-50 hover:bg-sky-50 transition-all">
                    <td className="py-4 text-center font-semibold rounded-l-2xl">{t.name}</td>
                    <td className="text-center">{t.spelization}</td>
                    <td className="text-center">{t.email}</td>
                    <td className="text-center rounded-r-2xl">
                      <button
                        className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-xl text-sm font-semibold"
                        onClick={() => setDoctordata(t)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center text-red-500 py-10 font-bold">
                    {message}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* POPUP */}
      {doctorData && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl p-7 w-[480px] shadow-2xl relative max-h-[90vh] overflow-y-auto">

            <button
              className="absolute top-3 right-5 text-red-500 text-3xl font-bold"
              onClick={() => setDoctordata(null)}
            >
              x
            </button>

            <h1 className="text-2xl font-bold text-sky-500 mb-6">Doctor Details</h1>

            {/* DOCTOR IMAGE */}
            <div className="flex justify-center mb-5">
              <img
                src={doctorData.image ? getImageUrl(doctorData.image) : "https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg"}
                alt="Doctor"
                className="w-24 h-24 rounded-full object-cover border-4 border-sky-200 shadow-md"
              />
            </div>

            {/* DOCTOR INFO */}
            <div className="space-y-3 text-gray-700 text-sm">
              <p><span className="font-bold">Name :</span> {doctorData.name}</p>
              <p><span className="font-bold">Email :</span> {doctorData.email}</p>
              <p><span className="font-bold">Specialization :</span> {doctorData.spelization}</p>
              <p><span className="font-bold">Degree :</span> {doctorData.degree}</p>
              <p><span className="font-bold">Experience :</span> {doctorData.experience} Years</p>
              <p><span className="font-bold">Fees :</span> {doctorData.fees}</p>
              <p><span className="font-bold">Phone :</span> {doctorData.number}</p>
            </div>

            {/* CV SECTION */}
            <div className="mt-5 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
              <p className="font-bold text-gray-700 mb-3">CV / Resume :</p>
              {doctorData.cv ? (
                <button
                  onClick={() => openCV(doctorData.cv)}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-xl font-semibold"
                >
                  View CV
                </button>
              ) : (
                <p className="text-center text-red-400 font-semibold">No CV uploaded</p>
              )}
            </div>

            {/* APPROVE REJECT BUTTONS */}
            <div className="flex justify-between mt-7">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl font-semibold"
                onClick={() => handleAccept(doctorData._id)}
              >
                Approve
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-semibold"
                onClick={() => handleReject(doctorData._id, "Not Qualified")}
              >
                Reject
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDeshboard;