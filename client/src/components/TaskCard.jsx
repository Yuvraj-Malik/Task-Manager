import React from "react";
import {
  IconCalendar,
  IconCheck,
  IconClock,
  IconEdit,
  IconTrash,
  IconAlertCircle,
  IconLock,
} from "./Icons";

const priorityConfig = {
  high: {
    badgeClass:
      "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/50",
    dotClass: "bg-rose-500",
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
      "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    dotClass: "bg-slate-500 dark:bg-slate-400",
    label: "Low Priority",
  },
};

export const categoryStyles = {
  Work: {
    badgeClass:
      "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900/50",
    dotClass: "bg-blue-500",
  },
  Personal: {
    badgeClass:
      "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50",
    dotClass: "bg-emerald-500",
  },
  Urgent: {
    badgeClass:
      "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/50",
    dotClass: "bg-rose-500",
  },
  Other: {
    badgeClass:
      "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900/50",
    dotClass: "bg-purple-500",
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
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });

  let statusText = dateFormatted;
  let isOverdue = false;
  let isToday = false;

  if (!isCompleted) {
    if (diffDays < 0) {
      isOverdue = true;
      statusText = `Overdue (${dateFormatted})`;
    } else if (diffDays === 0) {
      isToday = true;
      statusText = `Due Today`;
    } else if (diffDays === 1) {
      statusText = `Due Tomorrow`;
    }
  }

  return { text: statusText, isOverdue, isToday };
};

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const isDone = task.status === "completed";
  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const catStyle =
    categoryStyles[task.category] || categoryStyles.Work;
  const dueInfo = formatDueDate(task.dueDate, isDone);

  return (
    <div
      className={`pro-card rounded-2xl p-5 flex flex-col justify-between transition-all border ${
        isDone
          ? "bg-slate-50/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 opacity-80"
          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700"
      }`}
    >
      <div>
        {/* Top Header: Priority badge, Category chip & action icons */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Priority Badge */}
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${priority.badgeClass}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${priority.dotClass}`}
              />
              {priority.label}
            </span>

            {/* Category Chip */}
            {task.category && (
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${catStyle.badgeClass}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${catStyle.dotClass}`} />
                {task.category}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Edit Button: ONLY available if NOT done */}
            {!isDone ? (
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                title="Edit Task"
                aria-label="Edit task"
              >
                <IconEdit className="w-4 h-4" />
              </button>
            ) : (
              <span
                className="p-1.5 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                title="Completed tasks are locked from editing"
                aria-label="Task locked"
              >
                <IconLock className="w-3.5 h-3.5" />
              </span>
            )}

            {/* Delete Button */}
            <button
              onClick={() => onDelete(task._id, task.title)}
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition cursor-pointer"
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
                ? "line-through text-slate-400 dark:text-slate-500"
                : "text-slate-900 dark:text-slate-100"
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p
              className={`text-xs sm:text-sm leading-relaxed line-clamp-3 ${
                isDone
                  ? "text-slate-400 dark:text-slate-500"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer: Due date & status button */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <div>
          {dueInfo ? (
            <div
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md ${
                dueInfo.isOverdue
                  ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 font-semibold"
                  : dueInfo.isToday
                  ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-semibold"
                  : "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800"
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
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
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
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:border-slate-400"
          }`}
        >
          <span
            className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
              isDone
                ? "bg-emerald-600 border-emerald-600 text-white"
                : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
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
