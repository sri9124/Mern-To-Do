// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaSave, FaTimes, FaPlus, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';

function App() {
  const [newTodoText, setNewTodoText] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");
  const [newTodoDueTime, setNewTodoDueTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueTime, setEditDueTime] = useState("");
  const [expandedTodoId, setExpandedTodoId] = useState(null);

  const API_URL = 'https://mern-to-do-hux7.onrender.com/api/todos';

  // Fetch todos
  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add new todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    try {
      const response = await axios.post(API_URL, {
        text: newTodoText,
        description: newTodoDescription || "",
        dueTime: newTodoDueTime ? new Date(newTodoDueTime).toISOString() : null
      });
      setTodos([...todos, response.data]);
      setNewTodoText("");
      setNewTodoDescription("");
      setNewTodoDueTime("");
      setExpandedTodoId(response.data._id); // Auto-expand new task
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
      if (editingTodoId === id) cancelEditing();
      if (expandedTodoId === id) setExpandedTodoId(null);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Toggle complete
  const toggleComplete = async (id, currentCompleted) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, { completed: !currentCompleted });
      setTodos(todos.map(todo => todo._id === id ? { ...todo, completed: response.data.completed } : todo));
    } catch (error) {
      console.error("Error toggling completion:", error);
    }
  };

  // Start editing
  const startEditing = (todo) => {
    setEditingTodoId(todo._id);
    setEditText(todo.text);
    setEditDescription(todo.description || "");
    setEditDueTime(todo.dueTime ? new Date(todo.dueTime).toISOString().slice(0, 16) : "");
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingTodoId(null);
    setEditText("");
    setEditDescription("");
    setEditDueTime("");
  };

  // Update todo
  const updateTodo = async (id) => {
    if (!editText.trim()) return;

    try {
      const response = await axios.patch(`${API_URL}/${id}`, {
        text: editText,
        description: editDescription || "",
        dueTime: editDueTime ? new Date(editDueTime).toISOString() : null
      });
      setTodos(todos.map(todo => todo._id === id ? response.data : todo));
      cancelEditing();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Toggle expand/collapse
  const toggleExpand = (id) => {
    setExpandedTodoId(expandedTodoId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl p-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Task Manager</h1>

        {/* Add Task Form */}
        <form onSubmit={addTodo} className="space-y-4 mb-6 p-4 border rounded-xl shadow-inner bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Add New Task</h2>
          <div>
            <label htmlFor="taskText" className="block text-sm font-medium text-gray-700">Task Title</label>
            <input
              id="taskText"
              type="text"
              className="w-full outline-none px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="e.g., Buy groceries"
              required
            />
          </div>
          <div>
            <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
            <textarea
              id="taskDescription"
              rows="3"
              className="w-full outline-none px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y"
              value={newTodoDescription}
              onChange={(e) => setNewTodoDescription(e.target.value)}
              placeholder="Details about the task..."
            />
          </div>
          <div>
            <label htmlFor="taskDueTime" className="block text-sm font-medium text-gray-700">Due Date & Time (Optional)</label>
            <input
              id="taskDueTime"
              type="datetime-local"
              className="w-full outline-none px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={newTodoDueTime}
              onChange={(e) => setNewTodoDueTime(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center gap-2"
          >
            <FaPlus /> Add Task
          </button>
        </form>

        {/* Todo List */}
        <div className="todo-list">
          {todos.length === 0 ? (
            <p className="text-gray-500 text-center text-lg mt-8">No tasks yet. Add one above!</p>
          ) : (
            <ul className="space-y-4">
              {todos.map(todo => (
                <li key={todo._id} className={`bg-white border border-gray-200 p-4 rounded-lg shadow-md transition-all duration-200 ease-in-out ${todo.completed ? 'opacity-70 bg-green-50' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleComplete(todo._id, todo.completed)}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded"
                      />
                      {editingTodoId === todo._id ? (
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-lg focus:ring-blue-500 focus:border-blue-500"
                          onKeyPress={(e) => { if (e.key === 'Enter') updateTodo(todo._id); }}
                        />
                      ) : (
                        <span
                          onClick={() => toggleExpand(todo._id)}
                          className={`text-gray-800 text-lg font-medium cursor-pointer hover:text-blue-600 transition ${todo.completed ? 'line-through text-gray-500' : ''}`}
                        >
                          {todo.text}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {editingTodoId === todo._id ? (
                        <>
                          <button onClick={() => updateTodo(todo._id)} className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-gray-100 transition-colors" title="Save">
                            <FaSave size={20} />
                          </button>
                          <button onClick={cancelEditing} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-gray-100 transition-colors" title="Cancel">
                            <FaTimes size={20} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEditing(todo)} className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-gray-100 transition-colors" title="Edit Task">
                            <FaEdit size={20} />
                          </button>
                          <button onClick={() => deleteTodo(todo._id)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-gray-100 transition-colors" title="Delete Task">
                            <FaTrash size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Expanded Section */}
                  {expandedTodoId === todo._id && (
                    <div className="mt-2 pt-2 border-t border-gray-100 space-y-2">
                      {editingTodoId === todo._id ? (
                        <>
                          <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Edit description..."
                          />
                          <input
                            type="datetime-local"
                            value={editDueTime}
                            onChange={(e) => setEditDueTime(e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </>
                      ) : (
                        <>
                          <p className="text-gray-700 text-sm flex items-start">
                            <FaInfoCircle size={14} className="mr-2 mt-1 text-blue-500 flex-shrink-0" />
                            <span className="font-semibold mr-1">Description:</span> {todo.description || "No description"}
                          </p>
                          <p className="text-gray-700 text-sm flex items-center">
                            <FaCalendarAlt size={14} className="mr-2 text-purple-500" />
                            <span className="font-semibold mr-1">Due:</span>{" "}
                            {todo.dueTime ? new Date(todo.dueTime).toLocaleString() : "No due time"}
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
