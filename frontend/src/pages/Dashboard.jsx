import { useNavigate } from "react-router-dom";
import { CarFront, TriangleAlert, Ticket, User, ClipboardList, Clock, CircleCheck } from "lucide-react";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import StatsCard from "../components/StatsCard";
import "../styles/Dashboard.css";

// Main action cards. Each one navigates to its own page.
// /report-concern is where the future form -> API Gateway -> Lambda -> DynamoDB flow starts.
const actions = [
  {
    icon: TriangleAlert,
    title: "Report Vehicle Concern",
    description: "Submit a new vehicle issue or service request.",
    buttonText: "Report Concern",
    path: "/report-concern",
  },
  {
    icon: Ticket,
    title: "Track My Requests",
    description: "View existing requests and track their status.",
    buttonText: "View Requests",
    path: "/requests",
  },
  {
    icon: User,
    title: "My Profile",
    description: "View account information.",
    buttonText: "View Profile",
    path: "/profile",
  },
];

// Mock numbers only. Replace with data from the API once it exists.
const stats = [
  { icon: ClipboardList, label: "Total Requests", value: 12 },
  { icon: Clock, label: "Open Requests", value: 3 },
  { icon: CircleCheck, label: "Resolved Requests", value: 9 },
];

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="sc-page">
      <Navbar />

      <main className="sc-main">
        <section className="sc-welcome">
          <h1>Welcome to BMW ServiceCare</h1>
          <p>Manage vehicle concerns and service requests.</p>
        </section>

        <h2 className="sc-section-title">What would you like to do?</h2>
        <section className="sc-actions">
          {actions.map((action) => (
            <DashboardCard
              key={action.path}
              icon={action.icon}
              title={action.title}
              description={action.description}
              buttonText={action.buttonText}
              onClick={() => navigate(action.path)}
            />
          ))}
        </section>

        <h2 className="sc-section-title">Quick Overview</h2>
        <section className="sc-stats">
          {stats.map((stat) => (
            <StatsCard key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} />
          ))}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
