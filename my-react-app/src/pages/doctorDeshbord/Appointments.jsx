import { API_URL, apiFetch } from "../../config/api.js";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

// ================= IMPORT LOGO =================
import logo from "../../assets/Hello_Doctor_logo.png";

const Appointments = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(false);

  // ================= FETCH APPOINTMENTS =================
  async function fetchAppointments(type) {
    try {
      setLoading(true);

      let url = "";

      if (type === "pending") {
        url =
          API_URL + '/doctor/doctorsPendingAppointments';
      }

      if (type === "approved") {
        url =
          API_URL + '/doctor/doctorsApprovedAppointments';
      }

      if (type === "completed") {
        url =
          API_URL + '/doctor/doctorsCompleteAppointments';
      }

      if (type === "rejected") {
        url =
          API_URL + '/doctor/doctorsRejectAppointments';
      }

      const response = await apiFetch(url, {
        credentials: "include",
      });

      if (response.status === 401) {
        navigate("/doctor-login");
        return;
      }

      const data = await response.json();

      const list =
        data?.appointments ||
        data?.allAppointments ||
        data?.data ||
        [];

      setAppointments(list);

    } catch (error) {

      console.log(error);
      setAppointments([]);

    } finally {

      setLoading(false);

    }
  }

async function handleLogout() {
    try {
      const info = await apiFetch(API_URL + '/doctor/logout', {
        method: "GET",
        credentials: "include",
      });
      const data = await info.json();
      alert(data.message);
      navigate("/doctor-login");
    } catch (error) {
      console.log(error);
      alert("Logout failed");
    }
  }

  // ================= ACTIONS =================
  async function handleAction(action, id) {

    try {

      let url = "";
      let method = "PUT";

      if (action === "approve") {
        url = `${API_URL}/doctor/accept/${id}`;
      }

      if (action === "reject") {
        url = `${API_URL}/doctor/reject/${id}`;
      }

      if (action === "complete") {
        url = `${API_URL}/doctor/complete/${id}`;
      }

      if (action === "delete") {
        url = `${API_URL}/doctor/delete/${id}`;
        method = "DELETE";
      }

      const response = await apiFetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      alert(data.message || "Success");

      fetchAppointments(activeTab);

    } catch (error) {

      console.log(error);
      alert("Action failed");

    }
  }

  // ================= STATUS COLORS =================
  function statusStyle(status) {

    status = status?.toLowerCase();

    if (status === "pending") {
      return "bg-yellow-100 text-yellow-600";
    }

    if (status === "approved") {
      return "bg-blue-100 text-blue-600";
    }

    if (status === "completed") {
      return "bg-green-100 text-green-600";
    }

    if (status === "rejected") {
      return "bg-red-100 text-red-600";
    }

    return "bg-gray-100 text-gray-600";
  }

  // ================= ACTION MENU =================
  function renderActions(status, id) {

    status = status?.toLowerCase();

    if (status === "pending") {

      return (

        <select
          onChange={(e) =>
            handleAction(e.target.value, id)
          }
          className="px-3 py-2 border rounded-xl outline-none"
        >

          <option value="">
            Take Action
          </option>

          <option value="approve">
            Approve
          </option>

          <option value="reject">
            Reject
          </option>

          <option value="complete">
            Complete
          </option>

          <option value="delete">
            Delete
          </option>

        </select>

      );
    }

    if (status === "approved") {

      return (

        <select
          onChange={(e) =>
            handleAction(e.target.value, id)
          }
          className="px-3 py-2 border rounded-xl outline-none"
        >

          <option value="">
            Take Action
          </option>

          <option value="complete">
            Complete
          </option>

          <option value="reject">
            Reject
          </option>

          <option value="delete">
            Delete
          </option>

        </select>

      );
    }

    if (status === "rejected") {

      return (

        <select
          onChange={(e) =>
            handleAction(e.target.value, id)
          }
          className="px-3 py-2 border rounded-xl outline-none"
        >

          <option value="">
            Take Action
          </option>

          <option value="approve">
            Approve
          </option>

          <option value="delete">
            Delete
          </option>

        </select>

      );
    }

    if (status === "completed") {

      return (

        <button
          onClick={() =>
            handleAction("delete", id)
          }
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all duration-300"
        >
          Delete
        </button>

      );
    }

    return null;
  }

  // ================= LOAD =================
  useEffect(() => {

    fetchAppointments("pending");

  }, []);

  return (

    <div className="min-h-screen bg-slate-100">

      {/* ================= NAVBAR ================= */}

      <div className="flex items-center h-16 px-4 shadow-lg bg-sky-400 text-amber-50">

        <div className="flex items-center">

          <img
            src={logo}
            alt="Hello Doctor Logo"
            className="object-contain w-45 h-35"
          />

        </div>

        {/* ================= NAV ITEMS ================= */}

        <div className="flex items-center ml-auto space-x-5 font-bold">

         

            <Link to={"/doctorDeshbord"} 
            className="p-2 transition-all hover:bg-amber-50 hover:text-sky-500 rounded-2xl">Dashboard
            </Link>
          <Link
            to={"/add-slot"}
            className="px-5 py-2 transition-all duration-300 hover:bg-amber-50 hover:text-sky-500 rounded-2xl"
          >
            Add Time Slot
          </Link>

          <Link
            to={"/notification"}
            className="px-5 py-2 transition-all duration-300 hover:bg-amber-50 hover:text-sky-500 rounded-2xl"
          >
            Notifications
          </Link>

          <button onClick={handleLogout} className="px-4 py-2 transition-all bg-red-500 rounded-2xl hover:bg-red-600">Logout</button>
          
          <Link
            to={"/my-profile"}
            className="transition-all duration-300 hover:text-sky-200"
          >
            <FaUserCircle size={40} />
          </Link>
          

        </div>

      </div>

      {/* ================= MAIN ================= */}

      <div className="p-6">

        {/* HEADER */}

        <div className="bg-white rounded-3xl shadow-md p-6 flex justify-between items-center">

          <div>

            <h1 className="text-3xl font-bold text-sky-500">
              Appointments Management
            </h1>

            <p className="text-gray-500 mt-1">
              Manage all patient appointments
            </p>

          </div>

          <div className="bg-sky-100 text-sky-600 px-5 py-2 rounded-xl font-bold">

            {activeTab.toUpperCase()}

          </div>

        </div>

        {/* ================= FILTER BUTTONS ================= */}

        <div className="flex gap-4 mt-6 flex-wrap">

          <button
            onClick={() => {
              setActiveTab("pending");
              fetchAppointments("pending");
            }}
            className={`px-5 py-2 rounded-2xl font-semibold transition-all duration-300
            ${
              activeTab === "pending"
                ? "bg-yellow-500 text-white"
                : "bg-white text-yellow-500"
            }`}
          >
            Pending
          </button>

          <button
            onClick={() => {
              setActiveTab("approved");
              fetchAppointments("approved");
            }}
            className={`px-5 py-2 rounded-2xl font-semibold transition-all duration-300
            ${
              activeTab === "approved"
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500"
            }`}
          >
            Approved
          </button>

          <button
            onClick={() => {
              setActiveTab("rejected");
              fetchAppointments("rejected");
            }}
            className={`px-5 py-2 rounded-2xl font-semibold transition-all duration-300
            ${
              activeTab === "rejected"
                ? "bg-red-500 text-white"
                : "bg-white text-red-500"
            }`}
          >
            Rejected
          </button>

          <button
            onClick={() => {
              setActiveTab("completed");
              fetchAppointments("completed");
            }}
            className={`px-5 py-2 rounded-2xl font-semibold transition-all duration-300
            ${
              activeTab === "completed"
                ? "bg-green-500 text-white"
                : "bg-white text-green-500"
            }`}
          >
            Completed
          </button>

        </div>

        {/* ================= TABLE ================= */}

        <div className="bg-white rounded-3xl shadow-md mt-6 p-5 overflow-x-auto">

          {loading ? (

            <div className="py-20 text-center">

              <p className="text-xl font-bold text-gray-500">
                Loading...
              </p>

            </div>

          ) : appointments.length === 0 ? (

            <div className="py-24 text-center">

              <p className="text-2xl font-extrabold text-gray-700">
                No Appointments Found
              </p>

              <p className="text-sm text-gray-400 mt-2">
                No {activeTab} appointments available
              </p>

            </div>

          ) : (

            <table className="w-full border-separate border-spacing-y-3">

              <thead className="bg-sky-500 text-white">

                <tr>

                  <th className="py-4 rounded-l-2xl">
                    Patient
                  </th>

                  <th>Mobile</th>

                  <th>Age</th>

                  <th>Date</th>

                  <th>Time</th>

                  <th>Status</th>

                  <th className="rounded-r-2xl">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {appointments.map((item, index) => (

                  <tr
                    key={item._id || index}
                    className="bg-gray-50 hover:bg-sky-50 transition-all duration-300 text-center"
                  >

                    <td className="py-4 font-semibold rounded-l-2xl">
                      {item.pationtName}
                    </td>

                    <td>
                      {item.mobileNumber}
                    </td>

                    <td>
                      {item.age}
                    </td>

                    <td>
                      {new Date(
                        item.day
                      ).toLocaleDateString()}
                    </td>

                    <td>

                      {new Date(
                        item.start
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}

                      {" - "}

                      {new Date(
                        item.end
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}

                    </td>

                    <td>

                      <span
                        className={`px-4 py-1 rounded-xl text-xs font-bold ${statusStyle(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>

                    </td>

                    <td className="rounded-r-2xl">

                      {renderActions(
                        item.status,
                        item._id
                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </div>

  );
};

export default Appointments;