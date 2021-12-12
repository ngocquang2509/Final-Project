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
                <a href="/invoices" className="nav-link">
                  <FaFileInvoiceDollar size={100} />{" "}
                  <span className="link-text">Invoices</span>
                </a>
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
