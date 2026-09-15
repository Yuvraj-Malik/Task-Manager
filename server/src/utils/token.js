import jwt from "jsonwebtoken";

export const getCookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax", // 'none' required for cross-domain Netlify -> Render cookies
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
};

export const sendTokenCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, getCookieOptions());
};

export const clearTokenCookie = (res) => {
  const options = getCookieOptions();
  delete options.maxAge;
  res.clearCookie("token", options);
};
