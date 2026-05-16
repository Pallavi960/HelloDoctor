import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginUser = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleData(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      alert(data.message);

      if (data.success) {
        navigate("/admin-dashboard");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-blue-200 to-indigo-200 p-6 transition-all duration-500">

      {/* Main Container */}
      <div className="flex w-full max-w-5xl overflow-hidden bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl border border-white/40">

        {/* ================= LEFT SIDE ================= */}
        <div className="hidden md:flex flex-col justify-center w-1/2 p-12 bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-600 text-white relative">

          {/* Soft overlay for smoothness */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

          <div className="relative z-10">
            <h1 className="text-4xl font-bold leading-tight tracking-wide">
              Welcome Back
            </h1>

            <p className="mt-6 text-lg opacity-90">
              Access your appointments, connect with trusted doctors,
              and manage your health smoothly and securely.
            </p>

            <div className="w-16 h-1 mt-8 bg-white rounded-full opacity-80"></div>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex flex-col justify-center w-full p-10 md:w-1/2">

          <h2 className="mb-8 text-3xl font-semibold text-center text-gray-700">
            User Login
          </h2>

          <form onSubmit={handleData} className="space-y-6">

            {/* Email Input */}
            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
            />

            {/* Password Input */}
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
            />

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl shadow-md hover:shadow-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-300"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Register Link */}
            <p className="text-sm text-center text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/userRegister"
                className="font-semibold text-blue-600 hover:text-blue-800 transition"
              >
                Register
              </Link>
            </p>

          </form>
        </div>

      </div>
    </div>
  );
};

export default LoginUser;
