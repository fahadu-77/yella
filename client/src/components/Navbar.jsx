import React, { useContext, useState } from "react";
import logo from "../assets/yella-logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LogOut, Home, Key, Package, UserCircle, Menu, X, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const navLinks = [];
  if (!user) {
    navLinks.push({ path: "/login", label: "Login", icon: <Key size={18} /> });
    navLinks.push({ path: "/register", label: "Register", icon: <UserCircle size={18} /> });
  } else {
    if (user.role === 'customer') navLinks.push({ path: "/store", label: "Store", icon: <Package size={18} /> });
    if (user.role === 'staff') navLinks.push({ path: "/staff", label: "Staff Panel", icon: <LayoutDashboard size={18} /> });
    if (user.role === 'admin') navLinks.push({ path: "/admin", label: "Admin Panel", icon: <LayoutDashboard size={18} /> });
    if (user.role === 'delivery') navLinks.push({ path: "/delivery", label: "Tasks", icon: <Package size={18} /> });
  }

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 shrink-0 transition-transform hover:scale-105 active:scale-95">
            <img src={logo} alt="Anugraha Super Market" className="h-10 w-auto object-contain drop-shadow-sm" />
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive(link.path)
                    ? "bg-primary-50 text-primary-600 shadow-sm ring-1 ring-primary-100"
                    : "text-gray-600 hover:bg-gray-50/80 hover:text-primary-500"
                  }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}

            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 px-5 py-2.5 ml-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow flex-shrink-0 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <LogOut size={16} />
                <span>Logout ({user.name.split(' ')[0]})</span>
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-primary-600 focus:outline-none p-2 rounded-xl hover:bg-gray-100/50 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden animate-fade-in bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-xl absolute w-full left-0">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold transition-colors ${isActive(link.path)
                    ? "bg-primary-50 text-primary-600 ring-1 ring-primary-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary-500"
                  }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}

            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3.5 mt-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-md transition-all active:scale-[0.98]"
              >
                <LogOut size={18} />
                <span>Logout ({user.name.split(' ')[0]})</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}