import { createContext, useEffect, useState } from "react";
// import { Outlet } from "react-router-dom";
import { BrowserRouter, Routes, Route } from "react-router";

import axios from 'axios';

import './App.css'

import Header from './routes/Header/Header';
import ErrorPage from './routes/ErrorPage/ErrorPage';

import LandingPage from './routes/LandingPage/LandingPage.jsx';
import Register from './routes/Register/Register.jsx';
import Login from './routes/Login/Login.jsx';
import Upload from './routes/Upload/Upload.jsx';
import Results from './routes/Results/Results.jsx';
import Profile from './routes/Profile/Profile.jsx';
import VerifyEmail from './routes/Register/VerifyEmail.jsx'

export const UserContext = createContext();

function App() {

  const [user, setUser] = useState({
    id: null,
    firstName: null,
    lastName: null,
    username: null,
    email: null,
    photoUrl: null,
    isVerified: false
  });

  useEffect(() => {
    async function preventUnload(event) {
      await axios.post('/api/auth/logout')
        .then(response => {
          setUser({
            id: null,
            firstName: null,
            lastName: null,
            username: null,
            email: null,
            photoUrl: null,
            isVerified: false
          });
          console.log('response.data.message', response.data.message);
        })
        .catch(error => {
          console.log('error', error);
        })
    };

    window.addEventListener('beforeunload', preventUnload);
  }, []);

  return (
    <>
      <BrowserRouter>

        <header>
          <UserContext.Provider value={{ user, setUser }}>
            <Header />
          </UserContext.Provider>
        </header>

        <main>
          <UserContext.Provider value={{ user, setUser }}>

            <Routes>

              <Route path="/" element={<LandingPage />} />

              {/* If the user is not logged in, show the register page, otherwise show the landing page */}
              <Route path="register" element={!user.id ? <Register /> : <LandingPage />} />

              {/* If the user is not logged in, show the login page, otherwise show the landing page */}
              <Route path="login" element={!user.id ? <Login /> : <LandingPage />} />

              {/* If the user is not logged in, show the login page.  If they are logged in, but not verified, show the verification page.  Otherwise, show the landing page. */}
              <Route path="verify-email" element={!user.id ? <Login /> : (!user.isVerified ? <VerifyEmail /> : <LandingPage />)} />

              {/* If the user is verified,  in, show the login page, otherwise show the landing page */}
              <Route path="upload" element={user.isVerified ? <Upload /> : <Login />} />

              <Route path="results" element={user.isVerified ? <Results /> : <Login />} />

              <Route path="profile" element={user.isVerified ? <Profile /> : <Login />} />

            </Routes>
          </UserContext.Provider>

        </main>
      </BrowserRouter>

    </>
  )
}

export default App
