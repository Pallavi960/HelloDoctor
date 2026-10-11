import { API_URL, apiFetch } from "../../config/api.js";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Book = () => {
  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [age, setAge] = useState("");

  const [loadingSlots, setLoadingSlots] = useState(true);

  function getImageUrl(imagePath) {
    return API_URL + '/' + imagePath.replace(/\\/g, "/");
  }

  async function fetchDoctor() {
    const res = await apiFetch(`${API_URL}/doctor/getDoctorByid/${id}`, {
      credentials: "include",
    });
    const data = await res.json();
    if (data?.data) {
      setDoctor(data.data);
    }
  }

  async function fetchSlots() {
    try {
      setLoadingSlots(true);
      const res = await apiFetch(`${API_URL}/user/getDoctorSlots/${id}`, {
        credentials: "include",
      });
      const result = await res.json();
      setSlots(result?.slots || []);
    } catch (err) {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }

  useEffect(() => {
    fetchDoctor();
    fetchSlots();
  }, [id]);

  async function bookAppointment(e) {
    e.preventDefault();

    if (!selectedSlot) {
      alert("Please select appointment slot");
      return;
    }

    const payload = {
      slotId: selectedSlot,
      pationtName: name,
      mobileNumber: mobile,
      age,
    };

    const res = await apiFetch(API_URL + '/appointment/Book', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    const data = await res.json();
    alert(data.message);

    if (data.message?.toLowerCase().includes("success")) {
      setName("");
      setMobile("");
      setAge("");
      setSelectedSlot("");
      fetchSlots();
    }
  }

  const formatSlot = (slot) => {
    const day = new Date(slot.day).toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const start = new Date(slot.start).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const end = new Date(slot.end).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${day} • ${start} - ${end}`;
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-100">

      {/* NAVBAR */}
      <div className="flex flex-row items-center h-14 px-6 shadow-lg bg-sky-400 text-amber-50">
        <div className="text-3xl font-bold tracking-wide">Hello Doctor</div>
        <div className="flex flex-row ml-auto space-x-5 font-bold">
          <Link
            to={"/serch-doctor"}
            className="p-2 transition-all duration-300 hover:bg-amber-50 hover:text-sky-500 hover:rounded-2xl"
          >
            Search Doctor
          </Link>
          <Link
            to={"/userDeshbord"}
            className="p-2 transition-all duration-300 hover:bg-amber-50 hover:text-sky-500 hover:rounded-2xl"
          >
            Home
          </Link>
        </div>
      </div>

      {/* MAIN SECTION */}
      <div className="flex items-center justify-center h-[calc(100vh-56px)] px-6">
        <div className="grid w-full max-w-7xl grid-cols-2 gap-8">

          {/* LEFT SIDE */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 h-[620px] p-7">
            <h1 className="pb-4 text-3xl font-bold border-b text-sky-600 border-sky-300">
              Doctor Details
            </h1>

            {doctor ? (
              <div className="flex flex-col items-center mt-5">

                {/* IMAGE — only this changed */}
                <img
                  src={
                    doctor.image
                      ? getImageUrl(doctor.image)
                      : "https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg"
                  }
                  alt="doctor"
                  className="object-cover w-36 h-36 border border-gray-300 shadow-md rounded-2xl"
                />

                {/* DETAILS */}
                <div className="w-full mt-7 space-y-5">
                  <div>
                    <p className="mb-1 text-xs font-bold tracking-wider text-gray-400">
                      DOCTOR NAME
                    </p>
                    <p className="text-[18px] font-bold text-gray-800">
                      Dr. {doctor.name}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-bold tracking-wider text-gray-400">
                      SPECIALIZATION
                    </p>
                    <p className="text-[17px] font-medium text-gray-700 capitalize">
                      {doctor.spelization}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-bold tracking-wider text-gray-400">
                      EXPERIENCE
                    </p>
                    <p className="text-[17px] font-medium text-gray-700">
                      {doctor.experience} Years
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-bold tracking-wider text-gray-400">
                      CONSULTATION FEES
                    </p>
                    <p className="text-[17px] font-medium text-gray-700">
                      ₹ {doctor.fees}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-bold tracking-wider text-gray-400">
                      CONTACT NUMBER
                    </p>
                    <p className="text-[17px] font-medium text-gray-700">
                      {doctor.number}
                    </p>
                  </div>
                </div>

              </div>
            ) : (
              <p className="mt-10 text-center text-gray-500">
                Loading doctor details...
              </p>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 h-[620px] p-7 flex flex-col">
            <h1 className="pb-4 text-3xl font-bold border-b text-sky-600 border-sky-300">
              Book Appointment
            </h1>

            {/* INSTRUCTIONS */}
            <div className="mt-5 mb-6 space-y-3">
              <p className="text-[15px] font-semibold text-green-600">
                • Book your appointment securely.
              </p>
              <p className="text-[15px] font-semibold text-green-600">
                • The doctor will approve or reject your appointment request.
              </p>
              <p className="text-[15px] font-semibold text-green-600">
                • You will receive a notification after confirmation.
              </p>
              <p className="text-[15px] font-semibold text-green-600">
                • Best wishes for your appointment and good health.
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={bookAppointment} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Enter Patient Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-sky-500"
              />
              <input
                type="text"
                placeholder="Enter Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="p-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-sky-500"
              />
              <input
                type="text"
                placeholder="Enter Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="p-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-sky-500"
              />
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="p-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-sky-500"
              >
                <option value="">Select Appointment Slot</option>
                {slots.map((slot) => (
                  <option key={slot._id} value={slot._id}>
                    {formatSlot(slot)}
                  </option>
                ))}
              </select>
              <button className="py-3 mt-2 text-lg font-bold transition-all duration-300 bg-cyan-500 rounded-xl hover:bg-cyan-600 text-amber-50">
                Book Appointment
              </button>
            </form>

            {/* STATUS */}
            <div className="mt-auto text-center">
              {loadingSlots ? (
                <p className="text-sm text-gray-500">Loading available slots...</p>
              ) : slots.length === 0 ? (
                <p className="font-semibold text-red-600">No Slots Available</p>
              ) : (
                <p className="text-sm text-gray-500">Select your preferred appointment slot</p>
              )}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Book;