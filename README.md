# 🧭 Task Tracker Frontend

A **modern, responsive task management web app** built with **React + Vite**, offering a sleek UI, real-time task management, and smart analytics — fully integrated with the backend API.

---

## 🚀 Features

* 📝 **CRUD Operations** — Create, update, and delete tasks
* 🎨 **Modern UI** — Responsive layout with smooth animations
* 📊 **Smart Insights** — AI-like analytics and workload stats
* ⚡ **Real-time Updates** — No page refresh required
* 🔍 **Filtering & Sorting** — Filter by priority and status
* ⏰ **Due Date Tracking** — Highlight overdue tasks
* 🌙 **Clean Design System** — Built with modern CSS variables

---

## 🛠 Tech Stack

* **Frontend:** React 18 + Vite
* **Styling:** CSS (variables, gradients, shadows)
* **API:** Fetch (REST integration)
* **Deployment:** Vercel
* **Backend:** [Task Tracker Backend](https://task-tracker-backend-umar.onrender.com)

---

## 🌐 Live Demo

👉 **[https://task-tracker-frontend-umar.vercel.app/](https://task-tracker-frontend-umar.vercel.app/)**

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd task-tracker-frontend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Add Environment Variable

Create `.env` file:

```env
VITE_API_URL=https://task-tracker-backend-umar.onrender.com
```

### 4️⃣ Start Development Server

```bash
npm run dev
```

Frontend runs on **[http://localhost:5173](http://localhost:5173)**

---

## 🧩 Project Structure

```
src/
├── components/
│   ├── TaskForm.jsx
│   ├── TaskList.jsx
│   ├── TaskItem.jsx
│   └── InsightsPanel.jsx
├── App.jsx
└── main.jsx
```

---

## 📊 API Endpoints Used

| Method | Endpoint     | Description     |
| ------ | ------------ | --------------- |
| GET    | `/tasks`     | Get all tasks   |
| POST   | `/tasks`     | Create new task |
| PATCH  | `/tasks/:id` | Update task     |
| DELETE | `/tasks/:id` | Delete task     |
| GET    | `/insights`  | Fetch analytics |

---

## 🎨 Design System

| Element           | Example         |
| ----------------- | --------------- |
| **Primary Color** | `#6366f1`       |
| **Success**       | `#10b981`       |
| **Warning**       | `#f59e0b`       |
| **Error**         | `#ef4444`       |
| **Font**          | Inter (400–700) |

---

## 🚀 Deployment (Vercel)

```bash
npm run build
vercel
```

Set environment variable in dashboard:

```
VITE_API_URL=https://task-tracker-backend-umar.onrender.com
```

---

## 👨‍💻 Author

**Umer Faruque Syed**

🔗 [Live Demo](https://task-tracker-frontend-umar.vercel.app/)

🔗 [Backend API](https://task-tracker-backend-umar.onrender.com)

📂 [Frontend Repo](https://github.com/your-username/task-tracker-frontend)


