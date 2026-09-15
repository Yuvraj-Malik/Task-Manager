import { useState, useEffect, useRef, useMemo } from "react";
import {
  IconSearch,
  IconPlus,
  IconSun,
  IconMoon,
  IconLayoutGrid,
  IconKanban,
  IconTag,
  IconCheckCircle,
  IconClock,
  IconX,
  IconCommand,
} from "./Icons";

const CommandPalette = ({
  isOpen,
  onClose,
  tasks = [],
  onOpenCreate,
  onSelectCategory,
  onSelectViewMode,
  onToggleTheme,
  onEditTask,
  onToggleTaskStatus,
  isDark,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Auto focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global keydown listeners for Escape and Arrow navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Compute filtered items
  const items = useMemo(() => {
    const q = query.trim().toLowerCase();

    const actions = [
      {
        id: "action-create",
        type: "action",
        title: "Create New Task",
        subtitle: "Add a new task to your workspace",
        shortcut: "N",
        icon: <IconPlus className="w-4 h-4 text-blue-600" />,
        run: () => {
          onClose();
          onOpenCreate();
        },
      },
      {
        id: "action-theme",
        type: "action",
        title: isDark ? "Switch to Light Mode" : "Switch to Dark Mode",
        subtitle: `Change visual theme to ${isDark ? "Warm Linen" : "Graphite Obsidian"}`,
        icon: isDark ? (
          <IconSun className="w-4 h-4 text-amber-400" />
        ) : (
          <IconMoon className="w-4 h-4 text-stone-600" />
        ),
        run: () => {
          onClose();
          onToggleTheme();
        },
      },
      {
        id: "action-grid",
        type: "action",
        title: "Switch to Grid View",
        subtitle: "View tasks in standard card grid layout",
        icon: <IconLayoutGrid className="w-4 h-4 text-stone-500" />,
        run: () => {
          onClose();
          onSelectViewMode("grid");
        },
      },
      {
        id: "action-kanban",
        type: "action",
        title: "Switch to Kanban View",
        subtitle: "View tasks organized by status columns",
        icon: <IconKanban className="w-4 h-4 text-stone-500" />,
        run: () => {
          onClose();
          onSelectViewMode("kanban");
        },
      },
    ];

    const categories = [
      { id: "cat-all", name: "all", label: "All Tasks", color: "bg-stone-400" },
      { id: "cat-work", name: "Work", label: "Work", color: "bg-blue-600" },
      { id: "cat-personal", name: "Personal", label: "Personal", color: "bg-emerald-600" },
      { id: "cat-urgent", name: "Urgent", label: "Urgent", color: "bg-orange-500" },
      { id: "cat-other", name: "Other", label: "Other", color: "bg-amber-600" },
    ].map((cat) => ({
      id: cat.id,
      type: "category",
      title: `Category: ${cat.label}`,
      subtitle: `Filter workspace by ${cat.label}`,
      icon: <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />,
      run: () => {
        onClose();
        onSelectCategory(cat.name);
      },
    }));

    const taskItems = tasks.map((t) => ({
      id: `task-${t._id}`,
      type: "task",
      title: t.title,
      subtitle: `${t.category || "General"} • ${t.status === "completed" ? "Completed" : "In Progress"}`,
      status: t.status,
      icon: t.status === "completed" ? (
        <IconCheckCircle className="w-4 h-4 text-emerald-600" />
      ) : (
        <IconClock className="w-4 h-4 text-amber-600" />
      ),
      run: () => {
        onClose();
        onEditTask(t);
      },
    }));

    const all = [...actions, ...categories, ...taskItems];
    if (!q) return all.slice(0, 10);

    return all.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q)
    ).slice(0, 15);
  }, [
    query,
    isDark,
    tasks,
    onClose,
    onOpenCreate,
    onToggleTheme,
    onSelectViewMode,
    onSelectCategory,
    onEditTask,
  ]);

  // Keep selectedIndex in range
  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (items[selectedIndex]) {
        items[selectedIndex].run();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-stone-900/60 dark:bg-black/75 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-[#1A1A1E] rounded-2xl shadow-2xl border border-stone-200/90 dark:border-stone-800 overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-stone-100 dark:border-stone-800 gap-3">
          <IconSearch className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, category, or task name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm sm:text-base text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-stone-400 bg-stone-100 dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="max-h-80 overflow-y-auto p-2 divide-y divide-stone-50 dark:divide-stone-900/50"
        >
          {items.length === 0 ? (
            <div className="p-8 text-center text-sm text-stone-400 dark:text-stone-500">
              No matching commands or tasks found for "{query}".
            </div>
          ) : (
            items.map((item, idx) => {
              const active = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.run}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                    active
                      ? "bg-stone-100 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 font-medium"
                      : "text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/40"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0 border border-stone-200/60 dark:border-stone-700/60">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold truncate text-stone-900 dark:text-stone-100">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-stone-400 dark:text-stone-500 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {item.shortcut && (
                      <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-stone-400 bg-stone-100 dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-700">
                        {item.shortcut}
                      </kbd>
                    )}
                    {active && (
                      <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hidden sm:inline">
                        Select ↵
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-stone-50/70 dark:bg-stone-900/50 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-400 dark:text-stone-500">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="px-1 py-0.2 text-[9px] font-mono bg-white dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-700">↑</kbd>
            <kbd className="px-1 py-0.2 text-[9px] font-mono bg-white dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-700">↓</kbd>
            <span>Execute:</span>
            <kbd className="px-1 py-0.2 text-[9px] font-mono bg-white dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-700">↵</kbd>
          </div>
          <span className="hidden sm:inline">Press Ctrl+K anytime</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
