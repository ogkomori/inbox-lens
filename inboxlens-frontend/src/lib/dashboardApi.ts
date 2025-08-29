// Shared API utility for dashboard endpoints
export const API_BASE = import.meta.env.VITE_BACKEND_BASE_URL || "";

export async function fetchTrackables() {
  const res = await fetch(`${API_BASE}/api/dashboard/trackables`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch trackables');
  return res.json();
}

export async function fetchTodos() {
  const res = await fetch(`${API_BASE}/api/dashboard/to-do`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch todos');
  return res.json();
}

export async function addTodo(title: string) {
  const res = await fetch(`${API_BASE}/api/dashboard/to-do`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: title,
  });
  if (!res.ok) throw new Error('Failed to add todo');
  return res.text();
}

export async function updateTodo(dto: { oldTitle: string; newTitle: string; status: string }) {
  const res = await fetch(`${API_BASE}/api/dashboard/to-do`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error('Failed to update todo');
  return res.text();
}

export async function deleteTodo(title: string) {
  const res = await fetch(`${API_BASE}/api/dashboard/to-do`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: title,
  });
  if (!res.ok) throw new Error('Failed to delete todo');
  return res.text();
}
