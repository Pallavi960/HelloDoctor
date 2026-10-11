import { useState } from 'react'
import viteLogo from '/vite.svg'
import Registeruser from './pages/userDeshbord/Registeruser'
import RegisterDoctor from './pages/doctorDeshbord/RegisterDoctor'
import SerchDoctor from './pages/userDeshbord/SerchDoctor'
import Role from './pages/Role'
import './index.css';
import {BrowserRouter,Routes,Route} from "react-router-dom"
import User_Deshbord from './pages/userDeshbord/User_Deshbord'
import Doctor_Deshbord from './pages/doctorDeshbord/Doctor_Deshbord'
import LoginUser from './pages/userDeshbord/LoginUser'
import Appointments from './pages/doctorDeshbord/Appointments'
import AddTimeslot from './pages/doctorDeshbord/AddTimeslot'
import Timing from "./pages/doctorDeshbord/Timing"
import Book from './pages/userDeshbord/Book'
import Notification from './pages/doctorDeshbord/Notificatio'
import UserNotification from "./pages/userDeshbord/UserNotification"
import Myappointment from "./pages/userDeshbord/Myappointment"
import Notification_user from './pages/userDeshbord/Notification_user'
import LoginDoctor from './pages/doctorDeshbord/LoginDoctor'
import AdminDeshboard from './pages/Admin/AdminDeshboard'
import AllDoctors from './pages/Admin/AllDoctors'
import MyProfile from './pages/doctorDeshbord/Myprofile'
import AdminLogin from './pages/Admin/Adminlogin'
import AllUsers from './pages/Admin/Allusers'
import Allappointment from './pages/Admin/Allappointment'
import Homepage from './pages/Homepage'
import UserMyProfile from './pages/userDeshbord/UserMyProfile'
import Mymeeting from './pages/userDeshbord/Mymeeting'
import Feedback from './pages/Admin/Feedback'
import Report from './pages/Admin/Report'
function App() {
  
  return (
    <>  
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Homepage/>} />
        <Route  path='/userDeshbord'  element={<User_Deshbord/>}/>
        <Route path='/doctor-login' element={<LoginDoctor/>}/>
        <Route path='/my-profile' element={<MyProfile/>}/>
        <Route  path='/doctorDeshbord' element={<Doctor_Deshbord/>}/>
        <Route  path='/doctor-register' element={<RegisterDoctor/>}/>
        <Route path='/doctorRegister' element={<RegisterDoctor/>} />
        <Route path='/userRegister'element={<Registeruser/>}/>
        <Route path='/Appontments' element={<Appointments/>}/>
        <Route path='/add-slot' element={<AddTimeslot/>}/>
        <Route path='/my-timing' element={<Timing/>}/>
        <Route path='/book/:id' element={<Book/>}/>
        <Route path='/user-login' element={<LoginUser/>} />
        <Route path='/serch-doctor' element={<SerchDoctor/>} />
        <Route path='/notification' element={<Notification/>} />
        <Route path='/user-appointment' element={<Myappointment/>}/>
        <Route path='/notification-user' element={<Notification_user/>} />
        <Route path='/admin-dashboard' element={<AdminDeshboard/>} />
        <Route path='/admin-login' element={<AdminLogin/>} />
        <Route path='/allDoctors' element={<AllDoctors/>}/> 
        <Route path='/allusers' element={<AllUsers/>}/>
        <Route path='/allAppointments' element={<Allappointment/>}/>
        <Route path='/user-my-profile' element={<UserMyProfile/>} />
        <Route path='/user-meeting' element={<Mymeeting/>} />
        <Route  path='/get-feedback' element={<Feedback/>} />
        <Route  path='/get-report' element={<Report/>} />
      </Routes>

      </BrowserRouter>

        {/* <Registeruser/> */}
        {/* <RegisterDoctor/> */}
        {/* <SerchDoctor/> */}
        {/* <Role/> */}

    </>
  )
}

export default App
