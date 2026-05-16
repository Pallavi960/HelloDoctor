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
      const res = await fetch("http://localhost:8000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      alert(data.message);

      if (data.success) {
        navigate("/userDeshbord");
      }

    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-5">

      {/* MAIN CONTAINER */}

      <div className="flex w-full max-w-5xl overflow-hidden bg-white border border-slate-200 shadow-2xl rounded-3xl">

        {/* LEFT SIDE */}

        <div className="hidden md:flex flex-col justify-center w-1/2 bg-sky-500 text-white p-12 relative">

          <div>

            <h1 className="text-5xl font-bold leading-tight">
              Hello Doctor
            </h1>

            <p className="mt-6 text-lg leading-8 text-white/90">

              Welcome back to your healthcare platform.
              Manage appointments, connect with trusted doctors,
              and access healthcare services easily and securely.

            </p>

            <div className="w-20 h-1 mt-8 bg-white rounded-full"></div>

            {/* IMAGE */}

            <img
              src="https://entranttechnologies.com/img/doctor_appointment_app_img.png"
              alt="doctor"
              className="object-contain mt-10 rounded-2xl shadow-xl h-72"
            />

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="flex flex-col justify-center w-full p-10 md:w-1/2">

          <h2 className="mb-2 text-4xl font-bold text-center text-sky-600">
            User Login
          </h2>

          <p className="mb-8 text-sm text-center text-gray-500">
            Login to continue your healthcare journey
          </p>

          <form
            onSubmit={handleData}
            className="space-y-5"
          >

            {/* EMAIL */}

            <div>

              <label className="block mb-2 text-sm font-semibold text-gray-600">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-sky-500"
              />

            </div>

            {/* PASSWORD */}

            <div>

              <label className="block mb-2 text-sm font-semibold text-gray-600">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-sky-500"
              />

            </div>

            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-3 text-lg font-bold text-white transition-all duration-300 rounded-xl bg-cyan-500 hover:bg-cyan-600"
            >

              {loading ? "Logging in..." : "Login"}

            </button>

            {/* REGISTER */}

            <p className="pt-3 text-sm text-center text-gray-600">

              Don’t have an account?{" "}

              <Link
                to="/userRegister"
                className="font-bold text-sky-600 hover:text-sky-800"
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