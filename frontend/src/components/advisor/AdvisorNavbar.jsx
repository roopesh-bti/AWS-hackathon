import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import Logo from "../Logo";
import { logoutUser } from "../../services/auth";

function AdvisorNavbar({ advisorName }) {
  const navigate = useNavigate();

  function handleLogout() {
    logoutUser();
    navigate("/");
  }

  return (
    <header className="adv-navbar">
      <div className="adv-navbar-left">
        <Logo light />
        <span className="adv-navbar-divider" />
        <span className="adv-navbar-portal">Advisor Portal</span>
      </div>

      <h1 className="adv-navbar-title">Advisor Dashboard</h1>

      <div className="adv-navbar-right">
        <div className="adv-profile" title={advisorName}>
          <span className="adv-profile-icon">
            <User size={18} />
          </span>
          <div className="adv-profile-text">
            <span className="adv-profile-name">{advisorName}</span>
            <span className="adv-profile-role">Service Advisor</span>
          </div>
        </div>
        <button className="adv-logout" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default AdvisorNavbar;
