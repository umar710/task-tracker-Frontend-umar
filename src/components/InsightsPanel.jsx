import React, { useState, useEffect } from "react";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://task-tracker-backend-umar.onrender.com";

function InsightsPanel() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/insights`);
      if (!response.ok) {
        throw new Error(`Failed to fetch insights: ${response.status}`);
      }
      const data = await response.json();
      setInsights(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching insights:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const getAnalytics = () => {
    return (
      insights?.analytics || {
        totalTasks: 0,
        openTasks: 0,
        priorityDistribution: [],
        dueSoon: 0,
        overdue: 0,
      }
    );
  };

  const getSummary = () => {
    return (
      insights?.summary ||
      "No insights available. Create some tasks to see analytics."
    );
  };

  const getDetailedInsights = () => {
    return (
      insights?.detailedInsights || [
        "Start by creating your first task to get personalized insights.",
      ]
    );
  };

  if (loading) {
    return (
      <div className="insights-panel">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="insights-panel">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Unable to Load Analytics</h3>
          <p>{error}</p>
          <p className="error-help">
            Make sure the backend server is running on {API_BASE}
          </p>
          <button onClick={fetchInsights} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const analytics = getAnalytics();
  const summary = getSummary();
  const detailedInsights = getDetailedInsights();

  return (
    <div className="insights-panel">
      <div className="insights-header">
        <h2>
          <span>📊</span>
          Performance Analytics
        </h2>
        <button onClick={fetchInsights} className="btn btn-secondary">
          Refresh Data
        </button>
      </div>

      <div className="insights-content">
        <div className="summary-card">
          <h3>Executive Summary</h3>
          <p className="summary-text">{summary}</p>
        </div>

        <div className="analytics-grid">
          <div className="metric-card">
            <h4>Total Tasks</h4>
            <div className="metric-value">{analytics.totalTasks}</div>
          </div>

          <div className="metric-card">
            <h4>Open Tasks</h4>
            <div className="metric-value">{analytics.openTasks}</div>
          </div>

          <div className="metric-card">
            <h4>Due Soon</h4>
            <div className="metric-value">{analytics.dueSoon}</div>
          </div>

          <div className="metric-card">
            <h4>Overdue</h4>
            <div
              className={`metric-value ${
                analytics.overdue > 0 ? "overdue-count" : ""
              }`}
            >
              {analytics.overdue}
            </div>
          </div>
        </div>

        {analytics.openTasks > 0 && (
          <div className="priority-distribution">
            <h4>Priority Distribution</h4>
            <div className="priority-bars">
              {analytics.priorityDistribution.map((item) => (
                <div key={item.priority} className="priority-bar">
                  <div className="priority-label">{item.priority}</div>
                  <div className="bar-container">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${(item.count / analytics.openTasks) * 100}%`,
                        backgroundColor:
                          item.priority === "High"
                            ? "#ef4444"
                            : item.priority === "Medium"
                            ? "#f59e0b"
                            : "#10b981",
                      }}
                    ></div>
                  </div>
                  <div className="priority-count">{item.count}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="detailed-insights">
          <h4>Actionable Insights</h4>
          <ul className="insights-list">
            {detailedInsights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>

        {analytics.totalTasks === 0 && (
          <div className="empty-state">
            <h3>No Data Available</h3>
            <p>
              Create your first task to see detailed analytics and insights.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InsightsPanel;
