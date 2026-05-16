import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaUserCircle } from "react-icons/fa";

const Doctor_Dashboard = () => {
  const navigate = useNavigate();

  const [doctorId, setDoctorId] = useState("");
  const [appointment, setAppointment] = useState([]);
  const [message, setMessage] = useState("");
  const [pendingC, setPendingC] = useState(0);
  const [completeC, setCompleteC] = useState(0);

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  async function checkAccess() {
    try {
      const info = await fetch(`http://localhost:8000/doctor/check`, {
        method: "GET",
        credentials: "include",
      });

      if (info.status === 401) {
        navigate("/doctor-login");
        return;
      }

      if (info.status === 403) {
        navigate("/");
        return;
      }

      const result = await info.json();

      if (result.DoctorId.length === 0) {
        alert(result.message);
        navigate("/");
      }

      setDoctorId(result.DoctorId);
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  async function handlePendingCount() {
    try {
      const info = await fetch(
        `http://localhost:8000/doctor/count-pending`,
        {
          credentials: "include",
        }
      );

      const data = await info.json();
      setPendingC(data.count);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleCompleteCount() {
    try {
      const info = await fetch(
        `http://localhost:8000/doctor/count-complete`,
        {
          credentials: "include",
        }
      );

      const data = await info.json();
      setCompleteC(data.count);
    } catch (error) {
      console.log(error);
    }
  }

  async function pendingAppointment() {
    try {
      const info = await fetch(
        `http://localhost:8000/doctor/doctorsPendingAppointments`,
        {
          credentials: "include",
        }
      );

      const appointmentdata = await info.json();

      if (appointmentdata.data.length === 0) {
        setMessage(appointmentdata.message);
        setAppointment([]);
      } else {
        setAppointment(appointmentdata.data);
      }
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong!");
    }
  }

  async function approveAppointment(id) {
    try {
      const info = await fetch(
        `http://localhost:8000/appointment/accept/${id}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      const data = await info.json();

      alert(data.message);

      pendingAppointment();
      handlePendingCount();
      handleCompleteCount();

      setSelectedAppointment(null);
    } catch (error) {
      console.log(error);
      alert("Error while approving appointment");
    }
  }

  async function rejectAppointment(id) {
    try {
      const info = await fetch(
        `http://localhost:8000/appointment/reject/${id}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      const data = await info.json();

      alert(data.message);

      pendingAppointment();
      handlePendingCount();
      handleCompleteCount();

      setSelectedAppointment(null);
    } catch (error) {
      console.log(error);
      alert("Error while rejecting appointment");
    }
  }

  useEffect(() => {
    checkAccess();
  }, []);

  useEffect(() => {
    if (!doctorId) return;

    handlePendingCount();
    handleCompleteCount();
    pendingAppointment();
  }, [doctorId]);

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Navbar */}

      <div className="flex items-center h-14 px-6 shadow-md bg-sky-400 text-amber-50">

        <div className="text-2xl font-bold">
          Hello Doctor
        </div>

        <div className="flex ml-auto space-x-5 font-bold">

          <Link
            to={"/Appontments"}
            className="p-2 transition-all hover:bg-amber-50 hover:text-sky-500 rounded-2xl"
          >
            Appointments
          </Link>

          <Link
            to={"/add-slot"}
            className="p-2 transition-all hover:bg-amber-50 hover:text-sky-500 rounded-2xl"
          >
            Add Time Slot
          </Link>

          <Link
            to={"/notification"}
            className="p-2 transition-all hover:bg-amber-50 hover:text-sky-500 rounded-2xl"
          >
            Notifications
          </Link>

          <Link
            to={"/doctor-register"}
            className="p-2 transition-all hover:bg-amber-50 hover:text-sky-500 rounded-2xl"
          >
            Temp Register
          </Link>

          <Link
            to={"/my-profile"}
            className="p-1 transition-all hover:text-sky-500"
          >
            <FaUserCircle size={36} />
          </Link>

        </div>

      </div>

      {/* Main */}

      <div className="p-5">

        <div className="flex flex-col gap-6 xl:flex-row">

          {/* Left Side */}

          <div className="flex-1">

            {/* Cards */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

              <div className="p-6 text-white shadow-2xl rounded-2xl bg-green-500">

                <h2 className="text-2xl font-bold">
                  Completed
                </h2>

                <p className="mt-5 text-5xl font-black">
                  {completeC}
                </p>

              </div>

              <div className="p-6 text-white shadow-2xl rounded-2xl bg-orange-500">

                <h2 className="text-2xl font-bold">
                  Pending
                </h2>

                <p className="mt-5 text-5xl font-black">
                  {pendingC}
                </p>

              </div>

              <div className="p-6 text-white shadow-2xl rounded-2xl bg-violet-500">

                <h2 className="text-2xl font-bold">
                  Patients
                </h2>

                <p className="mt-5 text-5xl font-black">
                  7
                </p>

              </div>

            </div>

            {/* Pending Appointments */}

            <div className="mt-10">

              <div className="flex items-center justify-between mb-5">

                <h2 className="text-2xl font-bold text-gray-700">
                  Pending Appointments
                </h2>

                <button className="px-4 py-2 font-bold text-white transition-all bg-sky-400 shadow-md rounded-2xl hover:bg-sky-500">
                  View All
                </button>

              </div>

              {/* Table */}

              <div className="overflow-hidden bg-white shadow-2xl rounded-2xl">

                <table className="w-full">

                  <thead className="text-white bg-sky-400">

                    <tr>
                      <th className="px-6 py-4">PATIENT</th>
                      <th className="px-6 py-4">DATE</th>
                      <th className="px-6 py-4">TIME</th>
                      <th className="px-6 py-4">STATUS</th>
                      <th className="px-6 py-4">ACTION</th>
                    </tr>

                  </thead>

                  <tbody>

                    {appointment.length > 0 ? (
                      appointment.map((d, index) => (
                        <tr
                          key={index}
                          className={`text-center h-16 hover:bg-sky-50 transition-all ${
                            index % 2 === 0
                              ? "bg-white"
                              : "bg-slate-100"
                          }`}
                        >

                          <td className="font-semibold text-gray-700">
                            {d.pationtName}
                          </td>

                          <td className="font-semibold text-gray-700">
                            {new Date(d.day).toLocaleDateString()}
                          </td>

                          <td className="font-semibold text-gray-700">
                            {new Date(d.start).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {" - "}
                            {new Date(d.end).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>

                          <td
                            className={`font-bold capitalize ${
                              d.status === "completed"
                                ? "text-green-600"
                                : d.status === "pending"
                                ? "text-orange-500"
                                : d.status === "approved"
                                ? "text-blue-500"
                                : "text-red-500"
                            }`}
                          >
                            {d.status}
                          </td>

                          <td>
                            <button
                              onClick={() =>
                                setSelectedAppointment(d)
                              }
                              className="px-4 py-2 font-bold text-white transition-all bg-sky-500 rounded-xl hover:bg-sky-600"
                            >
                              View
                            </button>
                          </td>

                        </tr>
                      ))
                    ) : (
                      <tr>

                        <td
                          colSpan={5}
                          className="py-10 text-2xl font-bold text-center text-red-500"
                        >
                          {message}
                        </td>

                      </tr>
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

          {/* Right Side */}

          <div className="w-full xl:w-[320px]">

            <div className="sticky top-20">

              {/* Calendar */}

              <div className="p-5 bg-white shadow-2xl rounded-2xl">

                <h2 className="mb-4 text-2xl font-bold text-center text-sky-500">
                  Calendar
                </h2>

                <Calendar
                  className="w-full border-none rounded-2xl"
                  tileClassName={() =>
                    "hover:bg-sky-100 rounded-xl transition-all"
                  }
                />

              </div>

              {/* Schedule */}

              <div className="p-5 mt-5 shadow-2xl rounded-2xl bg-sky-300">

                <h2 className="text-2xl font-bold text-sky-900">
                  Today's Schedule
                </h2>

                <p className="mt-3 font-semibold text-sky-950">
                  You currently have{" "}
                  <span className="font-black">
                    {pendingC}
                  </span>{" "}
                  pending appointments.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Modal */}

      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="w-[500px] p-6 bg-white shadow-2xl rounded-2xl">

            <h2 className="mb-5 text-3xl font-bold text-center text-sky-500">
              Appointment Details
            </h2>

            <div className="space-y-3 text-lg">

              <p>
                <span className="font-bold">
                  Patient :
                </span>{" "}
                {selectedAppointment.pationtName}
              </p>

              <p>
                <span className="font-bold">
                  Mobile :
                </span>{" "}
                {selectedAppointment.mobileNumber}
              </p>

              <p>
                <span className="font-bold">
                  Age :
                </span>{" "}
                {selectedAppointment.age}
              </p>

              <p>
                <span className="font-bold">
                  Date :
                </span>{" "}
                {new Date(
                  selectedAppointment.day
                ).toLocaleDateString()}
              </p>

              <p>
                <span className="font-bold">
                  Start :
                </span>{" "}
                {new Date(
                  selectedAppointment.start
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <p>
                <span className="font-bold">
                  End :
                </span>{" "}
                {new Date(
                  selectedAppointment.end
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <p>
                <span className="font-bold">
                  Status :
                </span>{" "}
                <span className="capitalize">
                  {selectedAppointment.status}
                </span>
              </p>

            </div>

            <div className="flex justify-between mt-8">

              <button
                onClick={() =>
                  approveAppointment(selectedAppointment._id)
                }
                className="px-6 py-2 font-bold text-white transition-all bg-green-500 rounded-xl hover:bg-green-600"
              >
                Approve
              </button>

              <button
                onClick={() =>
                  rejectAppointment(selectedAppointment._id)
                }
                className="px-6 py-2 font-bold text-white transition-all bg-red-500 rounded-xl hover:bg-red-600"
              >
                Reject
              </button>

              <button
                onClick={() =>
                  setSelectedAppointment(null)
                }
                className="px-6 py-2 font-bold text-white transition-all bg-gray-500 rounded-xl hover:bg-gray-600"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Doctor_Dashboard;