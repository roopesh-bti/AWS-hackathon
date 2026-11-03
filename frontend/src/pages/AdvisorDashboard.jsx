import { useMemo, useState } from "react";
import { Ticket, TriangleAlert, FolderOpen, CircleCheck } from "lucide-react";
import AdvisorNavbar from "../components/advisor/AdvisorNavbar";
import SummaryCard from "../components/advisor/SummaryCard";
import CriticalAlertPanel from "../components/advisor/CriticalAlertPanel";
import TicketFilters from "../components/advisor/TicketFilters";
import TicketTable from "../components/advisor/TicketTable";
import TicketDetailsDrawer from "../components/advisor/TicketDetailsDrawer";
import { mockTickets, PRIORITY_RANK, STATUS_LABELS } from "../data/mockTickets";
import { getUserName } from "../services/auth";
import "../styles/AdvisorDashboard.css";

const PAGE_SIZE = 10;

const isUnresolved = (t) => t.status !== "RESOLVED";

const FILTER_RULES = {
  ALL: () => true,
  CRITICAL: (t) => t.priority === "CRITICAL" && isUnresolved(t),
  OPEN: isUnresolved,
  IN_PROGRESS: (t) => t.status === "IN_PROGRESS",
  RESOLVED: (t) => t.status === "RESOLVED",
};

function AdvisorDashboard() {
  const advisorName = getUserName() || "Service Advisor";

  const [tickets, setTickets] = useState(mockTickets);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);

  const criticalTickets = useMemo(() => tickets.filter(FILTER_RULES.CRITICAL), [tickets]);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(FILTER_RULES).map(([key, rule]) => [key, tickets.filter(rule).length])
      ),
    [tickets]
  );

  const visibleTickets = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tickets
      .filter(FILTER_RULES[activeFilter])
      .filter(
        (t) =>
          !query ||
          t.id.toLowerCase().includes(query) ||
          t.vehicleNumber.toLowerCase().includes(query) ||
          t.customerName.toLowerCase().includes(query)
      )
      .sort(
        (a, b) =>
          PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] ||
          new Date(b.createdAt) - new Date(a.createdAt)
      );
  }, [tickets, activeFilter, search]);

  const pageTickets = visibleTickets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selectedTicket = tickets.find((t) => t.id === selectedId) || null;

  function handleFilterChange(key) {
    setActiveFilter(key);
    setPage(1);
  }

  function handleSearchChange(value) {
    setSearch(value);
    setPage(1);
  }

  function updateTicket(id, changes, entry) {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              ...changes,
              activity: [
                ...t.activity,
                { id: `${id}-a${t.activity.length + 1}`, at: new Date().toISOString(), ...entry },
              ],
            }
          : t
      )
    );
  }

  function handleAssign() {
    updateTicket(
      selectedId,
      { assignedTo: advisorName },
      { label: "Advisor Assigned", detail: `Assigned to ${advisorName}.` }
    );
  }

  function handleStatusChange(status) {
    const detail =
      status === "WAITING_FOR_CUSTOMER"
        ? "Additional information requested from the customer."
        : `Status changed to ${STATUS_LABELS[status]}.`;
    updateTicket(selectedId, { status }, { label: "Status Updated", detail });
  }

  return (
    <div className="adv-page">
      <AdvisorNavbar advisorName={advisorName} />

      <main className="adv-main">
        <CriticalAlertPanel tickets={criticalTickets} onSelect={setSelectedId} />

        <section className="adv-summary-grid" aria-label="Ticket overview">
          <SummaryCard title="Total Tickets" value={counts.ALL} hint="All customer concerns" icon={Ticket} tone="blue" />
          <SummaryCard title="Critical Tickets" value={counts.CRITICAL} hint="Immediate attention" icon={TriangleAlert} tone="red" />
          <SummaryCard title="Open Tickets" value={counts.OPEN} hint="Awaiting resolution" icon={FolderOpen} tone="orange" />
          <SummaryCard title="Resolved Tickets" value={counts.RESOLVED} hint="Closed successfully" icon={CircleCheck} tone="green" />
        </section>

        <section className="adv-section">
          <div className="adv-section-header">
            <h2>Ticket Management</h2>
          </div>
          <TicketFilters
            activeFilter={activeFilter}
            counts={counts}
            onFilterChange={handleFilterChange}
            search={search}
            onSearchChange={handleSearchChange}
          />
          <TicketTable
            tickets={pageTickets}
            totalCount={visibleTickets.length}
            page={page}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            onView={setSelectedId}
          />
        </section>
      </main>

      {selectedTicket && (
        <TicketDetailsDrawer
          ticket={selectedTicket}
          advisorName={advisorName}
          onClose={() => setSelectedId(null)}
          onAssign={handleAssign}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}

export default AdvisorDashboard;
