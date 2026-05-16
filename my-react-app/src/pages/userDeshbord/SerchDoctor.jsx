import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const SerchDoctor = () => {

    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [allDoctors, setAllDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [msg, setMessage] = useState("");

    // GET ALL DOCTORS

    async function getAllDoctors() {

        try {

            const data = await fetch(
                "http://localhost:8000/user/all-doctors",
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            if (data.status === 401) {

                navigate("/user-login");
                return;

            }

            const result = await data.json();

            console.log(result);

            if (result.data) {

                setAllDoctors(result.data);
                setFilteredDoctors(result.data);

            } else {

                setAllDoctors([]);
                setFilteredDoctors([]);

            }

        }

        catch (error) {

            console.log(error);

        }

    }

    useEffect(() => {

        getAllDoctors();

    }, []);


    // SEARCH DOCTOR

    function handleSearch(e) {

        const value = e.target.value;

        setSearch(value);

        if (value.trim() === "") {

            setFilteredDoctors(allDoctors);
            setMessage("");
            return;

        }

        const filtered = allDoctors.filter((doctor) =>

            doctor.name.toLowerCase().includes(value.toLowerCase()) ||
            doctor.spelization.toLowerCase().includes(value.toLowerCase())

        );

        setFilteredDoctors(filtered);

        if (filtered.length === 0) {

            setMessage("No doctor found!");

        } else {

            setMessage("");

        }

    }

    return (

        <div className='min-h-screen bg-gray-100'>

            {/* NAVBAR */}

            <div className='flex flex-row items-center h-12 text-center shadow-lg bg-sky-500 justify-evenly text-amber-50'>

                <div className='m-2 text-2xl font-bold'>
                    Hello Doctor
                </div>

                <div className='flex flex-row ml-auto space-x-6 font-bold'>

                    <Link
                        to={"/userDeshbord"}
                        className='p-2 m-1 transition-all duration-300 hover:bg-amber-50 hover:text-sky-500 hover:rounded-2xl'
                    >
                        Home
                    </Link>

                    <Link
                        to={"/"}
                        className='p-2 m-1 transition-all duration-300 hover:text-sky-500 hover:bg-amber-50 hover:rounded-2xl'
                    >
                        Profile
                    </Link>

                </div>

            </div>

            {/* SEARCH BAR */}

            <div className='flex items-center justify-center mt-10'>

                <div className='flex items-center p-3 bg-white shadow-xl rounded-2xl'>

                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder='Search by doctor name or specialization'
                        className='w-[500px] h-11 px-4 text-lg border-2 border-gray-300 rounded-xl outline-none focus:border-sky-500'
                    />

                    <button className='w-24 h-11 ml-3 text-lg font-bold bg-sky-600 rounded-xl text-amber-50 hover:bg-sky-500'>

                        Search

                    </button>

                </div>

            </div>

            {/* TABLE */}

            <div className='flex justify-center mt-10 pb-10'>

                <table className='overflow-hidden bg-white shadow-2xl w-[1100px] rounded-2xl'>

                    <thead className='bg-sky-500 text-amber-50'>

                        <tr>

                            <th className="px-4 py-4 text-lg">NAME</th>

                            <th className="px-4 py-4 text-lg">
                                SPECIALIZATION
                            </th>

                            <th className="px-4 py-4 text-lg">
                                EXPERIENCE
                            </th>

                            <th className="px-4 py-4 text-lg">
                                AVAILABLE
                            </th>

                            <th className="px-4 py-4 text-lg">
                                ACTION
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            filteredDoctors.length > 0 ? (

                                filteredDoctors.map((d, index) => (

                                    <tr
                                        key={index}
                                        className='text-gray-700 transition-all duration-300 border-b hover:bg-gray-100'
                                    >

                                        <td className='py-4 text-lg font-semibold text-center'>

                                            Dr. {d.name}

                                        </td>

                                        <td className='py-4 text-lg text-center'>

                                            {d.spelization}

                                        </td>

                                        <td className='py-4 text-lg text-center'>

                                            {d.experience} Years

                                        </td>

                                        <td className='py-4 text-lg font-bold text-center'>

                                            {d.isAvalible ? (
                                                <span className='text-green-600'>
                                                    YES
                                                </span>
                                            ) : (
                                                <span className='text-red-500'>
                                                    NO
                                                </span>
                                            )}

                                        </td>

                                        <td className='py-4 text-center'>

                                            <Link
                                                to={`/book/${d._id}`}
                                                className='px-5 py-2 font-bold transition-all duration-300 bg-green-600 rounded-xl text-amber-50 hover:bg-green-500'
                                            >

                                                BOOK APPOINTMENT

                                            </Link>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan={5}
                                        className='py-10 text-3xl font-bold text-center text-red-500'
                                    >

                                        {msg}

                                    </td>

                                </tr>

                            )
                        }

                    </tbody>

                </table>

            </div>

        </div>

    )

}

export default SerchDoctor