import { useState, useEffect, useMemo, useRef } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import KanbanBoard from "../components/KanbanBoard";
import {
  IconAlertCircle,
  IconArrowUpDown,
  IconCheckCircle,
  IconClipboardList,
  IconClock,
  IconFilter,
  IconKanban,
  IconLayoutGrid,
  IconPlus,
  IconSearch,
  IconTag,
  IconTrendingUp,
  IconX,
} from "../components/Icons";
import * as taskApi from "../api/tasks";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "kanban"
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const searchInputRef = useRef(null);

  // Custom delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (categoryFilter && categoryFilter !== "all") params.category = categoryFilter;
      if (search) params.search = search;
      if (sort) params.sort = sort;
      const res = await taskApi.fetchTasks(params);
      setTasks(res.data.tasks);
    } catch {
      setError("Could not load tasks. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(loadTasks, 250);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, priorityFilter, categoryFilter, search, sort]);

  // Keyboard Shortcuts (/ to search, n for new task)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const targetTag = e.target.tagName?.toLowerCase();
      if (targetTag === "input" || targetTag === "textarea") {
        return;
      }

      if (e.key === "/" && !formOpen) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if ((e.key === "n" || e.key === "N") && !formOpen) {
        e.preventDefault();
        setEditingTask(null);
        setFormOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [formOpen]);

  const handleCreate = async (data) => {
    const res = await taskApi.createTask(data);
    setTasks((prev) => [res.data.task, ...prev]);
  };

  const handleUpdate = async (data) => {
    const res = await taskApi.updateTask(editingTask._id, data);
    setTasks((prev) =>
      prev.map((t) => (t._id === editingTask._id ? res.data.task : t))
    );
  };

  const openDeleteModal = (id, title) => {
    setDeleteTarget({ id, title });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await taskApi.deleteTask(deleteTarget.id);
      setTasks((prev) => prev.filter((t) => t._id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      setError("Failed to delete task. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === "completed" ? "pending" : "completed";
    try {
      const res = await taskApi.updateTask(task._id, { status: nextStatus });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? res.data.task : t))
      );
    } catch {
      setError("Failed to update task status.");
    }
  };

  const openCreate = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  const openEdit = (task) => {
    if (task.status === "completed") return;
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleClearFilters = () => {
    setStatusFilter("");
    setPriorityFilter("");
    setCategoryFilter("");
    setSearch("");
    setSort("");
  };

  const hasActiveFilters = Boolean(
    statusFilter || priorityFilter || categoryFilter || search || sort
  );

  // Computed Workspace Statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const pending = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const highPriority = tasks.filter(
      (t) => t.priority === "high" && t.status !== "completed"
    ).length;

    const nowMidnight = new Date();
    nowMidnight.setHours(0, 0, 0, 0);

    const overdue = tasks.filter((t) => {
      if (t.status === "completed" || !t.dueDate) return false;
      const d = new Date(t.dueDate);
      d.setHours(0, 0, 0, 0);
      return d < nowMidnight;
    }).length;

    return { total, completed, pending, percent, highPriority, overdue };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex w-full">
        {/* Spacious Sidebar Navigation */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeCategory={categoryFilter || "all"}
          onSelectCategory={(cat) => setCategoryFilter(cat === "all" ? "" : cat)}
          taskStats={{
            completed: stats.completed,
            pending: stats.pending,
            overdue: stats.overdue,
          }}
        />

        {/* Main Workspace View */}
        <main className="flex-1 max-w-7xl px-4 sm:px-8 py-8 mx-auto w-full min-w-0">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl flex items-center justify-between text-rose-700 dark:text-rose-400 text-xs sm:text-sm font-medium animate-fade-in">
              <div className="flex items-center gap-2">
                <IconAlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => setError("")}
                className="text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 p-1 cursor-pointer"
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Page Title & Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Task Workspace
                </h1>
                {categoryFilter && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    Category: {categoryFilter}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Monitor deadlines, organize by category, and maintain productivity.
              </p>
            </div>

            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
            >
              <IconPlus className="w-4 h-4" />
              <span>Create Task</span>
              <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 dark:bg-indigo-800 text-slate-300 rounded border border-slate-700 dark:border-indigo-700">
                N
              </kbd>
            </button>
          </div>

          {/* 4 Executive KPI Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
            {/* Card 1: Total */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Total Tasks
                </span>
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                  <IconClipboardList className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {stats.total}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">registered</span>
              </div>
            </div>

            {/* Card 2: Pending */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  In Progress
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                  <IconClock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {stats.pending}
                </span>
                <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">pending</span>
              </div>
            </div>

            {/* Card 3: Completed */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Completed
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                  <IconCheckCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {stats.completed}
                </span>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                  {stats.percent}% done
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
                <div
                  className="bg-emerald-600 dark:bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${stats.percent}%` }}
                />
              </div>
            </div>

            {/* Card 4: Urgent */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  High Priority
                </span>
                <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 flex items-center justify-center">
                  <IconTrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {stats.highPriority}
                </span>
                <span className="text-xs text-rose-700 dark:text-rose-400 font-medium">urgent tasks</span>
              </div>
            </div>
          </div>

          {/* Filter, Search & View Controls Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 mb-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            {/* Search box with / keyboard shortcut */}
            <div className="relative flex-1 min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <IconSearch className="w-4 h-4" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search tasks by title (press '/' to focus)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-12 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
              {search ? (
                <button
                  onClick={() => setSearch("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <IconX className="w-4 h-4" />
                </button>
              ) : (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                    /
                  </kbd>
                </div>
              )}
            </div>

            {/* Filter options */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Status Segmented Tabs */}
              <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400">
                <button
                  type="button"
                  onClick={() => setStatusFilter("")}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    statusFilter === ""
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-semibold shadow-xs"
                      : "hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("pending")}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    statusFilter === "pending"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-semibold shadow-xs"
                      : "hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  Pending
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("completed")}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    statusFilter === "completed"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-semibold shadow-xs"
                      : "hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  Completed
                </button>
              </div>

              {/* Category Filter Dropdown */}
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-3 pr-7 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition"
                >
                  <option value="">Category: All</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Other">Other</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <IconTag className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Priority Filter */}
              <div className="relative">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-3 pr-7 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition"
                >
                  <option value="">Priority: All</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <IconFilter className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Sort Select */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-3 pr-7 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition"
                >
                  <option value="">Sort: Newest</option>
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <IconArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* View Mode Switcher */}
              <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-400">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs"
                      : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                  title="Grid View"
                  aria-label="Grid View"
                >
                  <IconLayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("kanban")}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    viewMode === "kanban"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs"
                      : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                  title="Kanban Board View"
                  aria-label="Kanban View"
                >
                  <IconKanban className="w-4 h-4" />
                </button>
              </div>

              {/* Clear filters button */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                  title="Reset all search and filter conditions"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Task Grid or Kanban View */}
          {loading ? (
            /* Skeleton Loader Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <div className="w-20 h-4 rounded shimmer-skeleton bg-slate-200 dark:bg-slate-800" />
                    <div className="w-12 h-4 rounded shimmer-skeleton bg-slate-200 dark:bg-slate-800" />
                  </div>
                  <div className="space-y-2">
                    <div className="w-3/4 h-5 rounded shimmer-skeleton bg-slate-200 dark:bg-slate-800" />
                    <div className="w-full h-3 rounded shimmer-skeleton bg-slate-200 dark:bg-slate-800" />
                    <div className="w-1/2 h-3 rounded shimmer-skeleton bg-slate-200 dark:bg-slate-800" />
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div className="w-24 h-4 rounded shimmer-skeleton bg-slate-200 dark:bg-slate-800" />
                    <div className="w-16 h-6 rounded shimmer-skeleton bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>
              ))}
            </div>
          ) : tasks.length === 0 ? (
            /* Empty State */
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-md mx-auto shadow-xs mt-6">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center mx-auto mb-3">
                <IconClipboardList className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                {hasActiveFilters
                  ? "No matching tasks found"
                  : "No tasks created yet"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {hasActiveFilters
                  ? "Try clearing or modifying your search criteria."
                  : "Your workspace is currently clear. Add a task to get started."}
              </p>
              <div className="mt-5 flex justify-center gap-2">
                {hasActiveFilters ? (
                  <button
                    onClick={handleClearFilters}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
                  >
                    Clear Filters
                  </button>
                ) : (
                  <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
                  >
                    <IconPlus className="w-3.5 h-3.5" />
                    <span>Create Task</span>
                  </button>
                )}
              </div>
            </div>
          ) : viewMode === "kanban" ? (
            /* Kanban Board View */
            <KanbanBoard
              tasks={tasks}
              onEdit={openEdit}
              onDelete={openDeleteModal}
              onToggleStatus={handleToggleStatus}
              onOpenCreate={openCreate}
            />
          ) : (
            /* Task Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={openEdit}
                  onDelete={openDeleteModal}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Task Create / Edit Modal */}
      {formOpen && (
        <TaskForm
          initialTask={editingTask}
          onSubmit={editingTask ? handleUpdate : handleCreate}
          onClose={() => setFormOpen(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        taskTitle={deleteTarget?.title}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Dashboard;
