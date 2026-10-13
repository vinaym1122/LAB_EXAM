const API_BASE_URL = "http://localhost:5000";

// One reusable function for frontend-backend communication.
export async function callApi(method, endpoint, data = null) {
  const options = { method, headers: {} };

  if (data !== null) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(data);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  } catch {
    throw new Error("Cannot connect to backend. Start the backend terminal first.");
  }

  const result = await response.json();
  if (!response.ok || result.success === false) {
    throw new Error(result.message || "Request failed.");
  }
  return result;
}
