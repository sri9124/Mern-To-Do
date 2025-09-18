import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa'; 

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodoId, setEditingTodoId] = useState(null); 
  const [editText, setEditText] = useState(""); 

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/todos');
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return; 
    try {
      const response = await axios.post('http://localhost:5000/api/todos', { text: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo(''); 
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const toggleComplete = async (id, currentCompleted) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/todos/${id}`, { completed: !currentCompleted });
      setTodos(todos.map(todo =>
        todo._id === id ? { ...todo, completed: response.data.completed } : todo
      ));
    } catch (error) {
      console.error("Error toggling completion:", error);
    }
  };

  const updateTodoText = async (id) => {
    if (!editText.trim()) return; 
    try {
      const response = await axios.patch(`http://localhost:5000/api/todos/${id}`, { text: editText });
      setTodos(todos.map(todo =>
        todo._id === id ? { ...todo, text: response.data.text } : todo
      ));
      setEditingTodoId(null); 
      setEditText(""); 
    } catch (error) {
      console.error("Error updating todo text:", error);
    }
  };

 

  useEffect(() => {
    fetchTodos(); 
  }, []);


  const startEditing = (todo) => {
    setEditingTodoId(todo._id);
    setEditText(todo.text);
  };

  const cancelEditing = () => {
    setEditingTodoId(null);
    setEditText("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl p-8 ">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Task Manager</h1>

        
        <form onSubmit={addTodo} className="flex items-center gap-2 shadow-xl border-gray-500 p-2 rounded-2xl mb-6">
          <input
            className="flex-1 outline-none px-3 py-2 text-gray-700 placeholder-gray-400"
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
          />
          <button type="submit" className="bg-blue-400 p-1 rounded-sm hover:bg-blue-600 cursor-pointer text-white">Add Task</button>
        </form>

        
        <div className="todo-list">
          {todos.length === 0 ? (
            <p className="text-gray-500 text-center">No tasks yet. Add one above!</p>
          ) : (
            <ul className="space-y-3">
              {todos.map((todo) => (
                <li
                  key={todo._id}
                  className={`flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-sm ${todo.completed ? 'opacity-60' : ''}`} 
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo._id, todo.completed)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    {editingTodoId === todo._id ? (
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                updateTodoText(todo._id);
                            }
                        }}
                      />
                    ) : (
                      <span className={`text-gray-800 text-lg ${todo.completed ? 'line-through' : ''}`}>
                        {todo.text}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {editingTodoId === todo._id ? (
                      <>
                        <button
                          onClick={() => updateTodoText(todo._id)}
                          className="text-green-500 hover:text-green-700 p-1"
                          title="Save"
                        >
                          <FaSave size={18} />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-gray-500 hover:text-gray-700 p-1"
                          title="Cancel"
                        >
                          <FaTimes size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(todo)}
                          className="text-blue-500 hover:text-blue-700 p-1"
                          title="Edit"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo._id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete"
                        >
                          <FaTrash size={18} />
                        </button>
                      </>
                    )}
                  </div>
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