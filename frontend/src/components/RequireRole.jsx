import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getSessionAccess } from "../services/auth";
import { resolveAccess } from "../services/access";

// Route guard. Re-checks the verified Cognito session on every navigation.
// Signed-in users whose role is not allowed here are sent to their own home page.
function RequireRole({ allowedRoles, children }) {
  const { pathname } = useLocation();
  const [access, setAccess] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getSessionAccess().then((result) => {
      if (!cancelled) setAccess(result);
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const decision = resolveAccess(access, allowedRoles);

  if (decision.action === "redirect") return <Navigate to={decision.to} replace />;

  if (decision.action === "wait") {
    return (
      <div className="sc-page">
        <main className="sc-main sc-placeholder">
          <p>Checking access...</p>
        </main>
      </div>
    );
  }

  return children;
}

export default RequireRole;
