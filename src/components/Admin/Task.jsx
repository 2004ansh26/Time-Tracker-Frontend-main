import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "./AdminNavbar";
import "../../css/task.css";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8000/getTask");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:8000/getAllProjects");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container-task">
        <h1 className="page-title">Tasks</h1>
        
        <div className="task-header">
          <select 
            onChange={(e) => setSelectedProject(e.target.value)} 
            value={selectedProject} 
            className="project-filter"
          >
            <option value="">All Projects</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.title}
              </option>
            ))}
          </select>
          
          <Link to="/admin/addTask">
            <button className="add-task-btn">+ New Task</button>
          </Link>
        </div>

        <div className="task-grid">
          {tasks
            .filter((task) => !selectedProject || task.project_id?._id === selectedProject)
            .map((task) => (
              <div key={task.id} className={`task-card priority-${task.priority.toLowerCase()}`}>
                <h2>{task.title}</h2>
                <p>{task.description}</p>
                <p><strong>Priority:</strong> {task.priority}</p>
                <p><strong>Time:</strong> {task.totalMinutes} min</p>
                <p><strong>Status:</strong> {task.status_id?.statusName || "To Do"}</p>
                <p><strong>Project:</strong> {task.project_id?.title || "N/A"}</p>
                <p><strong>Module:</strong> {task.module_id?.moduleName || "N/A"}</p>
                {/* Display Assigned Developers */}
                <p><strong>Developers:</strong></p>
                 <li>
                    {task.dev_id && task.dev_id.length > 0 ? (
                      task.dev_id.map((dev) => (
                        <li key={dev._id}>{dev.username}</li> // ✅ Show developer names
                      ))
                    ) : (
                      <li>N/A</li>
                    )}
                  </li>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TaskPage;