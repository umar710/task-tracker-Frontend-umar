import React, { useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://task-tracker-backend-umar.onrender.com";

function TaskItem({ task, onTaskUpdated, onTaskDeleted }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    ...task,
    due_date: formatDateForInput(task.due_date), // Format date for input
  });
  const [loading, setLoading] = useState(false);

  // Format date for input field (YYYY-MM-DD)
  function formatDateForInput(dateString) {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      // Handle invalid dates
      if (isNaN(date.getTime())) {
        console.warn("Invalid date:", dateString);
        return "";
      }
      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  }

  // Format date for display
  function formatDateForDisplay(dateString) {
    if (!dateString) return "No date";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting display date:", error);
      return "Invalid date";
    }
  }

  // Get task ID - handle both MongoDB _id and regular id
  const getTaskId = () => {
    return task._id || task.id;
  };

  const handleUpdate = async (updates) => {
    setLoading(true);
    try {
      const taskId = getTaskId();

      // Ensure we have a valid task ID
      if (!taskId) {
        throw new Error("Task ID is missing");
      }

      console.log("Updating task:", taskId, updates);

      // Format date for backend if it's in the updates
      if (updates.due_date && typeof updates.due_date === "string") {
        // If it's already in YYYY-MM-DD format, convert to ISO
        if (updates.due_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
          updates.due_date = new Date(
            updates.due_date + "T00:00:00"
          ).toISOString();
        }
        // If it's already ISO, leave it as is
      }

      const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to update task: ${response.status}`
        );
      }

      const updatedTask = await response.json();
      onTaskUpdated(updatedTask);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating task:", error);
      alert(`Failed to update task: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    setLoading(true);
    try {
      const taskId = getTaskId();

      if (!taskId) {
        throw new Error("Task ID is missing");
      }

      const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete task");
      }

      onTaskDeleted(taskId);
    } catch (error) {
      console.error("Error deleting task:", error);
      alert(`Failed to delete task: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    handleUpdate({ status: newStatus });
  };

  const handlePriorityChange = (newPriority) => {
    handleUpdate({ priority: newPriority });
  };

  const handleEditSubmit = () => {
    // Ensure due_date is properly formatted before submitting
    const submitData = {
      ...editData,
      due_date: editData.due_date, // Already in YYYY-MM-DD format from input
    };
    handleUpdate(submitData);
  };

  const getPriorityBadge = (priority) => {
    const classes = {
      High: "badge badge-high",
      Medium: "badge badge-medium",
      Low: "badge badge-low",
    };
    return <span className={classes[priority]}>{priority}</span>;
  };

  const getStatusBadge = (status) => {
    const classes = {
      Open: "badge badge-open",
      "In Progress": "badge badge-progress",
      Done: "badge badge-done",
    };
    return <span className={classes[status]}>{status}</span>;
  };

  const isOverdue = () => {
    if (!task.due_date) return false;
    try {
      const dueDate = new Date(task.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Compare dates only, not time
      return dueDate < today && task.status !== "Done";
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return false;
    }
  };

  if (isEditing) {
    return (
      <div className="task-item">
        <div className="task-edit">
          <input
            type="text"
            value={editData.title || ""}
            onChange={(e) =>
              setEditData({ ...editData, title: e.target.value })
            }
            className="form-control"
            placeholder="Task title"
          />
          <textarea
            value={editData.description || ""}
            onChange={(e) =>
              setEditData({ ...editData, description: e.target.value })
            }
            className="form-control"
            placeholder="Task description"
            rows="3"
          />
          <select
            value={editData.priority || "Medium"}
            onChange={(e) =>
              setEditData({ ...editData, priority: e.target.value })
            }
            className="form-control"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input
            type="date"
            value={editData.due_date || ""}
            onChange={(e) =>
              setEditData({ ...editData, due_date: e.target.value })
            }
            className="form-control"
            min={new Date().toISOString().split("T")[0]}
          />
          <div className="flex gap-2" style={{ marginTop: "1rem" }}>
            <button
              onClick={handleEditSubmit}
              disabled={loading}
              className="btn btn-primary btn-sm"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary btn-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-item ${isOverdue() ? "overdue" : ""}`}>
      <div className="task-header">
        <h4 className="task-title">{task.title || "Untitled Task"}</h4>
        <div className="task-actions">
          <button
            onClick={() => setIsEditing(true)}
            className="btn-icon"
            title="Edit task"
            disabled={loading}
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="btn-icon"
            title="Delete task"
          >
            {loading ? "..." : "🗑️"}
          </button>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        {getPriorityBadge(task.priority)}
        {getStatusBadge(task.status)}
        <span className={`due-date ${isOverdue() ? "overdue" : ""}`}>
          📅 {formatDateForDisplay(task.due_date)}
          {isOverdue() && " ⚠️ Overdue"}
        </span>
      </div>

      <div className="task-controls">
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={loading}
          className="form-control"
        >
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        <select
          value={task.priority}
          onChange={(e) => handlePriorityChange(e.target.value)}
          disabled={loading}
          className="form-control"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
    </div>
  );
}

export default TaskItem;
