// API for profile/dashboard details
import { API_BASE } from "./dashboardApi";

export async function fetchDashboardDetails() {
  const res = await fetch(`${API_BASE}/api/dashboard/me`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch dashboard details');
  return res.json();
}
