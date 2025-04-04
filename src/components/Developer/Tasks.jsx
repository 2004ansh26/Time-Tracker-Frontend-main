// src/components/Developer/Tasks.jsx
import React, { useState, useEffect } from "react";
import DeveloperNavbar from "./DeveloperNavbar";
import "../../css/task.css"

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
   
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      // developerId = localStorage.getItem("id");
      const response = await fetch(`http://localhost:8000/getAllTasksByDeveloperId/${localStorage.getItem("id")}`);
      const data = await response.json();
      console.log(data)
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleStartTask = async (taskId) => {
    try {
      await fetch(`http://localhost:8000/startTask/${taskId}`, { method: "PUT" });
      fetchTasks(); // Refresh tasks
    } catch (error) {
      console.error("Error starting task:", error);
    }
  };

  const handleStopTask = async (taskId) => {
    try {
        const response = await fetch(`http://localhost:8000/stopTask/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Updated Task Data:", data); // <-- Check if status_id is present

        setTasks(prevTasks => prevTasks.map(task => 
            task._id === taskId ? { ...task, ...data } : task
        ));
    } catch (error) {
        console.error("Error stopping task:", error);
    }
};



  const handleCompleteTask = async (taskId) => {
    try {
      await fetch(`http://localhost:8000/completeTask/${taskId}`, { method: "PUT" });
      fetchTasks();
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };


  return (
    <div>
      <DeveloperNavbar role="Developer" />
      <div className="tasks-container">
        <h1>Tasks</h1>
        <div className="tasks-list">
          {/* {tasks.map((task) => (
            <div key={task._id} className="task-card">
              <h2>{task.title}</h2>
              <p>{task.description}</p>
              <p>Status: {task.status_id.statusName}</p>
             
            </div>
          ))} */}
          {tasks.map((task) => (
            <div key={task._id} className="task-card">
              <h2>{task.title}</h2>
              <p>{task.description}</p>
              {/* <p>Status: {task.status_id?.statusName || "Unknown"}</p> */}
              <p>Status: {task.status_id?.statusName ?? "Unknown"}</p>
              <p>Total Time Spent: {task.timeSpent} minutes</p>
              
              {task.status_id?.statusName === "pending" && (
                <>
                <button onClick={() => handleStartTask(task._id)}>Start Task</button>
                <button onClick={() => handleCompleteTask(task._id)}>Complete Task</button>
                </>     
              )}
              
              {task.status_id?.statusName === "running" && (
                <>
                  <button onClick={() => handleStopTask(task._id)}>Stop Task</button>
                  <button onClick={() => handleCompleteTask(task._id)}>Complete Task</button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;