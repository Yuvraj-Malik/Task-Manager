import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoogleAuthButton from "../components/GoogleAuthButton";
import {
  IconAlertCircle,
  IconEye,
  IconEyeOff,
  IconLock,
  IconMail,
  IconSpinner,
  IconUser,
} from "../components/Icons";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F5F0] warm-grid-bg px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white shadow-xs mb-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Get started with your personal task workspace
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-7 sm:p-8 rounded-2xl shadow-sm border border-stone-200/90">
          {error && (
            <div className="mb-5 p-3 bg-orange-50 border border-orange-200 rounded-xl flex items-center gap-2 text-orange-700 text-xs font-semibold animate-fade-in">
              <IconAlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <IconUser className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50/70 border border-stone-300 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <IconMail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50/70 border border-stone-300 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-stone-400">Min. 6 characters</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <IconLock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full pl-10 pr-10 py-2.5 bg-stone-50/70 border border-stone-300 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 transition cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-xs hover:shadow cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <IconSpinner className="w-4 h-4" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-stone-200" />
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
              Or continue with
            </span>
            <div className="h-px flex-1 bg-stone-200" />
          </div>

          {/* Google Sign Up */}
          <div className="w-full">
            <GoogleAuthButton mode="signup" onError={setError} />
          </div>

          <div className="mt-6 pt-5 border-t border-stone-100 text-center">
            <p className="text-xs text-stone-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Security badge */}
        <p className="text-center text-[11px] text-stone-400 mt-6">
          Encrypted database storage with MongoDB Atlas & JWT auth cookies
        </p>
      </div>
    </div>
  );
};

export default Register;
