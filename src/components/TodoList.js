import { useState, useEffect } from "react";
import "./TodoList.css";
import {
  CheckSquare,
  Square,
  Edit,
  Trash,
  RefreshCcw,
  Calendar,
  ArrowUpDown,
  Plus,
} from "lucide-react";

export default function TodoList() {
  const [tasks, setTasks] = useState(() => {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  });
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("Work");
  const [filter, setFilter] = useState("All");
  const [editingIndex, setEditingIndex] = useState(null);
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [sortOrder, setSortOrder] = useState("priority");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task.trim() === "") return;
    if (editingIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editingIndex] = {
        text: task,
        category,
        priority,
        dueDate,
        completed: false,
      };
      setTasks(updatedTasks);
      setEditingIndex(null);
    } else {
      setTasks([
        ...tasks,
        { text: task, category, priority, dueDate, completed: false },
      ]);
    }
    setTask("");
    setCategory("Work");
    setPriority("Medium");
    setDueDate("");
  };

  const toggleTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const editTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setTask(taskToEdit.text);
    setCategory(taskToEdit.category);
    setPriority(taskToEdit.priority);
    setDueDate(taskToEdit.dueDate);
    setEditingIndex(tasks.findIndex((task) => task.id === taskId));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const resetTasks = () => {
    setTasks([]);
  };

  const sortTasks = (tasks) => {
    return [...tasks].sort((a, b) => {
      if (sortOrder === "priority") {
        const priorityLevels = { High: 1, Medium: 2, Low: 3 };
        return priorityLevels[a.priority] - priorityLevels[b.priority];
      } else if (sortOrder === "date") {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    });
  };

  useEffect(() => {
    if (tasks.length > 0 && !tasks[0].id) {
      setTasks(
        tasks.map((task) => ({ ...task, id: Date.now() + Math.random() }))
      );
    }
  }, []);

  const filteredTasks = sortTasks(
    filter === "All" ? tasks : tasks.filter((task) => task.category === filter)
  );

  return (
    <div className="todo-container large-box">
      <h1 className="main-heading">Advanced Task Manager</h1>
      <h2 className="sub-heading">Plan & Prioritize Your Tasks</h2>
      <div className="input-group">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a task"
          className="task-input"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="category-select"
        >
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Urgent">Urgent</option>
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="priority-select"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="date-input"
        />
        <button onClick={addTask} className="add-button">
          <Plus className="icon" /> Add
        </button>
      </div>
      <div className="filter-group">
        <label>Filter by category:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="All">All</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Urgent">Urgent</option>
        </select>
        <button
          className="sort-button"
          onClick={() =>
            setSortOrder(sortOrder === "priority" ? "date" : "priority")
          }
        >
          <ArrowUpDown className="icon" /> Sort by{" "}
          {sortOrder === "priority" ? "Date" : "Priority"}
        </button>
      </div>
      <br></br>
      <div className="task-list">
        {filteredTasks.length === 0 && (
          <p className="no-tasks">No tasks available.</p>
        )}
        {filteredTasks.map((t) => (
          <div key={t.id} className="task-item">
            <div className="task-content">
              <button
                onClick={() => toggleTask(t.id)}
                className="checkbox-button"
              >
                {t.completed ? (
                  <CheckSquare className="icon completed" />
                ) : (
                  <Square className="icon" />
                )}
              </button>
              <span
                className={t.completed ? "task-text completed" : "task-text"}
              >
                {t.text} ({t.category}) - {t.priority} Priority
              </span>
              {t.dueDate && (
                <span className="due-date">
                  <Calendar className="icon" /> {t.dueDate}
                </span>
              )}
            </div>
            <div className="task-actions">
              <button className="edit-button" onClick={() => editTask(t.id)}>
                <Edit className="icon" />
              </button>
              <button
                className="delete-button"
                onClick={() => deleteTask(t.id)}
              >
                <Trash className="icon" />
              </button>
            </div>
          </div>
        ))}
        {tasks.length > 0 && (
          <button className="reset-button" onClick={resetTasks}>
            <RefreshCcw className="icon" /> Reset
          </button>
        )}
      </div>
    </div>
  );
}
