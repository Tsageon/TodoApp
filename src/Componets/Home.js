import React, { useState, useEffect } from 'react';
import { useAuth } from './Authentication'; 
import './Home.css';

const Home = () => {
  const { authenticated, error } = useAuth(); 

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('Low');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() === '') return;
    const newTasks = [...tasks, { id: Date.now(), description: newTask, priority }];
    setTasks(newTasks);
    setNewTask('');
    setPriority('Low');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const updateTask = (id, newDescription, newPriority) => {
    if (!newDescription || !newPriority) return;
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, description: newDescription, priority: newPriority } : task
      )
    );
  };

  const filteredTasks = tasks.filter((task) =>
    task.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {authenticated ? (
        <div>
          <h2>To-Do List</h2>
          <TaskInput
            newTask={newTask}
            setNewTask={setNewTask}
            priority={priority}
            setPriority={setPriority}
            addTask={addTask}
          />
          <TaskSearch search={search} setSearch={setSearch} />
          <TaskList tasks={filteredTasks} deleteTask={deleteTask} updateTask={updateTask} />
        </div>
      ) : error ? (
        <p>Something someting Error: {error}</p>
      ) : (
        <p>Please log in, we need the traffic.</p>
      )}
    </div>
  );
};

const TaskInput = ({ newTask, setNewTask, priority, setPriority, addTask }) => (
  <div className="task-input">
    <input 
      type="text" 
      value={newTask} 
      onChange={(e) => setNewTask(e.target.value)} 
      placeholder="What are we doing?" 
    />
    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
      <option value="High">High</option>
      <option value="Medium">Medium</option>
      <option value="Low">Low</option>
    </select>
    <button onClick={addTask}>Add Task</button>
  </div>
);

const TaskSearch = ({ search, setSearch }) => (
  <div className="task-search">
    <input 
      type="text" 
      value={search} 
      onChange={(e) => setSearch(e.target.value)} 
      placeholder="Do you remember what you did?" 
    />
  </div>
);

const TaskList = ({ tasks, deleteTask, updateTask }) => (
  <div>
    {tasks.length > 0 ? (
      <ul>
        {tasks.map((task) => (
          <li key={task.id} style={{ color: getPriorityColor(task.priority) }}>
            <span>{task.description} - {task.priority}</span>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
            <EditTaskForm task={task} onUpdate={updateTask} />
          </li>
        ))}
      </ul>
    ) : (
      <p>No tasks yet.</p>
    )}
  </div>
);

const EditTaskForm = ({ task, onUpdate }) => {
  const [newDescription, setNewDescription] = useState(task.description);
  const [newPriority, setNewPriority] = useState(task.priority);

  const handleUpdate = () => {
    onUpdate(task.id, newDescription, newPriority);
  };

  return (
    <div className="edit-task-form">
      <input 
        type="text" 
        value={newDescription} 
        onChange={(e) => setNewDescription(e.target.value)} 
        placeholder="Update description" 
      />
      <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High':
      return 'red';
    case 'Medium':
      return 'orange';
    case 'Low':
      return 'green';
    default:
      return 'black';
  }
};

export default Home;