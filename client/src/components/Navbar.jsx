import React, { useContext } from "react";
import logo from "../assets/yella-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logoLink}>
        <img src={logo} alt="Anugraha Super Market" style={styles.logoImg} />
      </Link>

      <div style={styles.links}>
        {!user ? (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        ) : (
          <>
            {user.role === 'customer' && <Link to="/store" style={styles.link}>Store</Link>}
            {(user.role === 'staff' || user.role === 'admin') && <Link to="/staff" style={styles.link}>Staff Panel</Link>}
            {user.role === 'delivery' && <Link to="/delivery" style={styles.link}>Tasks</Link>}
            
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout ({user.name.split(' ')[0]})
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 20px",
    borderBottom: "1px solid #ddd",
    alignItems: "center",
    backgroundColor: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  logoLink: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  },
  logoImg: {
    height: "45px",
    width: "auto",
    display: "block",
  },
  links: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  link: {
    textDecoration: "none",
    color: "#333",
    fontWeight: "500",
  },
  logoutBtn: {
    padding: "6px 12px",
    cursor: "pointer",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontWeight: "500",
  }
};