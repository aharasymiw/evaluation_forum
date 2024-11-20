import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { HTMLAttributes, ReactNode, useState } from 'react';
import "./NavBar.css"

const NavBar = () => {

  const [menuIsActive, setMenuIsActive] = useState(false);
  
  // Close the menu bar if the screen is resized.
  window.addEventListener('resize', () => {setMenuIsActive(false)})

  return (
    <nav className="nav">

      {/* Logo */}
      <Link to={`/`} className="link site-title">GrokThings</Link>

      {/* Hamburger Menu */}
      <div className={"toggle-button"} onClick={() => setMenuIsActive(!menuIsActive)}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      {/* Navbar Links */}
      <div className={`navbar-links ${menuIsActive ? "active" : ""}`}>
        <ul>
          <CustomLink to="register" onClick={() => setMenuIsActive(false)}>Register</CustomLink>
          <CustomLink to="login" onClick={() => setMenuIsActive(false)}>Login</CustomLink>
          <CustomLink to="upload" onClick={() => setMenuIsActive(false)}>Upload</CustomLink>
          <CustomLink to="results" onClick={() => setMenuIsActive(false)}>Results</CustomLink>
        </ul>
      </div>

    </nav>);
};

// Custom component wraper that lets me monitor and style which "link" active.
interface CustomLinkProps extends HTMLAttributes<HTMLLIElement> {
  to: string;
  children: ReactNode;
}

function CustomLink({ to, children, ...props }: CustomLinkProps) {
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
