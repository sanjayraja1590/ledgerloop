import API_BASE from "../api";

export async function getExpenses() {
  const res = await fetch(`${API_BASE}/expenses/`);
  if (!res.ok) throw new Error("API fucked up");
  return res.json();
}
