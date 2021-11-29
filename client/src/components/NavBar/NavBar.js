import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { FaBoxOpen, FaUserAlt, FaFileInvoiceDollar, FaChartPie, FaPlusCircle,FaLayerGroup,FaUserPlus } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { signup, signin } from '../../actions/auth'
import logo from '../../assets/logo.png'

const NavBar = () => {
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [location]);

  if (!user) return null;

  return (
    <div>
      <nav className="navbar">
        <ul className="navbar-nav">
          <li className="logo">
            <Link href="/dashboard" className="nav-link">
              <span className="link-text logo-text">
                <img
                  style={{ width: "80px" }}
                  src={logo}
                  alt="nq warehouse management"
                />
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-arrow-right"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">
              <FaChartPie size={100} />{" "}
              <span className="link-text">Dashboard</span>
            </Link>
          </li>

          {user?.result?.role === "Employee" && (
            <>
              {" "}
              <li className="nav-item">
                <a href="/invoice" className="nav-link">
                  <FaPlusCircle size={100} />{" "}
                  <span className="link-text">Create</span>
                </a>
              </li>
              <li className="nav-item">
                <Link to="/invoices" className="nav-link">
                  <FaFileInvoiceDollar size={100} />{" "}
                  <span className="link-text">Invoices</span>
                </Link>
              </li>
              <li className="nav-item">
            <Link to="/customers" className="nav-link">
              <FaUserAlt size={100} />
              <span className="link-text">Customers</span>
            </Link>
          </li>
            </>
          )}
         
          {user?.result?.role === "Admin" && (
            <>
              <li className="nav-item">
                <Link to="/products" className="nav-link">
                  <FaBoxOpen size={100} />
                  <span className="link-text">Product</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/categories" className="nav-link">
                  <FaLayerGroup size={100} />
                  <span className="link-text">Categories</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/create" className="nav-link">
                  <FaUserPlus size={100} />
                  <span className="link-text">Create Account</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/employee" className="nav-link">
                  <FaUserAlt size={100} />
                  <span className="link-text">All Employee</span>
                </Link>
              </li>
            </>
          )}

          {/* <li className="nav-item">
      <a href="#" className="nav-link">
        <svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="space-shuttle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="svg-inline--fa fa-space-shuttle fa-w-20 fa-5x">
          <g className="fa-group">
            <path fill="currentColor" d="M32 416c0 35.35 21.49 64 48 64h16V352H32zm154.54-232h280.13L376 168C243 140.59 222.45 51.22 128 34.65V160h18.34a45.62 45.62 0 0 1 40.2 24zM32 96v64h64V32H80c-26.51 0-48 28.65-48 64zm114.34 256H128v125.35C222.45 460.78 243 371.41 376 344l90.67-16H186.54a45.62 45.62 0 0 1-40.2 24z" className="fa-secondary" />
            <path fill="currentColor" d="M592.6 208.24C559.73 192.84 515.78 184 472 184H186.54a45.62 45.62 0 0 0-40.2-24H32c-23.2 0-32 10-32 24v144c0 14 8.82 24 32 24h114.34a45.62 45.62 0 0 0 40.2-24H472c43.78 0 87.73-8.84 120.6-24.24C622.28 289.84 640 272 640 256s-17.72-33.84-47.4-47.76zM488 296a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8c31.91 0 31.94 80 0 80z" className="fa-primary" />
          </g>
        </svg>
        <span className="link-text">Shuttle</span>
      </a>
    </li> */}
          <li className="nav-item" id="themeButton">
            <Link to="/settings" className="nav-link">
              <IoIosSettings size={100} />
              <span className="link-text">Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
