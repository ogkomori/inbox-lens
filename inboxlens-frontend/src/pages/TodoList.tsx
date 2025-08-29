

import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import DashboardNavigation from "../components/DashboardNavigation";
import { useNavigate } from "react-router-dom";
import { fetchTodos, addTodo as apiAddTodo, updateTodo as apiUpdateTodo, deleteTodo as apiDeleteTodo } from "../lib/dashboardApi";
import { Card } from "../components/ui/card";

interface ToDoListEntity {
  id: number;
  title: string;
  status: "PENDING" | "DONE";
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<ToDoListEntity[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos()
      .then(setTodos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    if (!newTask.trim()) return;
    setLoading(true);
    try {
      await apiAddTodo(newTask);
      const updated = await fetchTodos();
      setTodos(updated);
      setNewTask("");
    } catch (e: any) {
      // If error is 500 or similar, show a user-friendly message
      if (e.message && (e.message.includes("500") || e.message.toLowerCase().includes("failed to add todo"))) {
        setError("This item exists already");
      } else {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (id: number, value: string) => {
    setEditingId(id);
    setEditValue(value);
  };

  const saveEdit = async (id: number, oldTitle: string) => {
    setLoading(true);
    try {
      await apiUpdateTodo({ oldTitle, newTitle: editValue, status: todos.find(t => t.id === id)?.status || "PENDING" });
      const updated = await fetchTodos();
      setTodos(updated);
      setEditingId(null);
      setEditValue("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const toggleTodo = async (id: number, todo: ToDoListEntity) => {
    setLoading(true);
    try {
      await apiUpdateTodo({ oldTitle: todo.title, newTitle: todo.title, status: todo.status === "DONE" ? "PENDING" : "DONE" });
      const updated = await fetchTodos();
      setTodos(updated);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (todo: ToDoListEntity) => {
    setLoading(true);
    try {
      await apiDeleteTodo(todo.title);
      const updated = await fetchTodos();
      setTodos(updated);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNavigation user={{ name: '', email: '', avatar: '' }} />
      <div className="container mx-auto pt-24">
        <Button variant="default" className="mb-6 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => navigate('/dashboard')}>&larr; Back to dashboard</Button>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">To-Do List</h2>
            <div className="mb-4 flex gap-2">
              <input
                className="border rounded px-3 py-2 flex-1"
                placeholder="Add a new task..."
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                disabled={loading}
              />
              <Button onClick={handleAdd} disabled={loading}>Add</Button>
            </div>
            {loading ? (
              <Card className="flex items-center justify-center p-8 my-8">
                <span className="animate-spin rounded-full h-8 w-8 border-t-4 border-primary border-solid mr-4"></span>
                <span>Loading your to-do list...</span>
              </Card>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : todos.length === 0 ? (
              <Card className="p-8 my-8 text-center text-muted-foreground font-semibold">You have no to-do tasks yet. Add one above!</Card>
            ) : (
              <table className="w-full border rounded shadow text-left bg-card">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-2">Task</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {todos.map(todo => (
                    <tr key={todo.id} className="border-t">
                      <td className="p-2">
                        {editingId === todo.id ? (
                          <input
                            className="w-full bg-card border border-primary rounded px-2 py-1 outline-none"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            autoFocus
                          />
                        ) : (
                          <span>{todo.title}</span>
                        )}
                      </td>
                      <td className="p-2">
                        <input type="checkbox" checked={todo.status === "DONE"} onChange={() => toggleTodo(todo.id, todo)} />
                        {todo.status === "DONE" ? <span className="ml-2 text-green-600">Done</span> : <span className="ml-2 text-yellow-600">Pending</span>}
                      </td>
                      <td className="p-2 flex gap-2">
                        {editingId === todo.id ? (
                          <>
                            <Button size="sm" variant="default" onClick={() => saveEdit(todo.id, todo.title)} disabled={editValue.trim() === todo.title.trim()}>Save</Button>
                            <Button size="sm" variant="secondary" onClick={cancelEdit}>Cancel</Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="secondary" onClick={() => startEdit(todo.id, todo.title)}>Rename</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(todo)}>Delete</Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="w-full lg:w-80 flex flex-col gap-4">
            <h3 className="text-xl font-semibold mb-2">AI Insights</h3>
            <div className="bg-card p-4 rounded shadow">
              <strong>Tip:</strong> Prioritize tasks by urgency and importance for better productivity.
            </div>
            <div className="bg-card p-4 rounded shadow">
              <strong>AI Suggestion:</strong> Would you like to auto-categorize your tasks? (Coming soon)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
