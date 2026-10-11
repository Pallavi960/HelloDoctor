import { API_URL, apiFetch } from "../../config/api.js";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/Hello_Doctor_logo.png";

const LoginUser = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleData(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiFetch(API_URL + '/user/login', {
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
    <div className="flex items-center justify-center min-h-screen p-5 bg-slate-100">

      <div className="flex w-full max-w-5xl overflow-hidden bg-white border shadow-2xl border-slate-200 rounded-3xl">

       
        <div className="hidden md:flex flex-col justify-center w-1/2 bg-sky-500 text-white px-10 py-8">

          <div className="flex flex-col items-center text-center">

           

            <img
              src={logo}
              alt="Hello Doctor Logo"
              className="object-contain w-46 h-46 mb-1"
            />

          

            <p className="text-base leading-7 text-white/90 max-w-sm">

              Welcome back to your healthcare platform.
              Manage appointments, connect with trusted doctors,
              and access healthcare services easily and securely.

            </p>

            {/* LINE */}

            <div className="w-20 h-1 mt-4 bg-white rounded-full"></div>

            {/* IMAGE */}

            <img
              src="https://entranttechnologies.com/img/doctor_appointment_app_img.png"
              alt="doctor"
              className="object-contain h-64 mt-5 rounded-2xl shadow-xl"
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