import { API_URL, apiFetch } from "../../config/api.js";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/Hello_Doctor_logo.png";
import { FaUserCircle } from "react-icons/fa";

const Myappointment = () => {

  const navigate = useNavigate();

  const [appointment, setAppointment] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function collectData() {
    try {
      setLoading(true);

      const data = await apiFetch(API_URL + '/user/user-appointment', {
        method: "GET",
        credentials: "include",
      });

      if (data.status === 401) {
        navigate("/user-login");
        return;
      }

      const result = await data.json();
      console.log("appointment result:", result);

      if (!result.data || result.data.length === 0) {
        setAppointment([]);
        setMessage("No Appointment Found!");
        return;
      }

      const updatedAppointments = await Promise.all(
        result.data.map(async (item) => {
          try {
            console.log("doctor id is:", item.doctorId);

            const doctorData = await apiFetch(
              `${API_URL}/user/getDoctorByid/${item.doctorId}`,
              { method: "GET", credentials: "include" }
            );

            const doctorResult = await doctorData.json();
            console.log("doctor api result:", doctorResult);

            const doctorName =
              doctorResult?.data?.name ||
              doctorResult?.getDoctor?.name ||
              doctorResult?.doctor?.name ||
              "Unknown";

            return { ...item, doctorName };
          } catch (error) {
            console.log(error);
            return { ...item, doctorName: "Unknown" };
          }
        })
      );

      console.log(updatedAppointments);
      setAppointment(updatedAppointments);
    } catch (error) {
      console.log("something went wrong!", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      const res = await apiFetch(API_URL + '/user/logout', {
        method: "GET",
        credentials: "include",
      });
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

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ===== NAVBAR ===== */}
      <div className="flex items-center justify-between h-16 px-6 shadow-lg bg-sky-400">

        {/* LEFT — Logo */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Hello Doctor Logo"
            className="object-contain w-45 h-35 rounded-full"
          />
        </div>

        {/* RIGHT — All Nav Items */}
        <div className="flex items-center gap-2 font-bold text-white">
          <Link
            to={"/userDeshbord"}
            className="px-4 py-2 rounded-2xl transition-all duration-300 hover:bg-white hover:text-sky-500"
          >
            Dashboard
          </Link>
          <Link
            to={"/serch-doctor"}
            className="px-4 py-2 rounded-2xl transition-all duration-300 hover:bg-white hover:text-sky-500"
          >
            Search Doctor
          </Link>
          <button
            onClick={handleLogout}
            className="px-5 py-2 text-white bg-red-500 rounded-2xl transition-all duration-300 hover:bg-red-400"
          >
            Logout
          </button>
          <Link
            to={"/user-my-profile"}
            className="flex items-center p-2 text-white rounded-2xl transition-all duration-300 hover:bg-white hover:text-sky-500"
          >
            <FaUserCircle size={32} />
          </Link>
        </div>

      </div>

      {/* TITLE */}
      <div className="mt-8">
        <h1 className="text-4xl font-bold text-center text-sky-600">
          My Appointments
        </h1>
      </div>

      {/* TABLE */}
      <div className="flex justify-center px-5 mt-10 pb-10">
        <table className="overflow-hidden bg-white shadow-2xl w-[1200px] rounded-3xl">
          <thead className="bg-sky-500 text-amber-50">
            <tr>
              <th className="px-4 py-4 text-lg">Doctor Name</th>
              <th className="px-4 py-4 text-lg">Day</th>
              <th className="px-4 py-4 text-lg">Start Time</th>
              <th className="px-4 py-4 text-lg">End Time</th>
              <th className="px-4 py-4 text-lg">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-10 text-3xl font-bold text-center text-sky-600">
                  Loading...
                </td>
              </tr>
            ) : appointment.length > 0 ? (
              appointment.map((d, index) => (
                <tr
                  key={index}
                  className="transition-all duration-300 border-b text-neutral-700 hover:bg-gray-100"
                >
                  <td className="py-4 text-lg font-semibold text-center">
                    Dr. {d.doctorName}
                  </td>
                  <td className="py-4 text-lg text-center">
                    {d.day ? new Date(d.day).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="py-4 text-lg text-center">
                    {d.start
                      ? new Date(d.start).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </td>
                  <td className="py-4 text-lg text-center">
                    {d.end
                      ? new Date(d.end).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </td>
                  <td className="py-4 text-lg font-bold text-center">
                    <span
                      className={`px-4 py-2 rounded-xl text-white
                        ${d.status === "pending"
                          ? "bg-yellow-500"
                          : d.status === "approved"
                          ? "bg-blue-500"
                          : d.status === "completed"
                          ? "bg-green-600"
                          : d.status === "rejected"
                          ? "bg-red-500"
                          : "bg-gray-500"
                        }`}
                    >
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-10 text-3xl font-bold text-center text-red-500">
                  {message}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Myappointment;