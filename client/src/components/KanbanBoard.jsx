import React from "react";
import {
  IconCalendar,
  IconEdit,
  IconPlus,
  IconTrash,
  IconAlertCircle,
  IconLock,
} from "./Icons";
import { categoryStyles } from "./TaskCard";

const priorityConfig = {
  high: {
    badgeClass:
      "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900/50",
    dotClass: "bg-orange-500",
    label: "High",
  },
  medium: {
    badgeClass:
      "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50",
    dotClass: "bg-amber-500",
    label: "Medium",
  },
  low: {
    badgeClass:
      "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700",
    dotClass: "bg-stone-400 dark:bg-stone-500",
    label: "Low",
  },
};

const formatDueDate = (dateString, isCompleted) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const now = new Date();

  const dMidnight = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const nowMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const diffDays = Math.round(
    (dMidnight - nowMidnight) / (1000 * 60 * 60 * 24)
  );
  const dateFormatted = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  let statusText = dateFormatted;
  let isOverdue = false;

  if (!isCompleted && diffDays < 0) {
    statusText = `${dateFormatted} (Overdue)`;
    isOverdue = true;
  } else if (!isCompleted && diffDays === 0) {
    statusText = "Due Today";
  } else if (!isCompleted && diffDays === 1) {
    statusText = "Due Tomorrow";
  }

  return { text: statusText, isOverdue };
};

const KanbanCard = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const isDone = task.status === "completed";
  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const catStyle = categoryStyles[task.category] || {
    badgeClass:
      "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700",
    dotClass: "bg-stone-500",
  };
  const dueInfo = formatDueDate(task.dueDate, isDone);

  return (
    <div
      className={`pro-card mb-3 p-4 bg-white dark:bg-[#1A1A1E] border border-stone-200/90 dark:border-stone-800 rounded-xl shadow-xs hover:shadow transition-all ${
        isDone ? "opacity-75 bg-stone-50/50 dark:bg-stone-900/40" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded border ${priority.badgeClass}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${priority.dotClass}`}
            />
            {priority.label}
          </span>

          {task.category && (
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded border ${catStyle.badgeClass}`}
            >
              <span className={`w-1 h-1 rounded-full ${catStyle.dotClass}`} />
              {task.category}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Edit ONLY when NOT completed */}
          {!isDone ? (
            <button
              onClick={() => onEdit(task)}
              className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded transition cursor-pointer"
              title="Edit"
            >
              <IconEdit className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span
              className="p-1 text-stone-400 dark:text-stone-600 cursor-not-allowed"
              title="Completed tasks are locked from editing"
            >
              <IconLock className="w-3 h-3" />
            </span>
          )}

          <button
            onClick={() => onDelete(task._id, task.title)}
            className="p-1 text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 rounded transition cursor-pointer"
            title="Delete"
          >
            <IconTrash className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <h4
        className={`text-sm font-semibold line-clamp-2 ${
          isDone
            ? "line-through text-stone-400 dark:text-stone-500"
            : "text-stone-900 dark:text-stone-100"
        }`}
      >
        {task.title}
      </h4>

      {task.description && (
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-2">
        {dueInfo ? (
          <span
            className={`text-xs inline-flex items-center gap-1 ${
              dueInfo.isOverdue
                ? "text-orange-600 dark:text-orange-400 font-semibold"
                : "text-stone-500 dark:text-stone-400"
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
          <span className="text-[11px] text-stone-400 dark:text-stone-500">
            No deadline
          </span>
        )}

        <button
          onClick={() => onToggleStatus(task)}
          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
            isDone
              ? "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 border-stone-200 dark:border-stone-700"
              : "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
          }`}
        >
          {isDone ? "↺ Move to Pending" : "✓ Mark Done"}
        </button>
      </div>
    </div>
  );
};

const KanbanBoard = ({
  tasks,
  onEdit,
  onDelete,
  onToggleStatus,
  onOpenCreate,
}) => {
  const pendingTasks = tasks.filter((t) => t.status !== "completed");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start animate-fade-in">
      {/* Column 1: Pending Tasks */}
      <div className="bg-stone-200/50 dark:bg-[#17171B] rounded-2xl p-4 sm:p-5 border border-stone-200/80 dark:border-stone-800">
        <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              In Progress / Pending
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
              {pendingTasks.length}
            </span>
          </div>

          <button
            onClick={onOpenCreate}
            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700/60 border border-stone-200 dark:border-stone-700 rounded-lg transition cursor-pointer"
          >
            <IconPlus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {pendingTasks.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-500">
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
      <div className="bg-slate-100/70 dark:bg-slate-900/60 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Completed Tasks
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              {completedTasks.length}
            </span>
          </div>
        </div>

        {completedTasks.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-500">
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
