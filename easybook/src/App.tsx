import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Route, Link, Routes, Navigate } from 'react-router-dom';

import Login from './components/login.component';
import SignUp from './components/signup.component';
import Home from './components/home.component';
import MyAppointments from './components/MyAppointment.component';

function App(): JSX.Element {
  const [bookedAppointments, setBookedAppointments] = useState<any[]>([]);
  const [cookies, setCookie, removeCookie] = useCookies(['token']); 

  const isTokenPresent = () => {
    return !!cookies.token;
  };

  const handleLogout = () => {
    removeCookie('token'); 
    return <Navigate to="/sign-in" />;
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <Link className="navbar-brand" to="/home">
              EasyBook
            </Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/home">
                    Home
                  </Link>
                </li>
                {isTokenPresent() ? (
                  <>
                   <li className="nav-item">
                      <Link className="nav-link" to="/my-appointments" >
                        My Appointments
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="#" onClick={handleLogout}>
                        Logout
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/sign-in">
                        Login
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/sign-up">
                        Sign up
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/home" element={<Home bookedAppointments={bookedAppointments} setBookedAppointments={setBookedAppointments} />} />
          <Route path="/my-appointments" element={<MyAppointments bookedAppointments={bookedAppointments} setBookedAppointments={setBookedAppointments} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;