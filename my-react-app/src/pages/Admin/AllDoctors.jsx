import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Eye,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar";

const AllDoctors = () => {
  const [allDoctors, setAlldoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const [search, setSearch] = useState("");

  const [doctorData, setDoctorData] = useState(null);

  const navigate = useNavigate();

  async function collectData() {
    try {
      const data = await fetch(
        "http://localhost:8000/admin/getAlldoctors",
        {
          credentials: "include",
        }
      );

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
        doctor.name
          .toLowerCase()
          .includes(value.toLowerCase()) ||
        doctor.spelization
          .toLowerCase()
          .includes(value.toLowerCase())
    );

    setFilteredDoctors(filterDoctor);
  }

  useEffect(() => {

    collectData();

  }, []);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* Sidebar */}

      <AdminSidebar active="doctors" />

      {/* Main Content */}

      <div className="flex-1 overflow-y-auto p-5">

        {/* Navbar */}

        <div className="bg-white rounded-3xl p-5 shadow-md flex justify-between items-center">

          <div>

            <h1 className="text-3xl font-bold text-sky-500">
              Doctors Management
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              Search and manage approved doctors
            </p>

          </div>

          <div className="bg-sky-100 text-sky-600 px-4 py-2 rounded-xl font-semibold text-sm">

            Total Doctors : {filteredDoctors.length}

          </div>

        </div>

        {/* Search */}

        <div className="bg-white rounded-3xl shadow-md mt-5 p-4">

          <div className="relative">

            <Search
              className="absolute left-4 top-3.5 text-gray-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search doctor..."
              value={search}
              onChange={(e) =>
                handleSearch(e.target.value)
              }
              className="w-full border border-gray-300 rounded-2xl py-3 pl-11 pr-4 outline-none focus:border-sky-500 text-sm"
            />

          </div>

        </div>

        {/* Doctors Grid */}

        <div className="grid grid-cols-4 gap-5 mt-6 pb-10">

          {filteredDoctors.length > 0 ? (

            filteredDoctors.map((doctor) => (

              <div
                key={doctor._id}
                className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4"
              >

                <h1 className="text-base font-bold text-sky-600 text-center truncate">

                  Dr. {doctor.name}

                </h1>

                <p className="text-center text-gray-600 text-sm mt-2">

                  {doctor.spelization}

                </p>

                <button
                  onClick={() =>
                    setDoctorData(doctor)
                  }
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

      {/* Popup */}

      {doctorData && (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white rounded-3xl p-7 w-[420px] shadow-2xl relative">

            <button
              className="absolute top-3 right-5 text-red-500 text-3xl font-bold"
              onClick={() => setDoctorData(null)}
            >

              ×

            </button>

            <h1 className="text-2xl font-bold text-sky-500 mb-6">

              Doctor Details

            </h1>

            <div className="space-y-3 text-gray-700 text-sm">

              <p>
                <span className="font-bold">
                  Name :
                </span>{" "}
                Dr. {doctorData.name}
              </p>

              <p>
                <span className="font-bold">
                  Email :
                </span>{" "}
                {doctorData.email}
              </p>

              <p>
                <span className="font-bold">
                  Specialization :
                </span>{" "}
                {doctorData.spelization}
              </p>

              <p>
                <span className="font-bold">
                  Degree :
                </span>{" "}
                {doctorData.degree}
              </p>

              <p>
                <span className="font-bold">
                  Experience :
                </span>{" "}
                {doctorData.experience} Years
              </p>

              <p>
                <span className="font-bold">
                  Fees :
                </span>{" "}
                ₹ {doctorData.fees}
              </p>

              <p>
                <span className="font-bold">
                  Number :
                </span>{" "}
                {doctorData.number}
              </p>

              <p>
                <span className="font-bold">
                  Status :
                </span>{" "}
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-xl text-xs font-bold">

                  Approved

                </span>
              </p>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AllDoctors;