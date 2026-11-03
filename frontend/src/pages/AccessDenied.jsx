import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/auth";

function AccessDenied() {
  const navigate = useNavigate();

  function handleSignOut() {
    logoutUser();
    navigate("/login");
  }

  return (
    <div className="sc-page">
      <main className="sc-main sc-placeholder">
        <h1>Access Denied</h1>
        <p>Your account is not assigned to a role that can use this portal. Please contact support.</p>
        <button className="sc-action-button" onClick={handleSignOut}>
          Sign out
        </button>
      </main>
    </div>
  );
}

export default AccessDenied;
