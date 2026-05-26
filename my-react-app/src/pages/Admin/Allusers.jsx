import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Trash2 } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

const Allusers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const navigate = useNavigate();

  async function collectUsers() {
    try {
      const data = await fetch("http://localhost:8000/admin/getAllusers", {
        credentials: "include",
      });

      if (data.status === 401) {
        navigate("/user-login");
        return;
      }

      const result = await data.json();

      const usersData =
        result.users ||
        result.data ||
        result.allUsers ||
        [];

      setAllUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.log(error);
      alert("Error fetching users");
    }
  }

  // ================= DELETE USER =================

  async function handleDelete(id) {
    try {
      setDeleteLoadingId(id);

      // STEP 1 — GET ALL APPOINTMENTS
      const apptRes = await fetch(
        "http://localhost:8000/admin/getAllappointments",
        { credentials: "include" }
      );

      const apptData = await apptRes.json();

      const allAppointments =
        apptData?.appointments ||
        apptData?.allAppointments ||
        apptData?.data ||
        [];

      // STEP 2 — FILTER THIS USER'S PENDING OR APPROVED APPOINTMENTS
      const toReject = allAppointments.filter(
        (a) =>
          a.userId === id &&
          (a.status === "pending" || a.status === "approved")
      );

      console.log("appointments to reject:", toReject.length);

      // STEP 3 — REJECT THOSE APPOINTMENTS
      await Promise.all(
        toReject.map(async (a) => {
          try {
            await fetch(
              `http://localhost:8000/admin/reject/${a._id}`,
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

      // STEP 4 — DELETE THE USER
      const res = await fetch(
        `http://localhost:8000/admin/deleteUser/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const info = await res.json();

      alert(
        `${info.message}. ${toReject.length} appointment(s) were rejected.`
      );

      // STEP 5 — REFRESH LIST
      setConfirmId(null);
      collectUsers();

    } catch (error) {
      console.log(error);
      alert("Error deleting user");
    } finally {
      setDeleteLoadingId(null);
    }
  }

  function handleSearch(value) {
    setSearch(value);
    const filterUser = allUsers.filter(
      (user) =>
        user?.name?.toLowerCase().includes(value.toLowerCase()) ||
        user?.email?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filterUser);
  }

  useEffect(() => {
    collectUsers();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      <AdminSidebar active="users" />

      <div className="flex-1 overflow-y-auto p-5">

        {/* HEADER */}
        <div className="bg-white rounded-3xl p-5 shadow-md flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-sky-500">
              Users Management
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage all registered users
            </p>
          </div>
          <div className="bg-sky-100 text-sky-600 px-4 py-2 rounded-xl font-semibold text-sm">
            Total Users : {filteredUsers.length}
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-3xl shadow-md mt-5 p-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search user..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-2xl py-3 pl-11 pr-4 outline-none focus:border-sky-500 text-sm"
            />
          </div>
        </div>

        {/* USERS TABLE */}
        <div className="bg-white rounded-3xl shadow-md mt-6 p-5 overflow-x-auto">

          <h1 className="text-2xl font-bold text-sky-500 mb-5">
            All Users
          </h1>

          <table className="w-full border-separate border-spacing-y-3">

            <thead className="bg-sky-500 text-white">
              <tr>
                <th className="py-3 rounded-l-2xl text-center">User</th>
                <th className="text-center">Email</th>
                <th className="rounded-r-2xl text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <React.Fragment key={user._id || index}>

                    {/* USER ROW */}
                    <tr className="bg-gray-50 hover:bg-sky-50 transition-all duration-300">

                      <td className="py-4 text-center font-semibold rounded-l-2xl">
                        {user.name}
                      </td>

                      <td className="text-center text-sm text-gray-600">
                        {user.email}
                      </td>

                      <td className="text-center rounded-r-2xl">
                        {confirmId === user._id ? (
                          <div className="flex items-center justify-center gap-2">

                            <button
                              onClick={() => setConfirmId(null)}
                              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300"
                            >
                              Cancel
                            </button>

                            <button
                              onClick={() => handleDelete(user._id)}
                              disabled={deleteLoadingId === user._id}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-60 flex items-center gap-2"
                            >
                              <Trash2 size={14} />
                              {deleteLoadingId === user._id
                                ? "Deleting..."
                                : "Yes, Delete"}
                            </button>

                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmId(user._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 mx-auto transition-all duration-300"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        )}
                      </td>

                    </tr>

                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center text-red-500 py-10 font-bold"
                  >
                    No Users Found
                  </td>
                </tr>
              )}
            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Allusers;