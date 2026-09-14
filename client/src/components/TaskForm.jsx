import { useState, useEffect } from "react";
import { IconAlertCircle, IconPlus, IconSpinner, IconX } from "./Icons";

const empty = {
  title: "",
  description: "",
  priority: "medium",
  category: "Work",
  dueDate: "",
};

const priorities = [
  {
    id: "low",
    label: "Low",
    desc: "Can wait",
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-800",
  },
  {
    id: "medium",
    label: "Medium",
    desc: "Normal priority",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-200 dark:border-amber-800",
  },
  {
    id: "high",
    label: "High",
    desc: "Urgent action",
    color: "text-orange-700 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950/40",
    border: "border-orange-200 dark:border-orange-800",
  },
];

const categories = ["Work", "Personal", "Urgent", "Other"];

const TaskForm = ({ initialTask, onSubmit, onClose }) => {
  const [form, setForm] = useState(
    initialTask
      ? {
          title: initialTask.title,
          description: initialTask.description || "",
          priority: initialTask.priority || "medium",
          category: initialTask.category || "Work",
          dueDate: initialTask.dueDate ? initialTask.dueDate.slice(0, 10) : "",
        }
      : empty
  );
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const setPriority = (priority) => {
    setForm((prev) => ({ ...prev, priority }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Task title is required");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save task. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 dark:bg-black/70 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-[#1A1A1E] rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200/80 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-stone-800/40">
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {initialTask ? "Edit Task" : "Create New Task"}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {initialTask
                ? "Update your task details below"
                : "Add a task to stay ahead of your schedule"}
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
            aria-label="Close modal"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 text-orange-700 dark:text-orange-400 text-xs font-medium rounded-xl animate-fade-in">
              <IconAlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title Field */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              Title <span className="text-orange-600">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Finalize quarterly financial report"
              autoFocus
              className="w-full bg-stone-50/70 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              Description{" "}
              <span className="text-stone-400 lowercase font-normal">
                (optional)
              </span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add key notes, links, or context..."
              rows={3}
              className="w-full bg-stone-50/70 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition resize-none"
            />
          </div>

          {/* Category & Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category Select */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-stone-50/70 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 dark:text-stone-100 focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="dark:bg-stone-900">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date Input */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full bg-stone-50/70 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 dark:text-stone-100 focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
              />
            </div>
          </div>

          {/* Priority Pill Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {priorities.map((p) => {
                const selected = form.priority === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selected
                        ? `${p.bg} ${p.border} ring-2 ring-blue-600/30 font-semibold shadow-xs`
                        : "bg-white dark:bg-stone-800/40 border-stone-200/90 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 hover:bg-stone-50/60 dark:hover:bg-stone-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold ${
                          selected
                            ? p.color
                            : "text-stone-700 dark:text-stone-300"
                        }`}
                      >
                        {p.label}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${p.bg}`} />
                    </div>
                    <span className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5 block">
                      {p.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-stone-800 dark:hover:text-stone-100 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <IconSpinner className="w-4 h-4" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  {initialTask ? null : <IconPlus className="w-4 h-4" />}
                  <span>{initialTask ? "Save Changes" : "Create Task"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
