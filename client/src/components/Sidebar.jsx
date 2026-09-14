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
  { id: "all", label: "All Tasks", color: "bg-stone-400" },
  { id: "Work", label: "Work", color: "bg-blue-600" },
  { id: "Personal", label: "Personal", color: "bg-emerald-600" },
  { id: "Urgent", label: "Urgent", color: "bg-orange-500" },
  { id: "Other", label: "Other", color: "bg-amber-600" },
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
          className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-xs md:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-[#FAF8F4] dark:bg-[#161619] border-r border-stone-200/80 dark:border-stone-800 flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 ${
          isOpen ? "translate-x-0 shadow-xl md:shadow-none" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Mobile close button */}
          <div className="flex md:hidden items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Navigation Menu
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
            >
              <IconX className="w-4 h-4" />
            </button>
          </div>

          {/* Primary Navigation */}
          <div>
            <p className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-2 px-2.5">
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
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/60"
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
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/60"
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
                <p className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
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
                          ? "bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold"
                          : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100/70 dark:hover:bg-stone-800/40"
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
            <div className="p-3.5 rounded-2xl bg-stone-100/70 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-800/80 space-y-2">
              <p className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                Workspace Health
              </p>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
                  <span className="flex items-center gap-1.5">
                    <IconCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Completed
                  </span>
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    {taskStats.completed || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
                  <span className="flex items-center gap-1.5">
                    <IconClock className="w-3.5 h-3.5 text-amber-600" />
                    Pending
                  </span>
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    {taskStats.pending || 0}
                  </span>
                </div>
                {taskStats.overdue > 0 && (
                  <div className="flex items-center justify-between text-orange-600 dark:text-orange-400 font-medium">
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
        <div className="p-4 border-t border-stone-200/70 dark:border-stone-800/80 text-[11px] text-stone-400 dark:text-stone-500 flex items-center justify-between">
          <span>TaskPulse v2.2</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-600" title="System Operational" />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
