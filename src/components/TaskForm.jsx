import React, { useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://task-tracker-backend-umar.onrender.com";

function TaskForm({ onTaskCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    due_date: "",
    status: "Open",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format the date for backend
      const submitData = {
        ...formData,
        due_date: new Date(formData.due_date).toISOString(),
      };

      console.log("Sending task data:", submitData);

      const response = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP ${response.status}: Failed to create task`
        );
      }

      const newTask = await response.json();
      console.log("Created task:", newTask);

      onTaskCreated(newTask);

      // Reset form
      setFormData({
        title: "",
        description: "",
        priority: "Medium",
        due_date: "",
        status: "Open",
      });
    } catch (error) {
      console.error("Error creating task:", error);
      alert(`Error creating task: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h3>
        <span>➕</span>
        Create New Task
      </h3>

      <div className="form-group">
        <label htmlFor="title">Task Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="form-control"
          required
          placeholder="Enter task title"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-control"
          placeholder="Enter task description"
          rows="3"
        />
      </div>

      <div className="form-group">
        <label htmlFor="priority">Priority *</label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="form-control"
          required
        >
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="due_date">Due Date *</label>
        <input
          type="date"
          id="due_date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
          className="form-control"
          min={today}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="form-control"
        >
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full"
      >
        {loading ? (
          <>
            <div
              className="loading-spinner"
              style={{ width: "16px", height: "16px" }}
            ></div>
            Creating Task...
          </>
        ) : (
          "Create Task"
        )}
      </button>
    </form>
  );
}

export default TaskForm;
