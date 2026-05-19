import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/Hello_Doctor_logo.png";

import { MdFavorite, MdOutlinePersonAdd, MdCalendarMonth } from "react-icons/md";
import { GiBrain, GiToothbrush, GiBoneKnife } from "react-icons/gi";
import { FaBaby, FaEye, FaDna } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { TbStethoscope } from "react-icons/tb";

const Homepage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const specializations = [
    { icon: <MdFavorite size={32} className="text-red-400" />, name: "Cardiologist", desc: "Heart & blood vessels" },
    { icon: <GiBrain size={32} className="text-purple-400" />, name: "Neurologist", desc: "Brain & nervous system" },
    { icon: <GiToothbrush size={32} className="text-blue-400" />, name: "Dentist", desc: "Teeth & oral health" },
    { icon: <FaBaby size={32} className="text-pink-400" />, name: "Pediatrician", desc: "Children's health" },
    { icon: <GiBoneKnife size={32} className="text-slate-400" />, name: "Orthopedic", desc: "Bones & joints" },
    { icon: <FaEye size={32} className="text-cyan-500" />, name: "Ophthalmologist", desc: "Eyes & vision" },
    { icon: <TbStethoscope size={32} className="text-sky-500" />, name: "General Physician", desc: "Primary care" },
    { icon: <FaDna size={32} className="text-green-400" />, name: "Dermatologist", desc: "Skin & hair" },
  ];

  const steps = [
    {
      num: "01",
      icon: <MdOutlinePersonAdd size={34} className="text-sky-500" />,
      title: "Create Account",
      desc: "Sign up as a patient in seconds — no hassle, no paperwork.",
    },
    {
      num: "02",
      icon: <FaMagnifyingGlass size={30} className="text-sky-500" />,
      title: "Find a Doctor",
      desc: "Search verified doctors by specialization or name.",
    },
    {
      num: "03",
      icon: <MdCalendarMonth size={34} className="text-sky-500" />,
      title: "Book Appointment",
      desc: "Pick a time slot and confirm your visit instantly.",
    },
  ];

  const stats = [
    { num: "500+", label: "Verified Doctors" },
    { num: "10K+", label: "Happy Patients" },
    { num: "20+", label: "Specializations" },
    { num: "98%", label: "Satisfaction Rate" },
  ];

  const doctorFeatures = [
    "✅ Verified badge on your profile",
    "✅ Manage appointments easily",
    "✅ Set your own availability slots",
    "✅ Reach thousands of patients",
  ];

  return (
    <div className="font-sans bg-gray-100 min-h-screen overflow-x-hidden">

      {/* NAVBAR */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 px-10 h-16 flex items-center justify-between ${
          scrolled ? "bg-white shadow-md" : "bg-gradient-to-r from-cyan-400 to-sky-500"
        }`}
      >
        <img
          src={logo}
          alt="Hello Doctor Logo"
          className="object-contain w-45 h-35 rounded-full"
        />
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/user-login")}
            className={`font-bold text-sm px-5 py-2 rounded-full border-2 transition-all ${
              scrolled
                ? "border-sky-500 text-sky-600 hover:bg-sky-50"
                : "border-white text-white hover:bg-white/20"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => navigate("/userRegister")}
            className="bg-red-500 hover:bg-red-600 text-white font-bold text-sm px-6 py-2.5 rounded-full shadow-md transition-all hover:scale-105"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-gray-100 flex items-center px-16 py-14 gap-14 min-h-[520px]">
        <div
          className={`flex-1 max-w-[580px] transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="bg-white rounded-2xl p-5 shadow-md">
            <img
              src="https://precare.ca/wp-content/uploads/2023/05/How-Can-Digital-Patient-Educatio.webp"
              alt="Digital Patient Care"
              className="w-full h-[340px] object-cover rounded-xl"
            />
          </div>
        </div>

        <div
          className={`flex-1 flex flex-col gap-5 transition-all duration-700 delay-150 ${
            visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          }`}
        >
          <div className="bg-blue-100 rounded-2xl px-8 py-6 shadow-sm">
            <h1 className="text-2xl font-extrabold text-blue-900 text-center mb-2">
              Welcome To Hello Doctor
            </h1>
            <p className="text-slate-600 text-center text-[15px] leading-relaxed">
              Find trusted doctors, book appointments instantly and manage your
              healthcare services easily from one platform.
            </p>
          </div>

          <div className="bg-white rounded-2xl px-8 py-6 shadow-sm border border-slate-100">
            <p className="text-slate-600 text-[15px] leading-relaxed text-center">
              Our healthcare management system helps patients connect with
              experienced doctors from different specializations. You can search
              doctors, view available timings, book appointments and manage
              everything from your dashboard.{" "}
              <span className="font-semibold text-slate-700">
                Fast, secure and easy appointment booking for all users.
              </span>
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/userRegister")}
              className="flex-1 bg-gradient-to-r from-cyan-400 to-sky-500 text-white font-extrabold text-base py-3.5 rounded-xl shadow-md hover:scale-105 transition-all"
            >
              Find a Doctor
            </button>
            <button
              onClick={() => navigate("/doctorRegister")}
              className="flex-1 bg-white text-sky-600 border-2 border-sky-400 font-extrabold text-base py-3.5 rounded-xl hover:bg-sky-50 transition-all"
            >
              Join as Doctor
            </button>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-gradient-to-r from-cyan-400 to-sky-500 py-7 px-16 flex justify-around items-center">
        {stats.map((s, i) => (
          <div key={i} className="flex items-center gap-10">
            <div className="text-center text-white">
              <div className="text-3xl font-black">{s.num}</div>
              <div className="text-sm opacity-85 font-medium mt-0.5">{s.label}</div>
            </div>
            {i < stats.length - 1 && <div className="w-px h-10 bg-white/30" />}
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gray-100 py-16 px-16">
        <div className="bg-gradient-to-r from-cyan-400 to-sky-500 rounded-xl px-8 py-4 mb-10 flex items-center justify-between">
          <h2 className="text-white text-xl font-extrabold">How It Works</h2>
          <span className="text-white/80 text-sm font-medium">3 simple steps to get started</span>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <span className="absolute top-3 right-4 text-6xl font-black text-sky-50 leading-none select-none">
                {s.num}
              </span>
              <div className="mb-4">{s.icon}</div>
              <h3 className="text-base font-extrabold text-slate-800 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SPECIALIZATIONS */}
      <section className="bg-white py-16 px-16">
        <div className="bg-gradient-to-r from-cyan-400 to-sky-500 rounded-xl px-8 py-4 mb-10 flex items-center justify-between">
          <h2 className="text-white text-xl font-extrabold">Our Specializations</h2>
          <button
            onClick={() => navigate("/doctors")}
            className="bg-white/20 hover:bg-white/30 text-white text-sm font-bold px-5 py-1.5 rounded-full transition-all border border-white/30"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-4 gap-5">
          {specializations.map((sp, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-2xl p-6 text-center border-2 border-transparent hover:border-sky-400 hover:bg-sky-50 hover:shadow-md hover:-translate-y-1 transition-all select-none"
            >
              <div className="flex justify-center mb-3">{sp.icon}</div>
              <div className="text-sm font-extrabold text-slate-800 mb-1">{sp.name}</div>
              <div className="text-xs text-slate-400">{sp.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DOCTOR CTA */}
      <section className="bg-gray-100 py-16 px-16 flex items-center gap-14">
        <div className="flex-1">
          <div className="bg-gradient-to-r from-cyan-400 to-sky-500 rounded-xl px-8 py-4 mb-6 inline-block">
            <h2 className="text-white text-xl font-extrabold">Are You a Doctor?</h2>
          </div>
          <p className="text-slate-600 text-[15px] leading-relaxed max-w-md mb-7">
            Join Hello Doctor and reach thousands of patients. Our admin team
            personally reviews and verifies every doctor before approving their
            profile — ensuring full trust and quality on our platform.
          </p>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => navigate("/doctorRegister")}
              className="bg-gradient-to-r from-cyan-400 to-sky-500 text-white font-extrabold text-sm px-7 py-3.5 rounded-xl shadow-md hover:scale-105 transition-all"
            >
              Apply as Doctor
            </button>
            <button
              onClick={() => navigate("/doctor-login")}
              className="bg-white text-sky-600 border-2 border-sky-400 font-extrabold text-sm px-7 py-3.5 rounded-xl hover:bg-sky-50 transition-all"
            >
              Already Applied? Login
            </button>
          </div>
        </div>

        <div className="flex-1 max-w-sm">
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100">
            <p className="text-slate-800 font-bold text-base mb-5">
              What you get as a Hello Doctor member:
            </p>
            <ul className="space-y-3">
              {doctorFeatures.map((f, i) => (
                <li
                  key={i}
                  className="text-slate-600 text-sm font-medium border-b border-slate-100 pb-3 last:border-0 last:pb-0"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gradient-to-r from-cyan-400 to-sky-500 px-16 py-5 flex items-center justify-between">
        <img src={logo} alt="Hello Doctor" className="h-8 object-contain brightness-200" />
        <p className="text-white/90 text-sm font-medium">
          2026 Hello Doctor. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-white/80 text-sm font-medium hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-white/80 text-sm font-medium hover:text-white transition-colors">
            Terms
          </a>
          <a href="#" className="text-white/80 text-sm font-medium hover:text-white transition-colors">
            Contact
          </a>
        </div>
      </footer>

    </div>
  );
};

export default Homepage;