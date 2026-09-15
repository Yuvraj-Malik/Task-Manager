import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  IconLogOut,
  IconMenu,
  IconMoon,
  IconSettings,
  IconSpinner,
  IconSun,
  IconBell,
  IconCommand,
  IconAlertCircle,
  IconClock,
  IconCheck,
} from "./Icons";

const Navbar = ({ onToggleSidebar, onOpenCommandPalette, tasks = [], onSelectTask }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [loggingOut, setLoggingOut] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const bellDropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close notifications dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellDropdownRef.current && !bellDropdownRef.current.contains(e.target)) {
        setBellOpen(false);
      }
    };
    if (bellOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [bellOpen]);

  // Compute urgent notifications (Overdue & Due Today tasks)
  const urgentNotifications = useMemo(() => {
    const now = new Date();
    const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const overdue = [];
    const dueToday = [];

    tasks.forEach((task) => {
      if (task.status === "completed" || !task.dueDate) return;
      const d = new Date(task.dueDate);
      const dMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const diffDays = Math.round((dMidnight - nowMidnight) / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        overdue.push({
          ...task,
          urgencyType: "overdue",
          daysDiff: Math.abs(diffDays),
        });
      } else if (diffDays === 0) {
        dueToday.push({
          ...task,
          urgencyType: "today",
        });
      }
    });

    return {
      overdue,
      dueToday,
      totalCount: overdue.length + dueToday.length,
    };
  }, [tasks]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      navigate("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F4]/80 dark:bg-[#161619]/80 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 transition-colors">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/80 rounded-lg md:hidden transition cursor-pointer"
              title="Toggle Menu"
              aria-label="Toggle navigation menu"
            >
              <IconMenu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-blue-600 dark:bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-900 dark:text-stone-100 tracking-tight text-base sm:text-lg">
                TaskPulse
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200/90 dark:border-stone-700 hidden sm:inline-block">
                Workspace
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Command Palette Trigger */}
        {user && onOpenCommandPalette && (
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-stone-200/90 dark:border-stone-700/80 bg-stone-50/80 dark:bg-stone-800/50 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 text-xs font-medium transition cursor-pointer shadow-2xs"
            title="Open Command Palette (Ctrl+K)"
          >
            <IconCommand className="w-3.5 h-3.5" />
            <span>Search or command...</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-stone-400 bg-white dark:bg-stone-900 rounded border border-stone-200 dark:border-stone-700">
              Ctrl K
            </kbd>
          </button>
        )}

        {/* User & Actions Area */}
        {user && (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell with Urgency Badge & Dropdown */}
            <div className="relative" ref={bellDropdownRef}>
              <button
                type="button"
                onClick={() => setBellOpen(!bellOpen)}
                className="relative p-2 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700 transition cursor-pointer"
                title="View Deadline Alerts"
                aria-label="Deadline Notifications"
              >
                <IconBell className="w-4 h-4" />
                {urgentNotifications.totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-xs animate-scale-in">
                    {urgentNotifications.totalCount}
                  </span>
                )}
              </button>

              {/* Deadline Center Dropdown */}
              {bellOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#1A1A1E] rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 p-3 z-50 animate-scale-in">
                  <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-stone-100 dark:border-stone-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                        Deadline Center
                      </span>
                      {urgentNotifications.totalCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/60">
                          {urgentNotifications.totalCount} urgent
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-400">Action Required</span>
                  </div>

                  {urgentNotifications.totalCount === 0 ? (
                    <div className="p-6 text-center text-xs text-stone-500 dark:text-stone-400">
                      <IconCheck className="w-5 h-5 mx-auto mb-1.5 text-emerald-600" />
                      <p className="font-semibold text-stone-800 dark:text-stone-200">
                        All deadlines are clear!
                      </p>
                      <p className="text-[11px] mt-0.5">No overdue tasks or tasks due today.</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                      {/* Overdue Section */}
                      {urgentNotifications.overdue.map((task) => (
                        <div
                          key={task._id}
                          onClick={() => {
                            setBellOpen(false);
                            if (onSelectTask) onSelectTask(task);
                          }}
                          className="p-2.5 rounded-xl bg-red-50/50 dark:bg-red-950/30 border border-red-200/70 dark:border-red-900/50 hover:bg-red-100/60 dark:hover:bg-red-900/40 transition cursor-pointer"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                              {task.title}
                            </p>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 shrink-0">
                              Overdue by {task.daysDiff}d
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 truncate">
                            Category: {task.category || "General"}
                          </p>
                        </div>
                      ))}

                      {/* Due Today Section */}
                      {urgentNotifications.dueToday.map((task) => (
                        <div
                          key={task._id}
                          onClick={() => {
                            setBellOpen(false);
                            if (onSelectTask) onSelectTask(task);
                          }}
                          className="p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 hover:bg-amber-100/60 dark:hover:bg-amber-900/40 transition cursor-pointer"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                              {task.title}
                            </p>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 shrink-0">
                              Due Today
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 truncate">
                            Category: {task.category || "General"}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700 transition cursor-pointer"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              aria-label="Toggle theme"
            >
              {isDark ? <IconSun className="w-4 h-4 text-amber-400" /> : <IconMoon className="w-4 h-4 text-stone-600" />}
            </button>

            {/* Settings Link */}
            <Link
              to="/settings"
              className={`p-2 rounded-xl border transition cursor-pointer ${
                location.pathname === "/settings"
                  ? "bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-600 text-stone-900 dark:text-stone-100"
                  : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/80 border-stone-200 dark:border-stone-700"
              }`}
              title="Account & System Settings"
              aria-label="Settings"
            >
              <IconSettings className="w-4 h-4" />
            </Link>

            {/* User chip */}
            <Link
              to="/settings"
              className="flex items-center gap-2.5 py-1 px-2.5 rounded-xl border border-stone-200/90 dark:border-stone-700 bg-stone-50/80 dark:bg-stone-800/60 hover:border-stone-300 dark:hover:border-stone-600 transition"
              title="View settings"
            >
              <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold">
                {getInitials(user.name)}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-semibold text-stone-800 dark:text-stone-200 leading-tight">
                  {user.name}
                </p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-none">
                  {user.email}
                </p>
              </div>
            </Link>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              title="Log out of your account"
            >
              {loggingOut ? (
                <IconSpinner className="w-3.5 h-3.5 text-stone-500" />
              ) : (
                <IconLogOut className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
