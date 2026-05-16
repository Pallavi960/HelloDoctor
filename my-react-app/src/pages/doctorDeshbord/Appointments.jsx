import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Appointments = () => {
  const navigate = useNavigate();

  const doctorId = "696b7709a7f15fd43c663b04"; // 👈 YOUR DOCTOR ID

  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // ================= SLOT STATES =================
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState("");

  const [form, setForm] = useState({
    pationtName: "",
    mobileNumber: "",
    age: "",
  });

  // ================= FETCH APPOINTMENTS =================
  async function fetchAppointments(type) {
    try {
      setLoading(true);
      setActiveTab(type);
      setMessage("");

      let url = "";

      if (type === "pending") {
        url = "http://localhost:8000/doctor/doctorsPendingAppointments";
      }
      if (type === "approved") {
        url = "http://localhost:8000/doctor/doctorsApprovedAppointments";
      }
      if (type === "completed") {
        url = "http://localhost:8000/doctor/doctorsCompleteAppointments";
      }
      if (type === "rejected") {
        url = "http://localhost:8000/doctor/doctorsRejectAppointments";
      }

      const response = await fetch(url, { credentials: "include" });

      if (response.status === 401) return navigate("/doctor-login");
      if (response.status === 403) return navigate("/");

      const data = await response.json();

      if (!data.data || data.data.length === 0) {
        setAppointments([]);
        setMessage("No appointments found");
      } else {
        setAppointments(data.data);
      }
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  // ================= FETCH SLOTS =================
  async function fetchSlots() {
    try {
      const res = await fetch(
        `http://localhost:8000/user/getDoctorSlots/${doctorId}`
      );

      const data = await res.json();

      if (!data || data.length === 0) {
        setSlots([]);
      } else {
        setSlots(data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // ================= OPEN MODAL =================
  function openBookingModal(item) {
    setSelectedAppointment(item);

    setForm({
      pationtName: "",
      mobileNumber: "",
      age: "",
    });

    setSelectedSlotId("");

    fetchSlots(); // 👈 LOAD SLOTS WHEN OPENING
  }

  // ================= BOOK APPOINTMENT =================
  async function bookAppointment() {
    try {
      const payload = {
        doctorId,
        slotId: selectedSlotId,
        ...form,
      };

      const res = await fetch(
        "http://localhost:8000/appointment/Book",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      alert(data.message);

      setSelectedAppointment(null);
      fetchAppointments(activeTab);
    } catch (err) {
      console.log(err);
    }
  }

  // ================= ACTIONS =================
  async function approveAppointment(id) {
    await fetch(`http://localhost:8000/doctor/accept/${id}`, {
      method: "PUT",
      credentials: "include",
    });

    setSelectedAppointment(null);
    fetchAppointments(activeTab);
  }

  async function rejectAppointment(id) {
    await fetch(`http://localhost:8000/doctor/reject/${id}`, {
      method: "PUT",
      credentials: "include",
    });

    setSelectedAppointment(null);
    fetchAppointments(activeTab);
  }

  async function completeAppointment(id) {
    await fetch(`http://localhost:8000/doctor/complete/${id}`, {
      method: "PUT",
      credentials: "include",
    });

    fetchAppointments("approved");
  }

  async function deleteAppointment(id) {
    await fetch(`http://localhost:8000/doctor/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    fetchAppointments(activeTab);
  }

  useEffect(() => {
    fetchAppointments("pending");
  }, []);

  function statusStyle(status) {
    if (status === "pending") return "bg-orange-100 text-orange-600";
    if (status === "approved") return "bg-blue-100 text-blue-600";
    if (status === "completed") return "bg-green-100 text-green-600";
    return "bg-red-100 text-red-600";
  }

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ================= HEADER ================= */}
      <div className="px-8 pt-8">
        <h1 className="text-4xl font-bold">Appointments Management</h1>
      </div>

      {/* ================= TABLE ================= */}
      <div className="p-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          <table className="w-full">
            <thead className="bg-sky-500 text-white">
              <tr>
                <th>Patient</th>
                <th>Mobile</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((item) => (
                <tr key={item._id} className="text-center border-b">

                  <td>{item.pationtName}</td>
                  <td>{item.mobileNumber}</td>

                  <td>{new Date(item.day).toLocaleDateString()}</td>

                  <td>
                    {new Date(item.start).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" - "}
                    {new Date(item.end).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td>
                    <span className={statusStyle(item.status)}>
                      {item.status}
                    </span>
                  </td>

                  <td>
                    <button
                      onClick={() => openBookingModal(item)}
                      className="bg-sky-500 text-white px-4 py-2 rounded-xl"
                    >
                      Action
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-white w-[700px] p-6 rounded-2xl">

            <h2 className="text-2xl font-bold mb-4">
              Book Appointment
            </h2>

            {/* ================= SLOTS ================= */}
            <div className="mb-4">
              <h3 className="font-bold mb-2">Available Slots</h3>

              {slots.length === 0 ? (
                <p className="text-red-500">No slots available</p>
              ) : (
                <div className="grid gap-2 max-h-40 overflow-auto">
                  {slots.map((slot) => (
                    <button
                      key={slot._id}
                      disabled={slot.isBooked}
                      onClick={() => setSelectedSlotId(slot._id)}
                      className={`p-2 border rounded ${
                        selectedSlotId === slot._id
                          ? "bg-green-500 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      {new Date(slot.start).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" - "}
                      {new Date(slot.end).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {slot.isBooked && " (Booked)"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ================= FORM ================= */}
            <input
              placeholder="Patient Name"
              className="border p-2 w-full mb-2"
              value={form.pationtName}
              onChange={(e) =>
                setForm({ ...form, pationtName: e.target.value })
              }
            />

            <input
              placeholder="Mobile"
              className="border p-2 w-full mb-2"
              value={form.mobileNumber}
              onChange={(e) =>
                setForm({ ...form, mobileNumber: e.target.value })
              }
            />

            <input
              placeholder="Age"
              className="border p-2 w-full mb-2"
              value={form.age}
              onChange={(e) =>
                setForm({ ...form, age: e.target.value })
              }
            />

            {/* ================= BUTTONS ================= */}
            <div className="flex gap-2 mt-4">

              <button
                onClick={bookAppointment}
                className="bg-green-500 text-white px-4 py-2 rounded-xl"
              >
                Book
              </button>

              <button
                onClick={() => setSelectedAppointment(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-xl"
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

export default Appointments;