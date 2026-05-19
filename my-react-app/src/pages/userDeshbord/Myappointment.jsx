import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/Hello_Doctor_logo.png";

const Myappointment = () => {

  const navigate = useNavigate();

  const [appointment, setAppointment] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function collectData() {

    try {

      setLoading(true);

      // GET USER APPOINTMENTS

      const data = await fetch(
        "http://localhost:8000/user/user-appointment",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (data.status === 401) {

        navigate("/user-login");
        return;

      }

      const result = await data.json();

      console.log("appointment result:", result);

      if (!result.data || result.data.length === 0) {

        setAppointment([]);
        setMessage("No Appointment Found!");
        return;

      }

      // GET DOCTOR NAME USING ID

      const updatedAppointments = await Promise.all(

        result.data.map(async (item) => {

          try {

            console.log("doctor id is:", item.doctorId);

            const doctorData = await fetch(
              `http://localhost:8000/user/getDoctorByid/${item.doctorId}`,
              {
                method: "GET",
                credentials: "include",
              }
            );

            const doctorResult = await doctorData.json();

            console.log("doctor api result:", doctorResult);

            const doctorName =
              doctorResult?.data?.name ||
              doctorResult?.getDoctor?.name ||
              doctorResult?.doctor?.name ||
              "Unknown";

            return {

              ...item,
              doctorName: doctorName,

            };

          }

          catch (error) {

            console.log(error);

            return {

              ...item,
              doctorName: "Unknown",

            };

          }

        })

      );

      console.log(updatedAppointments);

      setAppointment(updatedAppointments);

    }

    catch (error) {

      console.log("something went wrong!", error);

    }

    finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    collectData();

  }, []);

  return (

    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}

      <div className="flex flex-row items-center h-16 px-4 text-center shadow-lg bg-sky-400 justify-between text-amber-50">

        {/* LOGO */}

        <div className="flex items-center gap-3 m-2">

          <img
            src={logo}
            alt="Hello Doctor Logo"
            className="object-contain w-45 h-35 rounded-full"
          />

        </div>

        {/* NAV LINKS */}

        <div className="flex flex-row ml-auto space-x-4 font-bold">

          <Link
            to="/userDeshbord"
            className="p-2 transition-all duration-300 hover:bg-amber-50 hover:text-sky-500 hover:rounded-2xl"
          >
            Home
          </Link>

          <Link
            to="/"
            className="p-2 transition-all duration-300 hover:bg-amber-50 hover:text-sky-500 hover:rounded-2xl"
          >
            Profile
          </Link>

        </div>

      </div>

      {/* TITLE */}

      <div className="mt-8">

        <h1 className="text-4xl font-bold text-center text-sky-600">

          My Appointments

        </h1>

      </div>

      {/* TABLE */}

      <div className="flex justify-center px-5 mt-10 pb-10">

        <table className="overflow-hidden bg-white shadow-2xl w-[1200px] rounded-3xl">

          <thead className="bg-sky-500 text-amber-50">

            <tr>

              <th className="px-4 py-4 text-lg">
                Doctor Name
              </th>

              <th className="px-4 py-4 text-lg">
                Day
              </th>

              <th className="px-4 py-4 text-lg">
                Start Time
              </th>

              <th className="px-4 py-4 text-lg">
                End Time
              </th>

              <th className="px-4 py-4 text-lg">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {
              loading ? (

                <tr>

                  <td
                    colSpan={5}
                    className="py-10 text-3xl font-bold text-center text-sky-600"
                  >

                    Loading...

                  </td>

                </tr>

              ) : appointment.length > 0 ? (

                appointment.map((d, index) => (

                  <tr
                    key={index}
                    className="transition-all duration-300 border-b text-neutral-700 hover:bg-gray-100"
                  >

                    <td className="py-4 text-lg font-semibold text-center">

                      Dr. {d.doctorName}

                    </td>

                    <td className="py-4 text-lg text-center">

                      {
                        d.day
                          ? new Date(d.day).toLocaleDateString()
                          : "N/A"
                      }

                    </td>

                    <td className="py-4 text-lg text-center">

                      {
                        d.start
                          ? new Date(d.start).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"
                      }

                    </td>

                    <td className="py-4 text-lg text-center">

                      {
                        d.end
                          ? new Date(d.end).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"
                      }

                    </td>

                    <td className="py-4 text-lg font-bold text-center">

                      <span
                        className={`px-4 py-2 rounded-xl text-white
                        
                        ${d.status === "pending"
                          ? "bg-yellow-500"
                          : d.status === "approved"
                          ? "bg-blue-500"
                          : d.status === "completed"
                          ? "bg-green-600"
                          : d.status === "rejected"
                          ? "bg-red-500"
                          : "bg-gray-500"
                        }`}
                      >

                        {d.status}

                      </span>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan={5}
                    className="py-10 text-3xl font-bold text-center text-red-500"
                  >

                    {message}

                  </td>

                </tr>

              )
            }

          </tbody>

        </table>

      </div>

    </div>

  );

};

export default Myappointment;
``