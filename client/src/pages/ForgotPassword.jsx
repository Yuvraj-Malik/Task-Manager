import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  IconAlertCircle,
  IconCheckCircle,
  IconEye,
  IconEyeOff,
  IconLock,
  IconMail,
  IconSpinner,
  IconShield,
} from "../components/Icons";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: request code, 2: verify & reset
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [demoCode, setDemoCode] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  // Step 1: Request verification code
  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    setError("");
    setSuccess("");
    setIsSubmitting(true);
    try {
      const res = await forgotPassword(email.trim());
      setDemoCode(res.resetCode || "");
      if (res.resetCode) {
        setCode(res.resetCode); // Pre-fill for ultra-convenient demo testing
      }
      setSuccess("Reset code generated! Please enter your new password below.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "No account found with this email");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Submit code and new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!code.trim()) {
      setError("Please enter the 6-digit reset code");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(email.trim(), code.trim(), newPassword);
      setSuccess("Password reset successfully! Redirecting to workspace...");
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please verify the code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F5F0] warm-grid-bg px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white shadow-xs mb-3 hover:scale-105 transition-transform">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            {step === 1 ? "Reset your password" : "Create new password"}
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            {step === 1
              ? "Enter your account email to receive a verification code"
              : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white p-7 sm:p-8 rounded-2xl shadow-sm border border-stone-200/90 animate-fade-in">
          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3 bg-orange-50 border border-orange-200 rounded-xl flex items-center gap-2 text-orange-700 text-xs font-semibold animate-fade-in">
              <IconAlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {success && (
            <div className="mb-5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-semibold animate-fade-in">
              <IconCheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          {/* Demo Helper Pill */}
          {demoCode && step === 2 && (
            <div className="mb-5 p-3 bg-blue-50 border border-blue-200/90 rounded-xl text-xs text-blue-800 flex items-center justify-between animate-scale-in">
              <div className="flex items-center gap-2">
                <IconShield className="w-4 h-4 text-blue-600" />
                <span>Verification Code:</span>
              </div>
              <span className="font-mono font-bold tracking-widest text-sm text-blue-900 bg-white px-2.5 py-0.5 rounded-lg border border-blue-200">
                {demoCode}
              </span>
            </div>
          )}

          {step === 1 ? (
            /* Step 1: Request Verification Code */
            <form onSubmit={handleRequestCode} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Account Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <IconMail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50/70 border border-stone-300 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-xs hover:shadow cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <IconSpinner className="w-4 h-4" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <span>Send Reset Code</span>
                )}
              </button>
            </form>
          ) : (
            /* Step 2: Enter Code and New Password */
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* 6-Digit Code */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50/70 border border-stone-300 rounded-xl text-center tracking-widest font-mono text-base font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <IconLock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-stone-50/70 border border-stone-300 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 transition cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <IconLock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50/70 border border-stone-300 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-xs hover:shadow cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <IconSpinner className="w-4 h-4" />
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <span>Update Password & Sign In</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError("");
                  setSuccess("");
                }}
                className="w-full text-xs text-stone-500 hover:text-stone-700 py-1 transition cursor-pointer"
              >
                ← Back to enter another email
              </button>
            </form>
          )}

          {/* Back to Login link */}
          <div className="mt-6 pt-4 border-t border-stone-100 text-center">
            <p className="text-xs text-stone-500">
              Remembered your password?{" "}
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
