import { API_URL, apiFetch } from "../../config/api.js";
import React, { useEffect, useState, useRef } from "react";
import AdminSidebar from "./AdminSidebar";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell as BarCell,
} from "recharts";

const Report = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorReport, setDoctorReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const reportRef = useRef(null);

  // ================= STATS =================

  const total = appointments.length;
  const pending = appointments.filter((a) => a.status === "pending").length;
  const approved = appointments.filter((a) => a.status === "approved").length;
  const completed = appointments.filter((a) => a.status === "completed").length;
  const rejected = appointments.filter((a) => a.status === "rejected").length;

  // ================= PIE DATA =================

  const pieData = [
    { name: "Pending", value: pending, color: "#EAB308" },
    { name: "Approved", value: approved, color: "#3B82F6" },
    { name: "Completed", value: completed, color: "#22C55E" },
    { name: "Rejected", value: rejected, color: "#EF4444" },
  ].filter((d) => d.value > 0);

  // ================= FETCH ALL APPOINTMENTS =================

  async function fetchAppointments() {
    try {
      setLoading(true);

      const res = await apiFetch(
        API_URL + '/admin/getAllappointments',
        { credentials: "include" }
      );

      const data = await res.json();

      const list =
        data?.appointments ||
        data?.allAppointments ||
        data?.data ||
        [];

      setAppointments(list);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // ================= FETCH ALL DOCTORS =================

  async function fetchDoctors() {
    try {
      const res = await apiFetch(
        API_URL + '/admin/getAlldoctors',
        { credentials: "include" }
      );

      const data = await res.json();

      const list =
        data?.doctors ||
        data?.allDoctors ||
        data?.data ||
        [];

      setDoctors(list);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  // ================= GENERATE DOCTOR REPORT =================

  async function generateReport(doctor) {
    try {
      setReportLoading(true);
      setSelectedDoctor(doctor);
      setDoctorReport(null);

      // FETCH ALL APPOINTMENTS AGAIN TO FILTER
      const res = await apiFetch(
        API_URL + '/admin/getAllappointments',
        { credentials: "include" }
      );

      const data = await res.json();

      const list =
        data?.appointments ||
        data?.allAppointments ||
        data?.data ||
        [];

      // FILTER BY DOCTOR ID
      const doctorAppointments = list.filter(
        (a) => a.doctorId === doctor._id
      );

      const reportPending = doctorAppointments.filter((a) => a.status === "pending").length;
      const reportApproved = doctorAppointments.filter((a) => a.status === "approved").length;
      const reportCompleted = doctorAppointments.filter((a) => a.status === "completed").length;
      const reportRejected = doctorAppointments.filter((a) => a.status === "rejected").length;

      setDoctorReport({
        total: doctorAppointments.length,
        pending: reportPending,
        approved: reportApproved,
        completed: reportCompleted,
        rejected: reportRejected,
        appointments: doctorAppointments,
      });

    } catch (error) {
      console.log(error);
    } finally {
      setReportLoading(false);
    }
  }

  // ================= DOWNLOAD REPORT =================

  function handleDownload() {
    if (!selectedDoctor || !doctorReport) return;

    const rows = [
      ["Hello Doctor - Doctor Report"],
      [`Doctor Name: Dr. ${selectedDoctor.name}`],
      [`Specialization: ${selectedDoctor.specialization || "N/A"}`],
      [`Generated On: ${new Date().toLocaleDateString()}`],
      [""],
      ["Summary"],
      ["Total", "Pending", "Approved", "Completed", "Rejected"],
      [
        doctorReport.total,
        doctorReport.pending,
        doctorReport.approved,
        doctorReport.completed,
        doctorReport.rejected,
      ],
      [""],
      ["Appointment Details"],
      ["Patient Name", "Mobile", "Age", "Date", "Status"],
      ...doctorReport.appointments.map((a) => [
        a.pationtName || "N/A",
        a.mobileNumber || "N/A",
        a.age || "N/A",
        a.day ? new Date(a.day).toLocaleDateString() : "N/A",
        a.status || "N/A",
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((r) => r.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Report_Dr_${selectedDoctor.name}_${new Date().toLocaleDateString()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ================= PIE LABEL =================

  function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={13}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  }

  // ================= BAR LABEL =================

  function renderBarLabel({ x, y, width, value }) {
    if (!value) return null;
    return (
      <text
        x={x + width / 2}
        y={y - 6}
        fill="#6B7280"
        textAnchor="middle"
        fontSize={13}
        fontWeight="bold"
      >
        {value}
      </text>
    );
  }

  // ================= DOCTOR AVATAR =================

  function getAvatar(name) {
    return name?.charAt(0)?.toUpperCase() || "D";
  }

  function avatarColor(name) {
    const colors = [
      "bg-sky-500", "bg-purple-500", "bg-green-500",
      "bg-orange-500", "bg-pink-500", "bg-indigo-500",
      "bg-teal-500", "bg-red-500",
    ];
    return colors[name?.charCodeAt(0) % colors.length || 0];
  }

  // ================= STATUS BADGE =================

  function statusBadge(status) {
    const s = (status || "").toLowerCase();
    if (s === "pending") return "bg-yellow-100 text-yellow-600";
    if (s === "approved") return "bg-blue-100 text-blue-600";
    if (s === "completed") return "bg-green-100 text-green-600";
    if (s === "rejected") return "bg-red-100 text-red-600";
    return "bg-gray-100 text-gray-600";
  }

  const barData = doctorReport
    ? [
        { name: "Pending", value: doctorReport.pending, color: "#EAB308" },
        { name: "Approved", value: doctorReport.approved, color: "#3B82F6" },
        { name: "Completed", value: doctorReport.completed, color: "#22C55E" },
        { name: "Rejected", value: doctorReport.rejected, color: "#EF4444" },
      ]
    : [];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      <AdminSidebar active="report" />

      <div className="flex-1 overflow-y-auto p-5">

        {/* ===== HEADER ===== */}
        <div className="bg-white rounded-3xl shadow-md p-5 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-sky-500">
            Reports & Analytics
          </h1>
          <div className="px-5 py-2 font-bold rounded-2xl bg-sky-100 text-sky-600">
            Total Appointments : {total}
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl shadow-md mt-6 p-10 text-center">
            <p className="text-2xl font-bold text-gray-600">Loading...</p>
          </div>
        ) : (
          <>

            {/* ===== STATS CARDS ===== */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { label: "Total", value: total, color: "border-sky-500", text: "text-sky-500" },
                { label: "Pending", value: pending, color: "border-yellow-400", text: "text-yellow-500" },
                { label: "Approved", value: approved, color: "border-blue-500", text: "text-blue-500" },
                { label: "Completed", value: completed, color: "border-green-500", text: "text-green-500" },
              ].map((s, i) => (
                <div
                  key={i}
                  className={`bg-white rounded-3xl shadow-md p-5 text-center border-t-4 ${s.color} hover:shadow-xl transition-all duration-300`}
                >
                  <p className={`text-4xl font-extrabold ${s.text}`}>{s.value}</p>
                  <p className="mt-2 text-sm font-bold text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>

            {/* ===== PIE CHART ===== */}
            {appointments.length > 0 && (
              <div className="bg-white rounded-3xl shadow-md p-6 mt-6">

                <h2 className="text-xl font-bold text-gray-700 mb-1">
                  📊 Overall Appointment Status
                </h2>
                <p className="text-sm text-gray-400 mb-6">
                  Distribution of all appointments by current status
                </p>

                <div className="flex flex-col xl:flex-row items-center gap-8">

                  {/* PIE */}
                  <div className="w-full xl:w-1/2">
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={110}
                          dataKey="value"
                          labelLine={false}
                          label={renderCustomLabel}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [`${value} appointments`, name]}
                          contentStyle={{
                            borderRadius: "12px",
                            border: "none",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            fontSize: "13px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* LEGEND */}
                  <div className="w-full xl:w-1/2 grid grid-cols-1 gap-3">
                    {[
                      { label: "Pending", color: "bg-yellow-400", count: pending, border: "border-yellow-400" },
                      { label: "Approved", color: "bg-blue-500", count: approved, border: "border-blue-500" },
                      { label: "Completed", color: "bg-green-500", count: completed, border: "border-green-500" },
                      { label: "Rejected", color: "bg-red-500", count: rejected, border: "border-red-500" },
                    ].map((s, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between px-5 py-4 bg-gray-50 rounded-2xl border-l-4 ${s.border}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${s.color}`} />
                          <span className="text-sm font-bold text-gray-600">{s.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-extrabold text-gray-700">{s.count}</span>
                          <span className="text-xs text-gray-400 font-medium">
                            {total > 0 ? `${((s.count / total) * 100).toFixed(0)}%` : "0%"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}

            {/* ===== DOCTOR REPORT SECTION ===== */}
            <div className="bg-white rounded-3xl shadow-md p-6 mt-6">

              <h2 className="text-xl font-bold text-gray-700 mb-1">
                👨‍⚕️ Doctor-wise Report
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                Click on a doctor to generate their appointment report
              </p>

              {/* DOCTOR CARDS */}
              {doctors.length === 0 ? (
                <p className="text-center text-gray-400 font-bold py-10">
                  No doctors found
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {doctors.map((doc, i) => (
                    <div
                      key={i}
                      onClick={() => generateReport(doc)}
                      className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer border-2 transition-all duration-300 hover:shadow-md ${
                        selectedDoctor?._id === doc._id
                          ? "border-sky-500 bg-sky-50"
                          : "border-gray-100 bg-gray-50 hover:border-sky-300"
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0 ${avatarColor(doc.name)}`}
                      >
                        {getAvatar(doc.name)}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-gray-700 text-sm truncate">
                          Dr. {doc.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {doc.specialization || "General"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* ===== GENERATED REPORT ===== */}
            {reportLoading && (
              <div className="bg-white rounded-3xl shadow-md mt-6 p-10 text-center">
                <p className="text-xl font-bold text-gray-600">
                  Generating Report...
                </p>
              </div>
            )}

            {!reportLoading && selectedDoctor && doctorReport && (
              <div ref={reportRef} className="bg-white rounded-3xl shadow-md p-6 mt-6">

                {/* REPORT HEADER */}
                <div className="flex items-center justify-between mb-6">

                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-bold ${avatarColor(selectedDoctor.name)}`}
                    >
                      {getAvatar(selectedDoctor.name)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-700">
                        Dr. {selectedDoctor.name}
                      </h2>
                      <p className="text-sm text-gray-400">
                        {selectedDoctor.specialization || "General"} •{" "}
                        {selectedDoctor.email || ""}
                      </p>
                    </div>
                  </div>

                  {/* DOWNLOAD BUTTON */}
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-5 py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-2xl transition-all duration-300"
                  >
                    ⬇️ Download CSV
                  </button>

                </div>

                {/* REPORT STAT CARDS */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                  {[
                    { label: "Total", value: doctorReport.total, color: "text-sky-500", bg: "bg-sky-50", border: "border-sky-400" },
                    { label: "Pending", value: doctorReport.pending, color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-400" },
                    { label: "Approved", value: doctorReport.approved, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-400" },
                    { label: "Completed", value: doctorReport.completed, color: "text-green-500", bg: "bg-green-50", border: "border-green-400" },
                    { label: "Rejected", value: doctorReport.rejected, color: "text-red-500", bg: "bg-red-50", border: "border-red-400" },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className={`${s.bg} border-t-4 ${s.border} rounded-2xl p-4 text-center`}
                    >
                      <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
                      <p className="text-xs font-bold text-gray-500 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* BAR CHART */}
                {doctorReport.total > 0 && (
                  <div className="mb-6">
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart
                        data={barData}
                        margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 12, fontWeight: "bold", fill: "#6B7280" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fontSize: 12, fill: "#6B7280" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "12px",
                            border: "none",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            fontSize: "13px",
                          }}
                          formatter={(value) => [`${value} appointments`]}
                        />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} label={renderBarLabel}>
                          {barData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* APPOINTMENTS TABLE */}
                {doctorReport.total === 0 ? (
                  <div className="py-16 text-center bg-gray-50 rounded-2xl">
                    <p className="text-xl font-extrabold text-gray-500">
                      No Appointments Found
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Dr. {selectedDoctor.name} has no appointments yet
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-separate border-spacing-y-2">
                      <thead className="bg-sky-500 text-white">
                        <tr>
                          <th className="px-4 py-3 rounded-l-xl">#</th>
                          <th className="px-4 py-3">Patient</th>
                          <th className="px-4 py-3">Mobile</th>
                          <th className="px-4 py-3">Age</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3 rounded-r-xl">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {doctorReport.appointments.map((a, index) => (
                          <tr
                            key={index}
                            className="bg-gray-50 text-center hover:bg-gray-100 transition-all duration-300"
                          >
                            <td className="px-4 py-3 font-bold text-gray-400">{index + 1}</td>
                            <td className="px-4 py-3 font-semibold text-gray-700">{a.pationtName || "N/A"}</td>
                            <td className="px-4 py-3 text-gray-600">{a.mobileNumber || "N/A"}</td>
                            <td className="px-4 py-3 text-gray-600">{a.age || "N/A"}</td>
                            <td className="px-4 py-3 text-gray-600">
                              {a.day ? new Date(a.day).toLocaleDateString() : "N/A"}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-3 py-1 rounded-xl text-sm font-bold ${statusBadge(a.status)}`}>
                                {a.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            )}

          </>
        )}

      </div>
    </div>
  );
};

export default Report;