import React from "react";
import {
  IconCalendar,
  IconEdit,
  IconPlus,
  IconTrash,
  IconAlertCircle,
} from "./Icons";

const priorityConfig = {
  high: {
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    dotClass: "bg-rose-500",
    label: "High",
  },
  medium: {
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    dotClass: "bg-amber-500",
    label: "Medium",
  },
  low: {
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    dotClass: "bg-slate-500",
    label: "Low",
  },
};

const formatDueDate = (dateString, isCompleted) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const now = new Date();
  
  const dMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffDays = Math.round((dMidnight - nowMidnight) / (1000 * 60 * 60 * 24));
  const dateFormatted = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  let statusText = dateFormatted;
  let isOverdue = false;

  if (!isCompleted && diffDays < 0) {
    isOverdue = true;
    statusText = `Overdue (${dateFormatted})`;
  } else if (!isCompleted && diffDays === 0) {
    statusText = `Today`;
  }

  return { text: statusText, isOverdue };
};

const KanbanCard = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const isDone = task.status === "completed";
  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const dueInfo = formatDueDate(task.dueDate, isDone);

  return (
    <div
      className={`pro-card rounded-xl p-4 mb-3 transition-all ${
        isDone ? "bg-slate-50/80 opacity-85" : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${priority.badgeClass}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dotClass}`} />
          {priority.label}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
            title="Edit"
          >
            <IconEdit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task._id, task.title)}
            className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
            title="Delete"
          >
            <IconTrash className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <h4
        className={`text-sm font-semibold line-clamp-2 ${
          isDone ? "line-through text-slate-400" : "text-slate-900"
        }`}
      >
        {task.title}
      </h4>

      {task.description && (
        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
        {dueInfo ? (
          <span
            className={`text-xs inline-flex items-center gap-1 ${
              dueInfo.isOverdue ? "text-rose-600 font-semibold" : "text-slate-500"
            }`}
          >
            {dueInfo.isOverdue ? (
              <IconAlertCircle className="w-3.5 h-3.5" />
            ) : (
              <IconCalendar className="w-3.5 h-3.5" />
            )}
            {dueInfo.text}
          </span>
        ) : (
          <span className="text-[11px] text-slate-400">No deadline</span>
        )}

        <button
          onClick={() => onToggleStatus(task)}
          className={`text-xs font-semibold px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
            isDone
              ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200"
              : "bg-slate-900 text-white hover:bg-slate-800 border-slate-900"
          }`}
        >
          {isDone ? "↺ Move to Pending" : "✓ Mark Done"}
        </button>
      </div>
    </div>
  );
};

const KanbanBoard = ({ tasks, onEdit, onDelete, onToggleStatus, onOpenCreate }) => {
  const pendingTasks = tasks.filter((t) => t.status !== "completed");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start animate-fade-in">
      {/* Column 1: Pending Tasks */}
      <div className="bg-slate-100/70 rounded-2xl p-4 sm:p-5 border border-slate-200/80">
        <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h3 className="font-bold text-slate-900 text-sm">
              In Progress / Pending
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200">
              {pendingTasks.length}
            </span>
          </div>

          <button
            onClick={onOpenCreate}
            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition"
          >
            <IconPlus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {pendingTasks.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No active pending tasks
          </div>
        ) : (
          pendingTasks.map((t) => (
            <KanbanCard
              key={t._id}
              task={t}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          ))
        )}
      </div>

      {/* Column 2: Completed Tasks */}
      <div className="bg-slate-100/70 rounded-2xl p-4 sm:p-5 border border-slate-200/80">
        <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h3 className="font-bold text-slate-900 text-sm">
              Completed Tasks
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white text-emerald-700 border border-emerald-200">
              {completedTasks.length}
            </span>
          </div>
        </div>

        {completedTasks.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No tasks completed yet
          </div>
        ) : (
          completedTasks.map((t) => (
            <KanbanCard
              key={t._id}
              task={t}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanBoard;
