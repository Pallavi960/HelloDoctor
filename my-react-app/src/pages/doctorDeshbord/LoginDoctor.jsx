import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginDoctor = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleData(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/doctor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      alert(data.message);

      if (data.success) {
        navigate("/doctorDeshbord");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-cyan-100 px-6">

      {/* Main Card */}
      <div className="flex w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* ================= LEFT SIDE ================= */}
        <div className="hidden md:flex flex-col justify-between w-1/2 p-12 text-white bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-500">

          <div>
            <p className="text-sm opacity-90">Welcome to</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight">
              Hello Doctor
            </h1>
            <p className="mt-6 text-lg opacity-95">
              A smarter way to manage patients,
              appointments, and healthcare services.
            </p>
          </div>

          <div className="text-sm opacity-80">
            Secure • Fast • Reliable
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex flex-col justify-center w-full md:w-1/2 p-12 bg-white">

          <div className="max-w-md w-full mx-auto">

            <h2 className="text-3xl font-bold text-gray-800">
              Doctor Login
            </h2>

            <p className="mt-2 text-gray-500 text-sm">
              Sign in to your Hello Doctor account
            </p>

            <form onSubmit={handleData} className="mt-8 space-y-6">

              {/* Email */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
                  placeholder="doctor@hellodoctor.com"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <span className="text-sm text-sky-600 cursor-pointer hover:underline">
                    Forgot Password?
                  </span>
                </div>

                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
                  placeholder="Enter your password"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-500 rounded-xl hover:opacity-90 transition duration-300 shadow-md"
              >
                {loading ? "Signing In..." : "Login to Hello Doctor"}
              </button>

            </form>

          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginDoctor;
