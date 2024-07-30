import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('Low');
  const [search, setSearch] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:3001/check-auth', {
          withCredentials: true
        });
        console.log('Authentication check response:',response.data); 
        const data = response.data;
        if (data.authenticated) {
          setUserId(data.userId);
          fetchTasks(data.userId);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking authentication:',error);
        navigate('/login'); 
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchTasks = async (userId) => {
    try {
      console.log('Fetching tasks for userId:', userId); 
      const response = await axios.get(`http://localhost:3001/tasks/${userId}`, {
        withCredentials: true
      });
      console.log('Fetched tasks:', response.data);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:',error);
    }
  };

  const addTask = async () => {
    if (newTask.trim() === '' || userId === null) return;
    try {
      const response = await axios.post('http://localhost:3001/tasks', {
        description: newTask,
        priority,
        userId
      }, {
        withCredentials: true
      });
      const data = response.data;
      console.log('Task added:', data); 
      setTasks([...tasks, { id: data.id, description: newTask, priority }]);
      setNewTask('');
      setPriority('Low');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/tasks/${id}`, {
        withCredentials: true
      });
      console.log('Task deleted:', id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const updateTask = async (id, newDescription, newPriority) => {
    if (!newDescription || !newPriority) return;
    try {
      await axios.put(`http://localhost:3001/tasks/${id}`, {
        description: newDescription,
        priority: newPriority
      }, {
        withCredentials: true
      });
      console.log('Task updated:', {id, newDescription,newPriority }); 
      setTasks(
        tasks.map((task) =>
          task.id === id ? {...task, description: newDescription, priority: newPriority } : task
        )
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleSearch = () => {
    const filteredTasks = tasks.filter((task) =>
      task.description.toLowerCase().includes(search.toLowerCase())
    );
    setTasks(filteredTasks);
  };

  return (
    <div>
      <h2>To-Do List</h2>
      <TaskInput
        newTask={newTask}
        setNewTask={setNewTask}
        priority={priority}
        setPriority={setPriority}
        addTask={addTask}/>
      <TaskSearch search={search} setSearch={setSearch} handleSearch={handleSearch}/>
      <TaskList tasks={tasks}
        deleteTask={deleteTask}
        updateTask={updateTask}/>
    </div>
  );
};

const TaskInput = ({ newTask, setNewTask, priority, setPriority, addTask }) => (
  <div className="task-input">
    <input
      type="text"
      value={newTask}
      onChange={(e) => setNewTask(e.target.value)}
      placeholder="What are we doing?"/>
    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
      <option value="High">High</option>
      <option value="Medium">Medium</option>
      <option value="Low">Low</option>
    </select>
    <button onClick={addTask}>Add Task</button>
  </div>
);

const TaskSearch = ({ search, setSearch, handleSearch }) => (
  <div className="task-search">
    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
      placeholder="Search for task"/>
    <button onClick={handleSearch}>Search</button>
  </div>
);

const TaskList = ({ tasks, deleteTask, updateTask }) => {
  const [editingTaskId, setEditingTaskId] = useState(null);

  const handleEditClick = (id) => {
    setEditingTaskId(id);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
  };

  return (
    <div>
      {tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} style={{ color: getPriorityColor(task.priority) }}>
              <span>{task.description} - {task.priority}</span>
              <button className='delete' onClick={() => deleteTask(task.id)}>Delete</button>
              {editingTaskId === task.id ? (
                <>
                  <EditTaskForm
                    task={task}
                    onUpdate={(id, newDescription, newPriority) => {
                      updateTask(id, newDescription, newPriority);
                      handleCancelEdit();
                    }}
                  />
                  <button className='cancel' onClick={handleCancelEdit}>Cancel</button>
                </>
              ) : (
                <button className='edit' onClick={() => handleEditClick(task.id)}>Edit</button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks yet.</p>
      )}
    </div>
  );
};

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
        placeholder="What's new?" />
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