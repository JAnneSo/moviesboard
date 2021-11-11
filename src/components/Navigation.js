import React from "react";
import { NavLink, Link } from "react-router-dom";

const Navigation = ({ dark }) => {
  return (
    <header>
      {dark && (
        <Link exact="true" to="/">
          <img className="logo-desktop" src="/icons/logo_colored.svg" alt="" />
          <img
            className="logo-mobile"
            src="/icons/logo_icon_colored.svg"
            alt=""
          />
        </Link>
      )}
      {!dark && (
        <Link exact="true" to="/">
          <img className="logo-desktop" src="/icons/logo_white.svg" alt="" />
          <img
            className="logo-mobile"
            src="/icons/logo_icon_white.svg"
            alt=""
          />
        </Link>
      )}
      <nav className="navigation">
        <NavLink
          exact="true"
          to="/"
          className={({ isActive }) =>
            "nav-link" + (isActive ? " nav-active" : "")
          }
        >
          Ma bibliothèque
        </NavLink>
        <NavLink
          exact="true"
          to="/add"
          className={({ isActive }) =>
            "nav-link" + (isActive ? " nav-active" : "")
          }
        >
          Ajouter un film
        </NavLink>
      </nav>
    </header>
  );
};

export default Navigation;
