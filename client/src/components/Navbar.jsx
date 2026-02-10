import React from "react"
import logo from "../assets/yella-logo.png"
import {Link} from "react-router-dom"

export default function Navbar({isAuthenticated,onLogout}){
   return (
    <nav style={styles.nav}>
        <Link to="/" style={styles.logoLink}>
        <img src={logo} alt="Anugraha Super Market" style={styles.logoImg} />
      </Link>
        <div style={styles.links}>
            {!isAuthenticated ? (
                <>
                <Link to="/login" >Login</Link>
                <Link to="/register">Register</Link>
            </>
            ): (
                <>
                <Link to="/dashboard">Dashboard</Link>
                <button onClick={onLogout}>Logout</button>
                </>
            )}
</div>
    </nav>
   )
 }
 
const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 20px", // Reduced padding slightly for better logo fit
    borderBottom: "1px solid #ddd",
    alignItems: "center", // Ensures logo and links align vertically
    backgroundColor: "#fff",
  },
  logoLink: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  },
  logoImg: {
    height: "45px", // Adjust this based on your preference
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
  }
};