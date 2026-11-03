import { Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ReportConcern from "./pages/ReportConcern";
import AdvisorDashboard from "./pages/AdvisorDashboard";
import AccessDenied from "./pages/AccessDenied";
import Navbar from "./components/Navbar";
import RequireRole from "./components/RequireRole";
import { ROLES } from "./config/cognito";
import "./styles/Dashboard.css";

const CUSTOMER_ONLY = [ROLES.CUSTOMER];
const ADVISOR_ONLY = [ROLES.ADVISOR];

// Customer portal pages (/dashboard, /report-concern, ...) are for customers only
function CustomerRoute({ children }) {
  return <RequireRole allowedRoles={CUSTOMER_ONLY}>{children}</RequireRole>;
}

// Temporary page for dashboard targets that are not built yet
function ComingSoon({ title }) {
  return (
    <div className="sc-page">
      <Navbar />
      <main className="sc-main sc-placeholder">
        <h1>{title}</h1>
        <p>This page is coming soon.</p>
        <Link to="/dashboard">Back to Dashboard</Link>
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/access-denied" element={<AccessDenied />} />
      <Route
        path="/dashboard"
        element={
          <CustomerRoute>
            <Dashboard />
          </CustomerRoute>
        }
      />
      <Route
        path="/report-concern"
        element={<CustomerRoute><ReportConcern /></CustomerRoute>}
      />
      <Route
        path="/advisor"
        element={
          <RequireRole allowedRoles={ADVISOR_ONLY}>
            <AdvisorDashboard />
          </RequireRole>
        }
      />
      <Route
        path="/requests"
        element={<CustomerRoute><ComingSoon title="Track My Requests" /></CustomerRoute>}
      />
      <Route
        path="/profile"
        element={<CustomerRoute><ComingSoon title="My Profile" /></CustomerRoute>}
      />
      {/* Unknown URLs go to Login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
