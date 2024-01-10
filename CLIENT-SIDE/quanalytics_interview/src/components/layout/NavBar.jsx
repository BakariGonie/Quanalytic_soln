import React from "react";
import { Link, NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary px-5 shadow mt-5 sticky-top">
      <div className="container-fluid">
        <Link to={"/"} className="navbar-brand">
          <span className="patient-color">Home</span>
        </Link>

        <div className="d-flex flex-grow-1">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                className="nav-link"
                aria-current="page"
                to={"/patient-list"}
              >
                Patient List
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to={"/patient-Visit"}>
                Patient Visits
              </NavLink>
            </li>
          </ul>

          <div className="ms-auto">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to={"/patient-visit-report"}>
                  Patient Report
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
