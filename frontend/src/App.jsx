import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newAmPm, setNewAmPm] = useState("AM");
  const [todos, setTodos] = useState([]);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editAmPm, setEditAmPm] = useState("AM");
  const [selectedTodoId, setSelectedTodoId] = useState(null);

  useEffect(() => { fetchTodos(); }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${PROCESS.ENV.BACKEND_URI}/api/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // Convert 12-hour + AM/PM to 24-hour datetime string
  const getDateTimeString = (date, time, ampm) => {
    if (!date || !time) return "";
    let [hours, minutes] = time.split(":").map(Number);
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
    return `${date}T${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}`;
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const datetime = getDateTimeString(newDate, newTime, newAmPm);
    try {
      const response = await axios.post(`${PROCESS.ENV.BACKEND_URI}/api/todos`, {
        text: newTodo,
        description: newDescription,
        time: datetime
      });
      setTodos([...todos, response.data]);
      setNewTodo('');
      setNewDescription('');
      setNewDate('');
      setNewTime('');
      setNewAmPm("AM");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${PROCESS.ENV.BACKEND_URI}/api/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const toggleComplete = async (id, currentCompleted) => {
    try {
      const response = await axios.patch(`${PROCESS.ENV.BACKEND_URI}/api/todos/${id}`, { completed: !currentCompleted });
      setTodos(todos.map(todo => todo._id === id ? { ...todo, completed: response.data.completed } : todo));
    } catch (error) {
      console.error("Error toggling completion:", error);
    }
  };

  const startEditing = (todo) => {
    setEditingTodoId(todo._id);
    setEditText(todo.text);
    setEditDescription(todo.description);
    if (todo.time) {
      const dateObj = new Date(todo.time);
      const hours = dateObj.getHours();
      setEditDate(todo.time.split("T")[0]);
      if (hours >= 12) {
        setEditAmPm("PM");
        setEditTime(`${hours === 12 ? 12 : hours - 12}`.padStart(2,'0') + ":" + dateObj.getMinutes().toString().padStart(2,'0'));
      } else {
        setEditAmPm("AM");
        setEditTime(`${hours === 0 ? 12 : hours}`.padStart(2,'0') + ":" + dateObj.getMinutes().toString().padStart(2,'0'));
      }
    } else {
      setEditDate("");
      setEditTime("");
      setEditAmPm("AM");
    }
  };

  const cancelEditing = () => {
    setEditingTodoId(null);
    setEditText('');
    setEditDescription('');
    setEditDate('');
    setEditTime('');
    setEditAmPm("AM");
  };

  const updateTodo = async (id) => {
    if (!editText.trim()) return;
    const datetime = getDateTimeString(editDate, editTime, editAmPm);
    try {
      const response = await axios.patch(`${PROCESS.ENV.BACKEND_URI}/api/todos/${id}`, {
        text: editText,
        description: editDescription,
        time: datetime
      });
      setTodos(todos.map(todo => todo._id === id ? response.data : todo));
      cancelEditing();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl p-8 ">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Task Manager</h1>

        <form onSubmit={addTodo} className="flex flex-col gap-2 mb-6 p-4 border rounded-lg shadow">
          <input type="text" value={newTodo} onChange={e => setNewTodo(e.target.value)} placeholder="Task name" className="p-2 border rounded"/>
          <input type="text" value={newDescription} onChange={e => setNewDescription(e.target.value)} placeholder="Description" className="p-2 border rounded"/>
          <div className="flex gap-2">
            <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="p-2 border rounded"/>
            <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="p-2 border rounded"/>
            <select value={newAmPm} onChange={e => setNewAmPm(e.target.value)} className="p-2 border rounded">
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">Add Task</button>
        </form>

        <div className="todo-list">
          {todos.length === 0 ? (
            <p className="text-gray-500 text-center">No tasks yet. Add one above!</p>
          ) : (
            <ul className="space-y-3">
              {todos.map(todo => (
                <li key={todo._id} className={`flex flex-col bg-gray-100 p-3 rounded-lg shadow-sm ${todo.completed ? 'opacity-60' : ''}`}>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={todo.completed} onChange={() => toggleComplete(todo._id, todo.completed)} className="form-checkbox h-5 w-5 text-blue-600"/>
                    {editingTodoId === todo._id ? (
                      <div className="flex-1 flex flex-col gap-2">
                        <input type="text" value={editText} onChange={e => setEditText(e.target.value)} className="p-1 border rounded"/>
                        <input type="text" value={editDescription} onChange={e => setEditDescription(e.target.value)} className="p-1 border rounded"/>
                        <div className="flex gap-2">
                          <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} className="p-1 border rounded"/>
                          <input type="time" value={editTime} onChange={e => setEditTime(e.target.value)} className="p-1 border rounded"/>
                          <select value={editAmPm} onChange={e => setEditAmPm(e.target.value)} className="p-1 border rounded">
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <span className={`flex-1 text-gray-800 cursor-pointer ${todo.completed ? 'line-through' : ''}`} onClick={() => setSelectedTodoId(selectedTodoId === todo._id ? null : todo._id)}>
                        {todo.text}
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      {editingTodoId === todo._id ? (
                        <>
                          <button onClick={() => updateTodo(todo._id)} className="text-green-500 hover:text-green-700 p-1"><FaSave size={18}/></button>
                          <button onClick={cancelEditing} className="text-gray-500 hover:text-gray-700 p-1"><FaTimes size={18}/></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEditing(todo)} className="text-blue-500 hover:text-blue-700 p-1"><FaEdit size={18}/></button>
                          <button onClick={() => deleteTodo(todo._id)} className="text-red-500 hover:text-red-700 p-1"><FaTrash size={18}/></button>
                        </>
                      )}
                    </div>
                  </div>
                  {selectedTodoId === todo._id && !editingTodoId && (
                    <div className="ml-7 mt-2 text-gray-600 text-sm">
                      <p><strong>Description:</strong> {todo.description}</p>
                      <p><strong>Time:</strong> {todo.time ? new Date(todo.time).toLocaleString() : ""}</p>
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
