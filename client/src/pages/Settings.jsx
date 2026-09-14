import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  IconAlertCircle,
  IconCheck,
  IconEye,
  IconEyeOff,
  IconLock,
  IconMail,
  IconMoon,
  IconShield,
  IconSpinner,
  IconSun,
  IconUser,
} from "../components/Icons";

const Settings = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const { theme, isDark, toggleTheme, setTheme } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      setProfileError("Full name and email address are required.");
      return;
    }

    setProfileSubmitting(true);
    try {
      await updateProfile({
        name: profileForm.name.trim(),
        email: profileForm.email.trim(),
      });
      setProfileSuccess("Profile information updated successfully.");
    } catch (err) {
      setProfileError(
        err.response?.data?.message || "Failed to update profile. Please try again."
      );
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setPasswordSubmitting(true);
    try {
      await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordSuccess("Password updated successfully.");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Failed to update password. Check current password."
      );
    } finally {
      setPasswordSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] dark:bg-[#121215] text-stone-900 dark:text-stone-100 warm-grid-bg transition-colors">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex w-full">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-4xl px-4 sm:px-8 py-8 mx-auto w-full space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Account & Workspace Settings
            </h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              Manage your personal credentials, system appearance, and account security.
            </p>
          </div>

          {/* Appearance / Theme Settings Card */}
          <section className="bg-white dark:bg-[#1A1A1E] border border-stone-200/90 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
              <div>
                <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                  Interface Appearance
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Choose between smooth warm Linen light mode and high-contrast Dark theme.
                </p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition cursor-pointer"
              >
                {isDark ? <IconSun className="w-4 h-4 text-amber-400" /> : <IconMoon className="w-4 h-4 text-stone-600" />}
                <span>Toggle: {isDark ? "Dark" : "Light"}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Light Mode Selector Card */}
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`p-4 rounded-xl border text-left transition cursor-pointer ${
                  theme === "light"
                    ? "border-blue-600 dark:border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 ring-2 ring-blue-500/20"
                    : "border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-semibold text-xs text-stone-800 dark:text-stone-200">
                    <IconSun className="w-4 h-4 text-amber-500" />
                    <span>Linen Light</span>
                  </div>
                  {theme === "light" && <IconCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                </div>
                <div className="h-10 rounded-lg bg-[#FAF8F4] border border-stone-200 flex items-center px-3 gap-2">
                  <div className="w-3 h-3 rounded bg-stone-300" />
                  <div className="h-2 w-16 rounded bg-stone-300" />
                </div>
              </button>

              {/* Dark Mode Selector Card */}
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`p-4 rounded-xl border text-left transition cursor-pointer ${
                  theme === "dark"
                    ? "border-blue-600 dark:border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 ring-2 ring-blue-500/20"
                    : "border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-semibold text-xs text-stone-800 dark:text-stone-200">
                    <IconMoon className="w-4 h-4 text-blue-400" />
                    <span>Graphite Dark</span>
                  </div>
                  {theme === "dark" && <IconCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                </div>
                <div className="h-10 rounded-lg bg-[#161619] border border-stone-800 flex items-center px-3 gap-2">
                  <div className="w-3 h-3 rounded bg-stone-700" />
                  <div className="h-2 w-16 rounded bg-stone-700" />
                </div>
              </button>
            </div>
          </section>

          {/* Profile Information Card */}
          <section className="bg-white dark:bg-[#1A1A1E] border border-stone-200/90 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="pb-4 border-b border-stone-100 dark:border-stone-800">
              <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                Profile Details
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Update your identity details across the workspace.
              </p>
            </div>

            {profileSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-2 animate-fade-in">
                <IconCheck className="w-4 h-4 shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 text-xs font-semibold rounded-xl flex items-center gap-2 animate-fade-in">
                <IconAlertCircle className="w-4 h-4 shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <IconUser className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50/70 dark:bg-stone-800/60 border border-stone-300 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <IconMail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50/70 dark:bg-stone-800/60 border border-stone-300 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={profileSubmitting}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {profileSubmitting ? (
                    <>
                      <IconSpinner className="w-4 h-4" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <span>Save Profile Changes</span>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* Security & Password Card */}
          <section className="bg-white dark:bg-[#1A1A1E] border border-stone-200/90 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <IconShield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                  Security & Password
                </h2>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Ensure your account is protected with a robust password of at least 6 characters.
              </p>
            </div>

            {passwordSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-2 animate-fade-in">
                <IconCheck className="w-4 h-4 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 text-xs font-semibold rounded-xl flex items-center gap-2 animate-fade-in">
                <IconAlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <IconLock className="w-4 h-4" />
                  </div>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))
                    }
                    className="w-full pl-10 pr-10 py-2.5 bg-stone-50/70 dark:bg-stone-800/60 border border-stone-300 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition cursor-pointer"
                  >
                    {showCurrentPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password & Confirm Password Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                    New Password (min 6 chars)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <IconLock className="w-4 h-4" />
                    </div>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))
                      }
                      className="w-full pl-10 pr-10 py-2.5 bg-stone-50/70 dark:bg-stone-800/60 border border-stone-300 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition cursor-pointer"
                    >
                      {showNewPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <IconLock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))
                      }
                      className="w-full pl-10 pr-10 py-2.5 bg-stone-50/70 dark:bg-stone-800/60 border border-stone-300 dark:border-stone-700 rounded-xl text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition cursor-pointer"
                    >
                      {showConfirmPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={passwordSubmitting}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {passwordSubmitting ? (
                    <>
                      <IconSpinner className="w-4 h-4" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Settings;
