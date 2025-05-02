import { useContext, useState } from 'react';
import { Link, useMatch, useNavigate, useResolvedPath } from "react-router-dom";
import axios from "axios";

import "./NavBar.css"
import { UserContext } from '../../App';

const NavBar = () => {

  let navigate = useNavigate();

  const { user, setUser } = useContext(UserContext);

  const [menuIsActive, setMenuIsActive] = useState(false);

  // Close the menu bar if the screen is resized.
  window.addEventListener('resize', () => { setMenuIsActive(false) })

  function logout() {
    axios.post('/api/auth/logout')
      .then(response => {

        console.log('Logout response', response.data);

        setUser({
          id: null,
          firstName: null,
          lastName: null,
          username: null,
          email: null,
          photoUrl: null,
          isVerified: false
        });

        console.log('Successfully logged out', response.data.message);

        navigate("/");
      })
      .catch(error => {
        console.log('Error logging out', error);
        alert("Error logging out.  Please try again.  If the problem persists, please contact support.")
      })
  }

  function dark() {
    document.body.classList.toggle("dark");
  }

  function OptionsList() {
    if (user.isVerified) {
      return (
        <ul>
          <CustomLink to="upload" onClick={() => setMenuIsActive(false)}>Upload</CustomLink>
          <CustomLink to="results" onClick={() => setMenuIsActive(false)}>Results</CustomLink>
          <CustomLink to="profile" onClick={() => setMenuIsActive(false)}>Profile</CustomLink>
          <CustomLink to="login" onClick={() => { setMenuIsActive(false); logout(); }}>Logout</CustomLink>
        </ul>
      );
    } else if (!user.id) {
      return (
        <ul>
          <CustomLink to="register" onClick={() => setMenuIsActive(false)}>Register</CustomLink>
          <CustomLink to="login" onClick={() => setMenuIsActive(false)}>Login</CustomLink>
        </ul>
      );
    } else {
      return (
        <ul>
          <CustomLink to="verify-email" onClick={() => setMenuIsActive(false)}>Verify Email</CustomLink>
          <CustomLink to="login" onClick={() => { setMenuIsActive(false); logout(); }}>Logout</CustomLink>
        </ul>
      );
    }
  }
  return (
    <nav className="nav">

      {/* Logo */}
      <Link to={`/`} className="link site-title">Evaluation Forum</Link>

      <svg onClick={() => { dark() }} id="dark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path
          d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" />
      </svg>

      {/* Hamburger Menu */}
      <div className={"toggle-button"} onClick={() => setMenuIsActive(!menuIsActive)}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      {/* Navbar Links */}
      <div className={`navbar-links ${menuIsActive ? "active" : ""}`}>
        <OptionsList />
      </div>

    </nav>);
};

function CustomLink({ to, children, ...props }) {
  // converts relative paths to absolute
  const resolvedPath = useResolvedPath(to);
  // end: true, ensures exact match
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? "active" : ""} {...props}>
      <Link to={to} className="link">
        {children}
      </Link>
    </li>
  )
};

export default NavBar;
