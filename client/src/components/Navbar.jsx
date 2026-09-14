import { useState } from "react";
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
} from "./Icons";

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

        {/* User & Actions Area */}
        {user && (
          <div className="flex items-center gap-2 sm:gap-3">
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
