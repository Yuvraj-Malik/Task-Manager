import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  IconClipboardList,
  IconSettings,
  IconTag,
  IconCheckCircle,
  IconClock,
  IconAlertTriangle,
  IconX,
} from "./Icons";

const categories = [
  { id: "all", label: "All Tasks", color: "bg-slate-400" },
  { id: "Work", label: "Work", color: "bg-indigo-500" },
  { id: "Personal", label: "Personal", color: "bg-emerald-500" },
  { id: "Urgent", label: "Urgent", color: "bg-rose-500" },
  { id: "Other", label: "Other", color: "bg-purple-500" },
];

const Sidebar = ({
  isOpen,
  onClose,
  activeCategory = "all",
  onSelectCategory,
  taskStats,
}) => {
  const location = useLocation();
  const isDashboard = location.pathname === "/";
  const isSettings = location.pathname === "/settings";

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 ${
          isOpen ? "translate-x-0 shadow-xl md:shadow-none" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Mobile close button */}
          <div className="flex md:hidden items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Navigation Menu
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <IconX className="w-4 h-4" />
            </button>
          </div>

          {/* Primary Navigation */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-2.5">
              Views
            </p>
            <nav className="space-y-1">
              <Link
                to="/"
                onClick={() => {
                  if (onSelectCategory) onSelectCategory("all");
                  if (onClose) onClose();
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  isDashboard
                    ? "bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <IconClipboardList className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/settings"
                onClick={() => {
                  if (onClose) onClose();
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  isSettings
                    ? "bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <IconSettings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>

          {/* Categories Section */}
          {onSelectCategory && (
            <div>
              <div className="flex items-center justify-between mb-2 px-2.5">
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <IconTag className="w-3 h-3" />
                  <span>Categories</span>
                </p>
              </div>
              <div className="space-y-1">
                {categories.map((cat) => {
                  const active = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        onSelectCategory(cat.id);
                        if (onClose) onClose();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        active
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                        <span>{cat.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Productivity Snapshot Widget */}
          {taskStats && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Workspace Health
              </p>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <IconCheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    Completed
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {taskStats.completed || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <IconClock className="w-3.5 h-3.5 text-amber-500" />
                    Pending
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {taskStats.pending || 0}
                  </span>
                </div>
                {taskStats.overdue > 0 && (
                  <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <IconAlertTriangle className="w-3.5 h-3.5" />
                      Overdue
                    </span>
                    <span className="font-bold">{taskStats.overdue}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
          <span>TaskPulse v2.2</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title="System Operational" />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
