import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import Logo from "./Logo";
import { logoutUser, getUserName } from "../services/auth";

// Top bar shown on every logged-in page: logo, app title, profile, logout
function Navbar() {
  const navigate = useNavigate();
  const userName = getUserName();

  function handleLogout() {
    logoutUser(); // clears the token from localStorage
    navigate("/");
  }

  return (
    <header className="sc-navbar">
      <div className="sc-navbar-left">
        <Logo light />
        <span className="sc-navbar-divider" />
        <span className="sc-navbar-title">Customer Service Portal</span>
      </div>

      <div className="sc-navbar-right">
        <div className="sc-profile" title={userName}>
          <span className="sc-profile-icon">
            <User size={18} />
          </span>
          <span className="sc-profile-name">{userName}</span>
        </div>
        <button className="sc-logout" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
