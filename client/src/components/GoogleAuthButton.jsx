import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { IconSpinner } from "./Icons";

export const GoogleIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

const GoogleAuthButton = ({
  mode = "signin",
  onError,
  className = "",
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (loading || disabled) return;
    setLoading(true);
    if (onError) onError("");

    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") {
        // User voluntarily closed the Google popup window
        setLoading(false);
        return;
      }
      if (err.code === "auth/cancelled-popup-request") {
        setLoading(false);
        return;
      }
      const message =
        err.response?.data?.message ||
        err.message ||
        "Google authentication failed. Please try again.";
      if (onError) {
        onError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const label =
    mode === "signup" ? "Sign up with Google" : "Continue with Google";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || disabled}
      aria-label={label}
      className={`w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white hover:bg-slate-50/80 active:scale-[0.99] border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 shadow-xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <>
          <IconSpinner className="w-4 h-4 text-slate-600" />
          <span>Connecting to Google...</span>
        </>
      ) : (
        <>
          <GoogleIcon className="w-4 h-4 shrink-0" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};

export default GoogleAuthButton;
