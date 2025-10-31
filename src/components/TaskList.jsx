import React from "react";
import TaskItem from "./TaskItem";

function TaskList({ tasks, onTaskUpdated, onTaskDeleted }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h3>No tasks found</h3>
        <p>Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <div className="tasks-grid">
        {tasks.map((task, index) => (
          <TaskItem
            key={task._id || task.id || `task-${index}`} // Fallback to index if no ID
            task={task}
            onTaskUpdated={onTaskUpdated}
            onTaskDeleted={onTaskDeleted}
          />
        ))}
      </div>
    </div>
  );
}

export default TaskList;
