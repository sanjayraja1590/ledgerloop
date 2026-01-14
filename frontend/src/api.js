const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://ledgerloop-backend-4vmw.onrender.com/api";

export default API_BASE;

const token = localStorage.getItem("access")

fetch(`${API_BASE}/expenses/`, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
})
