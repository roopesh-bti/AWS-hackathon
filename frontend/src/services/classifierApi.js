const CLASSIFIER_URL = "https://efmskhuhth.execute-api.us-east-1.amazonaws.com/classify";
const TIMEOUT_MS = 20000;

// Error with a `kind` the UI can turn into a friendly message
export class ClassifierError extends Error {
  constructor(kind, message) {
    super(message);
    this.kind = kind; // "timeout" | "network" | "http" | "invalid"
  }
}

// Sends the customer's message to the classifier. Resolves one of:
//   { type: "critical", reply, ticketId }  - the API raised a ticket and returned text to show
//   { type: "non-critical" }               - the API says the next step is a knowledge-base search
export async function classifyConcern(message) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    let response;
    try {
      response = await fetch(CLASSIFIER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
        signal: controller.signal,
      });
    } catch {
      if (controller.signal.aborted) throw new ClassifierError("timeout", "Request timed out");
      throw new ClassifierError("network", "Network error");
    }

    if (!response.ok) throw new ClassifierError("http", `HTTP ${response.status}`);

    let data;
    try {
      data = await response.json();
    } catch {
      if (controller.signal.aborted) throw new ClassifierError("timeout", "Request timed out");
      throw new ClassifierError("invalid", "Response was not valid JSON");
    }

    if (data?.critical === true) {
      return {
        type: "critical",
        reply: typeof data.reply === "string" ? data.reply : "",
        ticketId: typeof data.ticketId === "string" ? data.ticketId : null,
      };
    }
    if (data?.critical === false || data?.nextStep === "KB_SEARCH") {
      return { type: "non-critical" };
    }
    throw new ClassifierError("invalid", "Response has neither critical:true nor a known nextStep");
  } finally {
    clearTimeout(timer);
  }
}
