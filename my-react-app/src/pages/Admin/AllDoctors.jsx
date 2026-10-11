import { API_URL, apiFetch } from "../../config/api.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, Trash2 } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

const AllDoctors = () => {
  const [allDoctors, setAlldoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [doctorData, setDoctorData] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  function getImageUrl(imagePath) {
    return API_URL + '/' + imagePath.replace(/\\/g, "/");
  }

  function openCV(cvPath) {
    const url = API_URL + '/' + cvPath.replace(/\\/g, "/");
    window.open(url, "_blank");
  }

  async function collectData() {
    try {
      const data = await apiFetch(API_URL + '/admin/getAlldoctors', {
        credentials: "include",
      });

      if (data.status === 401) {
        navigate("/user-login");
        return;
      }

      const result = await data.json();
      setAlldoctors(result.allDoctors || []);
      setFilteredDoctors(result.allDoctors || []);
    } catch (error) {
      alert("Error occurred while fetching doctors");
    }
  }

  function handleSearch(value) {
    setSearch(value);
    const filterDoctor = allDoctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(value.toLowerCase()) ||
        doctor.spelization.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDoctors(filterDoctor);
  }

  // ================= DELETE DOCTOR =================

  async function handleDeleteDoctor() {
    if (!doctorData) return;

    try {
      setDeleteLoading(true);

      // STEP 1 — GET ALL APPOINTMENTS
      const apptRes = await apiFetch(
        API_URL + '/admin/getAllappointments',
        { credentials: "include" }
      );

      const apptData = await apptRes.json();

      const allAppointments =
        apptData?.appointments ||
        apptData?.allAppointments ||
        apptData?.data ||
        [];

      // STEP 2 — FILTER APPOINTMENTS OF THIS DOCTOR THAT ARE PENDING OR APPROVED
      const toReject = allAppointments.filter(
        (a) =>
          a.doctorId === doctorData._id &&
          (a.status === "pending" || a.status === "approved")
      );

      console.log("appointments to reject:", toReject.length);

      // STEP 3 — REJECT THOSE APPOINTMENTS
      await Promise.all(
        toReject.map(async (a) => {
          try {
            await apiFetch(
              `${API_URL}/admin/reject/${a._id}`,
              {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
              }
            );
          } catch (err) {
            console.log("reject error:", err);
          }
        })
      );

      // STEP 4 — DELETE THE DOCTOR
      const deleteRes = await apiFetch(
        `${API_URL}/admin/deleteDoctor/${doctorData._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const deleteData = await deleteRes.json();

      if (deleteData.success === false) {
        alert(deleteData.message || "Failed to delete doctor");
        return;
      }

      alert(
        `Dr. ${doctorData.name} deleted successfully. ${toReject.length} appointment(s) were rejected.`
      );

      // STEP 5 — CLOSE POPUP AND REFRESH
      setDoctorData(null);
      setShowConfirm(false);
      collectData();

    } catch (error) {
      console.log(error);
      alert("Something went wrong while deleting the doctor");
    } finally {
      setDeleteLoading(false);
    }
  }

  useEffect(() => {
    collectData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      <AdminSidebar active="doctors" />

      <div className="flex-1 overflow-y-auto p-5">

        {/* HEADER */}
        <div className="bg-white rounded-3xl p-5 shadow-md flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-sky-500">Doctors Management</h1>
            <p className="text-gray-500 text-sm mt-1">Search and manage approved doctors</p>
          </div>
          <div className="bg-sky-100 text-sky-600 px-4 py-2 rounded-xl font-semibold text-sm">
            Total Doctors : {filteredDoctors.length}
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-3xl shadow-md mt-5 p-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search doctor..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-2xl py-3 pl-11 pr-4 outline-none focus:border-sky-500 text-sm"
            />
          </div>
        </div>

        {/* DOCTORS GRID */}
        <div className="grid grid-cols-4 gap-5 mt-6 pb-10">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <div
                key={doctor._id}
                className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4"
              >

                {/* DOCTOR IMAGE */}
                <div className="flex justify-center mb-3">
                  <img
                    src={
                      doctor.image
                        ? getImageUrl(doctor.image)
                        : "https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg"
                    }
                    alt="Doctor"
                    className="w-20 h-20 rounded-full object-cover border-4 border-sky-100 shadow"
                  />
                </div>

                <h1 className="text-base font-bold text-sky-600 text-center truncate">
                  Dr. {doctor.name}
                </h1>

                <p className="text-center text-gray-600 text-sm mt-2">
                  {doctor.spelization}
                </p>

                <button
                  onClick={() => {
                    setDoctorData(doctor);
                    setShowConfirm(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold py-2 rounded-xl mt-4 transition-all duration-300"
                >
                  <Eye size={16} />
                  View Details
                </button>

              </div>
            ))
          ) : (
            <div className="col-span-4 text-center text-red-500 text-2xl font-bold mt-20">
              No Doctor Found
            </div>
          )}
        </div>

      </div>

      {/* ===== POPUP ===== */}
      {doctorData && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl p-7 w-[480px] shadow-2xl relative max-h-[90vh] overflow-y-auto">

            {/* CLOSE */}
            <button
              className="absolute top-3 right-5 text-red-500 text-3xl font-bold"
              onClick={() => {
                setDoctorData(null);
                setShowConfirm(false);
              }}
            >
              ×
            </button>

            <h1 className="text-2xl font-bold text-sky-500 mb-6">Doctor Details</h1>

            {/* DOCTOR IMAGE */}
            <div className="flex justify-center mb-5">
              <img
                src={
                  doctorData.image
                    ? getImageUrl(doctorData.image)
                    : "https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg"
                }
                alt="Doctor"
                className="w-24 h-24 rounded-full object-cover border-4 border-sky-200 shadow-md"
              />
            </div>

            {/* DOCTOR INFO */}
            <div className="space-y-3 text-gray-700 text-sm">
              <p><span className="font-bold">Name :</span> Dr. {doctorData.name}</p>
              <p><span className="font-bold">Email :</span> {doctorData.email}</p>
              <p><span className="font-bold">Specialization :</span> {doctorData.spelization}</p>
              <p><span className="font-bold">Degree :</span> {doctorData.degree}</p>
              <p><span className="font-bold">Experience :</span> {doctorData.experience} Years</p>
              <p><span className="font-bold">Fees :</span> {doctorData.fees}</p>
              <p><span className="font-bold">Number :</span> {doctorData.number}</p>
              <p>
                <span className="font-bold">Status :</span>{" "}
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-xl text-xs font-bold">
                  Approved
                </span>
              </p>
            </div>

            {/* CV SECTION */}
            <div className="mt-5 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
              <p className="font-bold text-gray-700 mb-3">CV / Resume :</p>
              {doctorData.cv ? (
                <button
                  onClick={() => openCV(doctorData.cv)}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-xl font-semibold transition-all duration-300"
                >
                  View CV
                </button>
              ) : (
                <p className="text-center text-red-400 font-semibold">No CV uploaded</p>
              )}
            </div>

            {/* ===== DELETE SECTION ===== */}
            <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-2xl">

              <p className="font-bold text-red-600 mb-1">Danger Zone</p>
              <p className="text-xs text-red-400 mb-4">
                Deleting this doctor will automatically reject all their pending
                and approved appointments.
              </p>

              {/* CONFIRM BOX */}
              {!showConfirm ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-xl transition-all duration-300"
                >
                  <Trash2 size={16} />
                  Delete Doctor
                </button>
              ) : (
                <div className="space-y-3">

                  <p className="text-sm font-bold text-center text-red-600">
                    Are you sure you want to delete Dr. {doctorData.name}?
                  </p>

                  <div className="flex gap-3">

                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 rounded-xl transition-all duration-300"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleDeleteDoctor}
                      disabled={deleteLoading}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-xl transition-all duration-300 disabled:opacity-60"
                    >
                      {deleteLoading ? "Deleting..." : "Yes, Delete"}
                    </button>

                  </div>

                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AllDoctors;