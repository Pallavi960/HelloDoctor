import React, { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";

const Allappointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(false);

  // ✅ FETCH BY STATUS
  async function fetchAppointments(type) {
    try {
      setLoading(true);

      let url = "";

      if (type === "pending") {
        url = "http://localhost:8000/admin/findPendingAppointments";
      } else if (type === "approved") {
        url = "http://localhost:8000/admin/findApprovedAppointments";
      } else if (type === "rejected") {
        url = "http://localhost:8000/admin/findrejectAppointments";
      } else if (type === "completed") {
        url = "http://localhost:8000/admin/completed-appointment";
      }

      const res = await fetch(url, {
        credentials: "include",
      });

      const data = await res.json();

      const list =
        data?.appointments ||
        data?.allAppointments ||
        data?.data ||
        [];

      const enriched = await Promise.all(
        list.map(async (item) => {
          let doctorName = "Doctor";

          try {
            const docRes = await fetch(
              `http://localhost:8000/admin/getDoctorByid/${item.doctorId}`,
              { credentials: "include" }
            );

            const docData = await docRes.json();

            doctorName =
              docData?.doctor?.name ||
              docData?.data?.name ||
              "Doctor";
          } catch (err) {
            console.log(err);
          }

          return { ...item, doctorName };
        })
      );

      setAppointments(enriched);
    } catch (error) {
      console.log(error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAppointments(activeTab);
  }, [activeTab]);

  // ✅ ACTIONS
  async function handleAction(action, id) {
    try {
      let url = "";
      let method = "POST";

      if (action === "approve") {
        url = `http://localhost:8000/admin/accept/${id}`;
      }

      if (action === "reject") {
        url = `http://localhost:8000/admin/reject/${id}`;
      }

      if (action === "complete") {
        url = `http://localhost:8000/admin/complete/${id}`;
      }

      if (action === "delete") {
        url = `http://localhost:8000/admin/delete/${id}`;
        method = "DELETE";
      }

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      alert(data.message || "Success");

      fetchAppointments(activeTab);
    } catch (error) {
      console.log(error);
      alert("Action failed");
    }
  }

  // ✅ STATUS ACTION MENU
  function renderActions(status, id) {
    status = (status || "pending").toLowerCase();

    if (status === "pending") {
      return (
        <select
          onChange={(e) => handleAction(e.target.value, id)}
          className="px-3 py-2 border rounded-xl"
        >
          <option value="">Take Action</option>
          <option value="approve">Approve</option>
          <option value="reject">Reject</option>
          <option value="complete">Complete</option>
          <option value="delete">Delete</option>
        </select>
      );
    }

    if (status === "approved") {
      return (
        <select
          onChange={(e) => handleAction(e.target.value, id)}
          className="px-3 py-2 border rounded-xl"
        >
          <option value="">Take Action</option>
          <option value="complete">Complete</option>
          <option value="reject">Reject</option>
          <option value="delete">Delete</option>
        </select>
      );
    }

    if (status === "rejected") {
      return (
        <select
          onChange={(e) => handleAction(e.target.value, id)}
          className="px-3 py-2 border rounded-xl"
        >
          <option value="">Take Action</option>
          <option value="approve">Approve</option>
          <option value="delete">Delete</option>
        </select>
      );
    }

    if (status === "completed") {
      return (
        <button
          onClick={() => handleAction("delete", id)}
          className="bg-red-500 text-white px-4 py-2 rounded-xl"
        >
          Delete
        </button>
      );
    }

    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      <AdminSidebar active="appointments" />

      <div className="flex-1 overflow-y-auto p-5">

        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow-md p-5 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-sky-500">
            Appointments Management
          </h1>

          <div className="text-sm font-bold text-gray-600">
            {activeTab.toUpperCase()}
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-3 mt-6 flex-wrap">

          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-xl ${
              activeTab === "pending"
                ? "bg-yellow-500 text-white"
                : "bg-white"
            }`}
          >
            Pending
          </button>

          <button
            onClick={() => setActiveTab("approved")}
            className={`px-4 py-2 rounded-xl ${
              activeTab === "approved"
                ? "bg-blue-500 text-white"
                : "bg-white"
            }`}
          >
            Approved
          </button>

          <button
            onClick={() => setActiveTab("rejected")}
            className={`px-4 py-2 rounded-xl ${
              activeTab === "rejected"
                ? "bg-red-500 text-white"
                : "bg-white"
            }`}
          >
            Rejected
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-2 rounded-xl ${
              activeTab === "completed"
                ? "bg-green-500 text-white"
                : "bg-white"
            }`}
          >
            Completed
          </button>

        </div>

        {/* TABLE */}
        <div className="bg-white rounded-3xl shadow-md mt-6 p-5 overflow-x-auto">

          {loading ? (
            <p className="text-center py-10">Loading...</p>
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
                  <th>Patient</th>
                  <th>Mobile</th>
                  <th>Age</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((a) => (
                  <tr key={a._id} className="bg-gray-50 text-center">

                    <td>{a.pationtName}</td>
                    <td>{a.mobileNumber}</td>
                    <td>{a.age}</td>
                    <td>Dr. {a.doctorName}</td>

                    <td>
                      {new Date(a.day).toLocaleDateString()}
                    </td>

                    <td className="font-bold">
                      {a.status}
                    </td>

                    <td>
                      {renderActions(a.status, a._id)}
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

export default Allappointment;