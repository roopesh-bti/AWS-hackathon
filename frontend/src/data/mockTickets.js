// Mock data only - replace with API calls when the backend is ready.

export const PRIORITY_RANK = { CRITICAL: 0, HIGH: 1, NORMAL: 2 };

export const STATUS_LABELS = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  WAITING_FOR_CUSTOMER: "Waiting For Customer",
  RESOLVED: "Resolved",
};

// [id, priority, status, customer, vehicleNumber, model, summary, daysAgo]
const rows = [
  // Critical
  ["BMW-P1-1001", "CRITICAL", "OPEN", "Arjun Mehta", "KA01AB1234", "BMW X1", "Brake Failure", 0],
  ["BMW-P1-1002", "CRITICAL", "OPEN", "Priya Nair", "MH12CD5678", "BMW 3 Series", "Engine Smoke", 0],
  ["BMW-P1-1003", "CRITICAL", "IN_PROGRESS", "Rahul Sharma", "DL8CAF9087", "BMW X5", "Steering Failure", 1],
  ["BMW-P1-1004", "CRITICAL", "OPEN", "Neha Kapoor", "TN09EF4411", "BMW 5 Series", "Airbag Warning Light On", 1],
  // High
  ["BMW-1005", "HIGH", "OPEN", "Vikram Singh", "HR26GH7821", "BMW X3", "Transmission Slipping", 1],
  ["BMW-1006", "HIGH", "IN_PROGRESS", "Ananya Iyer", "KA03JK2290", "BMW 7 Series", "Battery Drains Overnight", 2],
  ["BMW-1007", "HIGH", "WAITING_FOR_CUSTOMER", "Karthik Reddy", "TS07LM3345", "BMW X7", "Coolant Leak Under Vehicle", 2],
  ["BMW-1008", "HIGH", "OPEN", "Sneha Patil", "MH14NP6612", "BMW 2 Series", "ABS Warning Light", 3],
  // Normal - unresolved
  ["BMW-1002", "NORMAL", "OPEN", "Rohan Gupta", "UP16QR9034", "BMW X3", "Steering Noise", 3],
  ["BMW-1009", "NORMAL", "OPEN", "Meera Joshi", "GJ05ST1198", "BMW X1", "Air Conditioning Not Cooling", 4],
  ["BMW-1010", "NORMAL", "IN_PROGRESS", "Aditya Rao", "KA51UV4467", "BMW 3 Series", "Infotainment Screen Freezing", 4],
  ["BMW-1011", "NORMAL", "OPEN", "Divya Menon", "KL07WX2253", "BMW X5", "Rattling Noise From Dashboard", 5],
  ["BMW-1012", "NORMAL", "WAITING_FOR_CUSTOMER", "Sanjay Verma", "RJ14YZ8876", "BMW 5 Series", "Tyre Pressure Warning", 5],
  ["BMW-1013", "NORMAL", "OPEN", "Pooja Desai", "MH02AB3320", "BMW X1", "Headlight Flickering", 6],
  ["BMW-1014", "NORMAL", "OPEN", "Nikhil Bansal", "DL3CCD7745", "BMW 6 Series GT", "Sunroof Not Closing Fully", 6],
  ["BMW-1015", "NORMAL", "IN_PROGRESS", "Isha Choudhary", "PB10EF5509", "BMW X3", "Parking Sensor Beeping Constantly", 7],
  ["BMW-1016", "NORMAL", "OPEN", "Manish Kulkarni", "MH20GH1182", "BMW 3 Series", "Vibration At High Speed", 8],
  ["BMW-1017", "NORMAL", "OPEN", "Lakshmi Pillai", "KL01JK6643", "BMW X5", "Key Fob Battery Warning", 9],
  // Resolved
  ["BMW-0990", "HIGH", "RESOLVED", "Harish Kumar", "TN22LM8801", "BMW X5", "Brake Fluid Leak", 10],
  ["BMW-0991", "HIGH", "RESOLVED", "Tanvi Shah", "GJ01NP2276", "BMW 5 Series", "Engine Misfire", 11],
  ["BMW-0992", "NORMAL", "RESOLVED", "Gaurav Malhotra", "DL1CQR4410", "BMW X1", "Wiper Motor Noise", 12],
  ["BMW-0993", "NORMAL", "RESOLVED", "Swati Bhatt", "MP09ST3358", "BMW 3 Series", "Bluetooth Pairing Failure", 13],
  ["BMW-0994", "HIGH", "RESOLVED", "Deepak Nambiar", "KA05UV9921", "BMW X7", "Suspension Warning", 14],
  ["BMW-0995", "NORMAL", "RESOLVED", "Ritu Agarwal", "UP32WX1175", "BMW 2 Series", "Door Lock Not Responding", 15],
  ["BMW-0996", "NORMAL", "RESOLVED", "Suresh Babu", "AP39YZ6604", "BMW X3", "Rear Camera Blurry", 16],
  ["BMW-0997", "HIGH", "RESOLVED", "Kavya Hegde", "KA19AB7732", "BMW 7 Series", "Fuel Pump Whining", 18],
  ["BMW-0998", "NORMAL", "RESOLVED", "Amit Trivedi", "GJ06CD2208", "BMW X1", "Seat Heater Not Working", 19],
  ["BMW-0999", "NORMAL", "RESOLVED", "Shruti Kaul", "HP01EF5517", "BMW 3 Series", "Window Regulator Slow", 21],
  ["BMW-1000", "NORMAL", "RESOLVED", "Varun Chopra", "CH01GH3369", "BMW X5", "Oil Service Reminder Stuck", 22],
  ["BMW-1001", "HIGH", "RESOLVED", "Anjali Sethi", "MH04JK8845", "BMW 5 Series", "Overheating In Traffic", 24],
  ["BMW-1003", "NORMAL", "RESOLVED", "Prakash Jain", "RJ27LM1190", "BMW X3", "Radio Static Noise", 26],
  ["BMW-1004", "NORMAL", "RESOLVED", "Madhuri Dixit", "MH43NP6027", "BMW 2 Series", "Boot Release Not Working", 28],
];

