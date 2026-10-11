import { API_URL, apiFetch } from "../../config/api.js";
import React, { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ================= FETCH FEEDBACKS =================

  async function collectData() {
    try {
      setLoading(true);

      const res = await apiFetch(API_URL + '/admin/get-feedback', {
        credentials: "include",
      });

      const data = await res.json();

      console.log("feedback data:", data);

      if (!data.data || data.data.length === 0) {
        setFeedbacks([]);
        setMessage(data.message || "No feedback found");
        return;
      }

      // GET USER DETAILS FOR EACH FEEDBACK USING userId
      const enriched = await Promise.all(
        data.data.map(async (item) => {
          try {
            const userRes = await apiFetch(
              `${API_URL}/admin/getUserById/${item.userId}`,
              { credentials: "include" }
            );

            const userData = await userRes.json();

            console.log("user data:", userData);

            const userName =
              userData?.data?.name ||
              userData?.user?.name ||
              userData?.getUser?.name ||
              "Unknown";

            const userEmail =
              userData?.data?.email ||
              userData?.user?.email ||
              userData?.getUser?.email ||
              "Unknown";

            return { ...item, userName, userEmail };
          } catch (err) {
            console.log(err);
            return { ...item, userName: "Unknown", userEmail: "Unknown" };
          }
        })
      );

      setFeedbacks(enriched);
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    collectData();
  }, []);

  // ================= STAR RENDER =================

  function renderStars(count) {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-xl ${i < count ? "text-yellow-400" : "text-gray-300"}`}
      >
        ★
      </span>
    ));
  }

  // ================= STAR BG COLOR =================

  function cardBorder(star) {
    if (star >= 5) return "border-l-green-500";
    if (star >= 4) return "border-l-blue-500";
    if (star >= 3) return "border-l-yellow-400";
    if (star >= 2) return "border-l-orange-400";
    return "border-l-red-500";
  }

  // ================= AVATAR LETTER =================

  function getAvatar(name) {
    return name?.charAt(0)?.toUpperCase() || "U";
  }

  // ================= AVATAR BG COLOR =================

  function avatarColor(name) {
    const colors = [
      "bg-sky-500",
      "bg-purple-500",
      "bg-green-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-red-500",
    ];
    const index = name?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  }

  // ================= CONTACT HANDLER =================

  function handleContact(email, name) {
    const subject = encodeURIComponent("Regarding Your Feedback - Hello Doctor");
    const body = encodeURIComponent(
      `Dear ${name},\n\nThank you for your valuable feedback.\n\nWe have received your review and would like to get in touch with you regarding your experience.\n\nBest Regards,\nHello Doctor Admin Team`
    );
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      <AdminSidebar active="feedback" />

      <div className="flex-1 overflow-y-auto p-5">

        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow-md p-5 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-sky-500">
            Feedback Management
          </h1>

          <div className="px-5 py-2 font-bold rounded-2xl bg-sky-100 text-sky-600">
            Total : {feedbacks.length}
          </div>
        </div>

        {/* CONTENT */}
        <div className="mt-6">

          {loading ? (
            <div className="bg-white rounded-3xl shadow-md p-10 text-center">
              <p className="text-2xl font-bold text-gray-600">
                Loading...
              </p>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-md py-24 text-center">
              <p className="text-2xl font-extrabold text-gray-700">
                No Feedback Found
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {message}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

              {feedbacks.map((f, index) => (

                <div
                  key={index}
                  className={`bg-white rounded-3xl shadow-md p-5 border-l-[6px] ${cardBorder(f.star)} hover:shadow-xl transition-all duration-300`}
                >

                  {/* TOP ROW — AVATAR + NAME + DATE */}
                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      {/* AVATAR */}
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-bold ${avatarColor(f.userName)}`}
                      >
                        {getAvatar(f.userName)}
                      </div>

                      {/* NAME + EMAIL */}
                      <div>
                        <p className="font-bold text-gray-800 text-[16px]">
                          {f.userName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {f.userEmail}
                        </p>
                      </div>

                    </div>

                    {/* DATE */}
                    <div className="text-xs text-gray-400 font-medium text-right">
                      {new Date(f.createdAt).toLocaleDateString()}
                    </div>

                  </div>

                  {/* STARS */}
                  <div className="flex items-center gap-1 mt-4">
                    {renderStars(f.star)}
                    <span className="ml-2 text-sm font-bold text-gray-500">
                      {f.star} / 5
                    </span>
                  </div>

                  {/* MESSAGE */}
                  <div className="mt-3 bg-gray-50 rounded-2xl p-4">
                    <p className="text-gray-600 text-sm leading-6">
                      "{f.message}"
                    </p>
                  </div>

                  {/* CONTACT BUTTON */}
                  <button
                    onClick={() => handleContact(f.userEmail, f.userName)}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-2xl transition-all duration-300"
                  >
                    ✉ Contact User
                  </button>

                </div>

              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Feedback;