import React, { useState } from 'react';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('Low');
  const [search, setSearch] = useState('');

  const addTask = () => {
    if (newTask.trim() === '') return;
    const newTasks = [...tasks, { id: Date.now(), description: newTask, priority }];
    setTasks(newTasks);
    setNewTask('');
    setPriority('Low');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const updateTask = (id, newDescription, newPriority) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, description: newDescription, priority: newPriority } : task));
  };

  const filteredTasks = tasks.filter(task => task.description.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h2>To-Do List</h2>
      <div>
        <input 
          type="text" 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)} 
          placeholder="Task description" 
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>
      <div>
        <input 
          type="text" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          placeholder="Search tasks" 
        />
      </div>
      <ul>
        {filteredTasks.map(task => (
          <li key={task.id} style={{ color: getPriorityColor(task.priority) }}>
            <span>{task.description} - {task.priority}</span>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
            <button onClick={() => updateTask(task.id, prompt('New description:', task.description), prompt('New priority:', task.priority))}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High':
      return 'red';
    case 'Medium':
      return 'yellow';
    case 'Low':
      return 'green';
    default:
      return 'black';
  }
};

export default Home;