const BASE_TIME = Date.UTC(2026, 10, 2, 9, 30); // fixed so the mock data is stable

function hoursAfter(iso, hours) {
  return new Date(new Date(iso).getTime() + hours * 3600000).toISOString();
}

function buildTicket([id, priority, status, customerName, vehicleNumber, vehicleModel, summary, daysAgo]) {
  const createdAt = new Date(BASE_TIME - daysAgo * 86400000).toISOString();
  const slug = customerName.toLowerCase().replace(/\s+/g, ".");
  const phoneSeed = id.replace(/\D/g, "").slice(-4).padStart(4, "0");

  const activity = [
    { id: `${id}-a1`, label: "Ticket Created", detail: "Customer submitted a concern via the portal.", at: createdAt },
  ];
  const assigned = status !== "OPEN";
  if (assigned) {
    activity.push({ id: `${id}-a2`, label: "Advisor Assigned", detail: "Assigned to Service Advisor.", at: hoursAfter(createdAt, 1) });
    activity.push({
      id: `${id}-a3`,
      label: "Status Updated",
      detail: `Status changed to ${STATUS_LABELS[status]}.`,
      at: hoursAfter(createdAt, 2),
    });
  }

  const safetyNote =
    priority === "CRITICAL" ? " This is a safety-critical issue - contact the customer immediately and advise against driving the vehicle." : "";

  return {
    id,
    priority,
    status,
    customerName,
    email: `${slug}@example.com`,
    phone: `+91 98${phoneSeed}${phoneSeed}`,
    vehicleNumber,
    vehicleModel,
    summary,
    description: `Customer reports: "${summary}" on their ${vehicleModel} (${vehicleNumber}). Please review the concern, diagnose the cause and update the customer on the next steps.${safetyNote}`,
    createdAt,
    assignedTo: assigned ? "Service Advisor" : null,
    activity,
  };
}

export const mockTickets = rows.map(buildTicket);
