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
      "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/50",
    dotClass: "bg-rose-500",
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
      "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    dotClass: "bg-slate-500 dark:bg-slate-400",
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
  const catStyle = categoryStyles[task.category] || categoryStyles.Work;
  const dueInfo = formatDueDate(task.dueDate, isDone);

  return (
    <div
      className={`pro-card rounded-xl p-4 mb-3 transition-all border ${
        isDone
          ? "bg-slate-50/80 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800/80 opacity-85"
          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700"
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${priority.badgeClass}`}
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
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded transition cursor-pointer"
              title="Edit"
            >
              <IconEdit className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span
              className="p-1 text-slate-400 dark:text-slate-600 cursor-not-allowed"
              title="Completed tasks are locked from editing"
            >
              <IconLock className="w-3 h-3" />
            </span>
          )}

          <button
            onClick={() => onDelete(task._id, task.title)}
            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition cursor-pointer"
            title="Delete"
          >
            <IconTrash className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <h4
        className={`text-sm font-semibold line-clamp-2 ${
          isDone
            ? "line-through text-slate-400 dark:text-slate-500"
            : "text-slate-900 dark:text-slate-100"
        }`}
      >
        {task.title}
      </h4>

      {task.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        {dueInfo ? (
          <span
            className={`text-xs inline-flex items-center gap-1 ${
              dueInfo.isOverdue
                ? "text-rose-600 dark:text-rose-400 font-semibold"
                : "text-slate-500 dark:text-slate-400"
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
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            No deadline
          </span>
        )}

        <button
          onClick={() => onToggleStatus(task)}
          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
            isDone
              ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700"
              : "bg-slate-900 dark:bg-indigo-600 text-white hover:bg-slate-800 dark:hover:bg-indigo-700 border-slate-900 dark:border-indigo-600"
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
      <div className="bg-slate-100/70 dark:bg-slate-900/60 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              In Progress / Pending
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {pendingTasks.length}
            </span>
          </div>

          <button
            onClick={onOpenCreate}
            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 rounded-lg transition cursor-pointer"
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
