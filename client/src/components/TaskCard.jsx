import React from "react";
import { IconCalendar, IconCheck, IconClock, IconEdit, IconTrash, IconAlertCircle } from "./Icons";

const priorityConfig = {
  high: {
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    dotClass: "bg-rose-500",
    label: "High Priority",
  },
  medium: {
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    dotClass: "bg-amber-500",
    label: "Medium Priority",
  },
  low: {
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    dotClass: "bg-slate-500",
    label: "Low Priority",
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
  const dueInfo = formatDueDate(task.dueDate, isDone);

  return (
    <div
      className={`pro-card rounded-xl p-5 flex flex-col justify-between transition-all ${
        isDone ? "bg-slate-50/70 opacity-80" : "bg-white"
      }`}
    >
      <div>
        {/* Top Header: Priority badge & action icons */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${priority.badgeClass}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${priority.dotClass}`} />
            {priority.label}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition cursor-pointer"
              title="Edit Task"
              aria-label="Edit task"
            >
              <IconEdit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task._id, task.title)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
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
              isDone ? "line-through text-slate-400" : "text-slate-900"
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p
              className={`text-xs sm:text-sm leading-relaxed line-clamp-3 ${
                isDone ? "text-slate-400" : "text-slate-600"
              }`}
            >
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer: Due date & status button */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <div>
          {dueInfo ? (
            <div
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded ${
                dueInfo.isOverdue
                  ? "bg-rose-50 text-rose-700 font-semibold"
                  : dueInfo.isToday
                  ? "bg-amber-50 text-amber-700 font-semibold"
                  : "text-slate-500 bg-slate-100"
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
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-400">
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
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400"
          }`}
        >
          <span
            className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
              isDone
                ? "bg-emerald-600 border-emerald-600 text-white"
                : "border-slate-300 bg-white"
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
