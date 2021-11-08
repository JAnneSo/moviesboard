import React from "react";
import { NavLink, Link } from "react-router-dom";

const Navigation = () => {
  return (
    <div className="nav-ctnr">
      <Link exact="true" to="/">
        Logo
      </Link>
      <nav className="navigation">
        <NavLink
          exact="true"
          to="/"
          className={({ isActive }) =>
            "nav-link" + (isActive ? " nav-active" : "")
          }
        >
          Accueil
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
    </div>
  );
};

export default Navigation;
