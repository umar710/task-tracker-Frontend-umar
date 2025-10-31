import React, { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import InsightsPanel from "./components/InsightsPanel";
import "./App.css";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://task-tracker-backend-umar.onrender.com";

// Normalize task data to handle MongoDB _id and date formats
const normalizeTask = (task) => {
  if (!task) return task;

  return {
    id: task._id || task.id, // Use _id from MongoDB as id
    _id: task._id || task.id, // Keep _id for reference
    title: task.title,
    description: task.description,
    priority: task.priority,
    due_date: task.due_date,
    status: task.status,
    created_at: task.createdAt || task.created_at,
    // Ensure due_date is in a consistent format
    ...(task.due_date && {
      due_date: new Date(task.due_date).toISOString(),
    }),
  };
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("tasks");

  const fetchTasks = async (statusFilter = "all") => {
    setLoading(true);
    try {
      let url = `${API_BASE}/tasks`;
      if (statusFilter !== "all") {
        url += `?status=${statusFilter}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const tasksData = await response.json();

      // Normalize all tasks
      const normalizedTasks = tasksData.map(normalizeTask);
      setTasks(normalizedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      alert("Failed to load tasks. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(filter);
  }, [filter]);

  const handleTaskCreated = (newTask) => {
    const normalizedTask = normalizeTask(newTask);
    setTasks((prev) => [normalizedTask, ...prev]);
  };

  const handleTaskUpdated = (updatedTask) => {
    const normalizedTask = normalizeTask(updatedTask);
    setTasks((prev) =>
      prev.map((task) =>
        task.id === normalizedTask.id || task._id === normalizedTask._id
          ? normalizedTask
          : task
      )
    );
  };

  const handleTaskDeleted = (taskId) => {
    setTasks((prev) =>
      prev.filter((task) => task.id !== taskId && task._id !== taskId)
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">✅</div>
            <div className="logo-text">
              <h1>TaskFlow Manager</h1>
              <p>Streamline your workflow with intelligent task management</p>
            </div>
          </div>
        </div>
      </header>

      <nav className="app-nav">
        <div className="nav-content">
          <button
            className={`nav-tab ${activeTab === "tasks" ? "active" : ""}`}
            onClick={() => setActiveTab("tasks")}
          >
            <span>📋</span>
            Tasks
          </button>
          <button
            className={`nav-tab ${activeTab === "insights" ? "active" : ""}`}
            onClick={() => setActiveTab("insights")}
          >
            <span>📊</span>
            Analytics
          </button>
        </div>
      </nav>

      <main className="app-main">
        <div className="main-container">
          {activeTab === "tasks" && (
            <div className="tasks-container">
              <div className="tasks-sidebar">
                <TaskForm onTaskCreated={handleTaskCreated} />
              </div>

              <div className="tasks-content">
                <div className="tasks-header">
                  <h3>Task Overview</h3>
                  <div className="tasks-controls">
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="form-control"
                      style={{ width: "auto", minWidth: "140px" }}
                    >
                      <option value="all">All Tasks</option>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                    <button
                      onClick={() => fetchTasks(filter)}
                      className="btn btn-secondary"
                    >
                      Refresh
                    </button>
                  </div>
                </div>

                <div className="tasks-grid-container">
                  {loading ? (
                    <div className="loading">
                      <div className="loading-spinner"></div>
                      <p>Loading tasks...</p>
                    </div>
                  ) : (
                    <TaskList
                      tasks={tasks}
                      onTaskUpdated={handleTaskUpdated}
                      onTaskDeleted={handleTaskDeleted}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "insights" && <InsightsPanel />}
        </div>
      </main>
    </div>
  );
}

export default App;
