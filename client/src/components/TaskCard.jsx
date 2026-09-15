import React, { useState } from "react";
import {
  IconCalendar,
  IconCheck,
  IconClock,
  IconEdit,
  IconTrash,
  IconAlertCircle,
  IconLock,
  IconChevronDown,
} from "./Icons";

const priorityConfig = {
  high: {
    badgeClass:
      "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900/50",
    dotClass: "bg-orange-500",
    label: "High Priority",
  },
  medium: {
    badgeClass:
      "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50",
    dotClass: "bg-amber-500",
    label: "Medium Priority",
  },
  low: {
    badgeClass:
      "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700",
    dotClass: "bg-stone-400 dark:bg-stone-500",
    label: "Low Priority",
  },
};

export const categoryStyles = {
  Work: {
    badgeClass:
      "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900/50",
    dotClass: "bg-blue-600",
  },
  Personal: {
    badgeClass:
      "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50",
    dotClass: "bg-emerald-600",
  },
  Urgent: {
    badgeClass:
      "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900/50",
    dotClass: "bg-orange-500",
  },
  Other: {
    badgeClass:
      "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700",
    dotClass: "bg-stone-500",
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
  let isToday = false;

  if (!isCompleted && diffDays < 0) {
    statusText = `${dateFormatted} (Overdue)`;
    isOverdue = true;
  } else if (!isCompleted && diffDays === 0) {
    statusText = "Due Today";
    isToday = true;
  } else if (!isCompleted && diffDays === 1) {
    statusText = "Due Tomorrow";
  }

  return { text: statusText, isOverdue, isToday };
};

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus, onToggleSubtask }) => {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const isDone = task.status === "completed";
  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const catStyle = categoryStyles[task.category] || {
    badgeClass:
      "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700",
    dotClass: "bg-stone-500",
  };
  const dueInfo = formatDueDate(task.dueDate, isDone);

  const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter((s) => s.completed).length;
  const percentSubtasks = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return (
    <div
      className={`pro-card p-4 sm:p-5 flex flex-col justify-between relative group transition-all duration-200 ${
        isDone
          ? "opacity-75 bg-stone-50/50 dark:bg-stone-900/40"
          : dueInfo?.isOverdue
          ? "border-l-4 border-l-red-500/90 shadow-2xs"
          : dueInfo?.isToday
          ? "border-l-4 border-l-amber-500/90"
          : ""
      }`}
    >
      <div>
        {/* Card Header: Priority, Category, and Action Buttons */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Priority Badge */}
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${priority.badgeClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${priority.dotClass}`} />
              {priority.label}
            </span>

            {/* Category Badge */}
            {task.category && (
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${catStyle.badgeClass}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${catStyle.dotClass}`} />
                {task.category}
              </span>
            )}

            {/* Urgency Badge Indicator */}
            {dueInfo?.isOverdue && (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/60 animate-fade-in">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                </span>
                OVERDUE
              </span>
            )}

            {dueInfo?.isToday && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60 animate-fade-in">
                <span>⚡</span>
                DUE TODAY
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Edit Button: ONLY available if NOT done */}
            {!isDone ? (
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition cursor-pointer"
                title="Edit Task"
                aria-label="Edit task"
              >
                <IconEdit className="w-4 h-4" />
              </button>
            ) : (
              <span
                className="p-1.5 text-stone-400 dark:text-stone-600 cursor-not-allowed"
                title="Completed tasks are locked from editing"
                aria-label="Task locked"
              >
                <IconLock className="w-3.5 h-3.5" />
              </span>
            )}

            {/* Delete Button */}
            <button
              onClick={() => onDelete(task._id, task.title)}
              className="p-1.5 text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/50 rounded-lg transition cursor-pointer"
              title="Delete Task"
              aria-label="Delete task"
            >
              <IconTrash className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <h3
            className={`text-sm sm:text-base font-semibold transition-all line-clamp-2 ${
              isDone
                ? "line-through text-stone-400 dark:text-stone-500"
                : "text-stone-900 dark:text-stone-100"
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p
              className={`text-xs sm:text-sm leading-relaxed line-clamp-3 ${
                isDone
                  ? "text-stone-400 dark:text-stone-500"
                  : "text-stone-600 dark:text-stone-400"
              }`}
            >
              {task.description}
            </p>
          )}
        </div>

        {/* Subtasks Progress & Expandable Checklist */}
        {totalSubtasks > 0 && (
          <div className="mt-3 pt-2.5 border-t border-stone-100/90 dark:border-stone-800/60">
            <button
              type="button"
              onClick={() => setShowSubtasks(!showSubtasks)}
              className="w-full flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 cursor-pointer group"
            >
              <span className="font-semibold text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Subtasks ({completedSubtasks}/{totalSubtasks})
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400 font-semibold">
                  {percentSubtasks}%
                </span>
                <IconChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    showSubtasks ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {/* Visual Progress Bar */}
            <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1 mt-1.5 overflow-hidden">
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  percentSubtasks === 100
                    ? "bg-emerald-600 dark:bg-emerald-500"
                    : "bg-blue-600 dark:bg-blue-500"
                }`}
                style={{ width: `${percentSubtasks}%` }}
              />
            </div>

            {/* Expanded Subtasks List */}
            {showSubtasks && (
              <div className="mt-2 space-y-1 animate-fade-in">
                {subtasks.map((sub, idx) => (
                  <label
                    key={sub._id || idx}
                    className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-stone-100/60 dark:hover:bg-stone-800/40 text-xs cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      checked={sub.completed}
                      onChange={() => onToggleSubtask && onToggleSubtask(task._id, sub._id || idx)}
                      className="mt-0.5 w-3 h-3 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span
                      className={`leading-tight select-none ${
                        sub.completed
                          ? "line-through text-stone-400 dark:text-stone-500"
                          : "text-stone-700 dark:text-stone-300"
                      }`}
                    >
                      {sub.title}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Due date & status button */}
      <div className="mt-4 pt-3.5 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-2">
        <div>
          {dueInfo ? (
            <div
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md ${
                dueInfo.isOverdue
                  ? "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 font-semibold"
                  : dueInfo.isToday
                  ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-semibold"
                  : "text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800"
              }`}
            >
              {dueInfo.isOverdue ? (
                <IconAlertCircle className="w-3.5 h-3.5" />
              ) : (
                <IconCalendar className="w-3.5 h-3.5" />
              )}
              <span>{dueInfo.text}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 text-xs text-stone-400 dark:text-stone-500">
              <IconClock className="w-3.5 h-3.5" />
              <span>No due date</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onToggleStatus(task)}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
            isDone
              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/60"
              : "bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700/60 hover:border-stone-400"
          }`}
        >
          <span
            className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
              isDone
                ? "bg-emerald-600 border-emerald-600 text-white"
                : "border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800"
            }`}
          >
            {isDone && <IconCheck className="w-3 h-3 stroke-[3]" />}
          </span>
          <span>{isDone ? "Completed" : "Mark Done"}</span>
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
