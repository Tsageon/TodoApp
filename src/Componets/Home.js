import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import './Home.css';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('Low');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:3001/tasks', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  
    const addTask = async () => {
      if (!newTask.trim()) {
        Swal.fire({
          icon: 'warning',
          title: 'Task Missing',
          text: 'Please enter a task before adding!',
          confirmButtonText: 'Got it!',
        });
        return;
      }
    
      if (!priority) {
        Swal.fire({
          icon: 'warning',
          title: 'Priority Missing',
          text: 'Please select a priority level!',
          confirmButtonText: 'Got it!',
        });
        return;
      }

    const taskToAdd = { description: newTask, priority };
    
    try {
      const response = await fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(taskToAdd)
      });

      const newTaskFromAPI = await response.json();
      setTasks((prevTasks) => [...prevTasks, newTaskFromAPI]);
      setNewTask('');
      setPriority('Low');
      Swal.fire({
        icon: 'success',
        title: 'Task Added',
        text: 'Task added Successfully!',
        confirmButtonText: 'Alright!',
      });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== id));
        Swal.fire({
          icon: 'success',
          title: 'Task Deleted Successfully',
          text: 'The task was successfully deleted.',
          confirmButtonText: 'Great!',
        });
      } else {
        console.error('Error deleting task:', await response.json());
        Swal.fire({
          icon: 'error',
          title: 'Error Deleting Task',
          text: 'There was an issue deleting the task. Please try again.',
          confirmButtonText: 'Got it!',
        });
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      Swal.fire({
        icon: 'warning',
        title: 'Something Went Wrong',
        text: 'Please try again later!',
        confirmButtonText: 'Got it!',
      });
    }
  };

  const updateTask = async (id, newDescription, newPriority) => {
    if (!newDescription || !newPriority) return;

    const updatedTask = { description: newDescription, priority: newPriority };

    try {
      const response = await fetch(`http://localhost:3001/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(updatedTask)
      });

      if (response.ok) {
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, description: newDescription, priority: newPriority } : task
          )
        );
        Swal.fire({
          icon: 'success',
          title: 'Task Updated Successfully',
          text: 'The task was successfully updated.',
          confirmButtonText: 'Great!',
        });
      } else {
        console.error('Error updating task:', await response.json());
        Swal.fire({
          icon: 'error',
          title: 'Error Updating Task',
          text: 'There was an issue updating the task. Please try again.',
          confirmButtonText: 'Got it!',
        });
      }
    } catch (error) {
      console.error('Error updating task:', error);
      Swal.fire({
        icon: 'warning',
        title: 'Something Went Wrong',
        text: 'Please try again later!',
        confirmButtonText: 'Got it!',
      });
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="home-container">
      <h2 className="home-title">To-Do List</h2>
      <div className="card">
        <div className="input-search-container">
          <TaskInput 
            newTask={newTask}
            setNewTask={setNewTask}
            priority={priority}
            setPriority={setPriority}
            addTask={addTask} 
          />
        </div>
      </div>
      <TaskSearch 
        search={search} 
        setSearch={setSearch} 
      />
      <div className="task-list-container">
        <TaskList 
          tasks={filteredTasks} 
          deleteTask={deleteTask} 
          updateTask={updateTask} 
        />
      </div>
    </div>
  );
};

const TaskInput = ({ newTask, setNewTask, priority, setPriority, addTask }) => (
  <div className="task-input">
    <div className='input-field'>
      <input 
        type="text" 
        placeholder="Input Task" 
        className='left' 
        value={newTask} 
        onChange={(e) => setNewTask(e.target.value)} 
      />
      <select className="priority-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
    </div>
    <button className='add-task' onClick={addTask}>Add Task</button>
  </div>
);

const TaskSearch = ({ search, setSearch }) => (
  <div className="task-search">
    <input 
      type="text" 
      placeholder="Search for Task" 
      value={search} 
      onChange={(e) => setSearch(e.target.value)} 
    />
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
    <div className="task-list">
      {tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} style={{ color: getPriorityColor(task.priority) }}>
              <span>{task.description} - {task.priority}</span>
              <button className='delete-button' onClick={() => deleteTask(task.id)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
              {editingTaskId === task.id ? (
                <>
                  <EditTaskForm 
                    task={task}
                    onUpdate={(id, newDescription, newPriority) => {
                      updateTask(id, newDescription, newPriority);
                      handleCancelEdit();
                    }} 
                  />
                  <button className='cancel-button' onClick={handleCancelEdit}>Cancel</button>
                </>
              ) : (
                <button className='edit-button' onClick={() => handleEditClick(task.id)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
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
        placeholder="New Task description?" 
      />
      <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button className='update-button' onClick={handleUpdate}>Update</button>
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