# TaskPulse - Production Deployment Guide (Render & Netlify)

This guide walks you through deploying the full-stack TaskPulse application:
- **Backend API**: Deployed on [Render](https://render.com) (Free Web Service)
- **Frontend App**: Deployed on [Netlify](https://netlify.com) (Free Static Site)

---

## Part 1: Deploy Backend to Render (5 Minutes)

### Step 1: Create Web Service on Render
1. Log in to [dashboard.render.com](https://dashboard.render.com).
2. Click **New +** → Select **Web Service**.
3. Connect your GitHub repository (`Task-Manager`).
4. Configure the service settings:
   - **Name**: `taskpulse-api` (or your preferred name)
   - **Region**: Oregon (or closest to you)
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### Step 2: Add Environment Variables on Render
Under the **Environment Variables** tab, add the following:

| Key | Value / Notes |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `10000` (Render handles this automatically) |
| `MONGO_URI` | Your MongoDB Atlas connection string (from `.env`) |
| `JWT_SECRET` | Your secure 64-char JWT secret (from `.env`) |
| `CLIENT_URL` | Your frontend Netlify URL (e.g. `https://your-taskpulse.netlify.app`) |
| `FIREBASE_PROJECT_ID` | `taskpulse-1fcdb` (from `.env`) |
| `GEMINI_API_KEY` | *(Optional)* Your Google Gemini API Key |

5. Click **Create Web Service**.
6. Once deployed, Render will provide your public backend URL, for example:
   `https://taskpulse-api.onrender.com`

---

## Part 2: Deploy Frontend to Netlify (3 Minutes)

### Step 1: Connect Repository to Netlify
1. Log in to [app.netlify.com](https://app.netlify.com).
2. Click **Add new site** → **Import an existing project**.
3. Choose **GitHub** and authorize your `Task-Manager` repository.

### Step 2: Configure Build Settings
Netlify will automatically detect `netlify.toml`, but confirm the following settings:
- **Base directory**: `client` (or leave empty if using root `netlify.toml`)
- **Build command**: `npm run build`
- **Publish directory**: `dist` (or `client/dist` if building from root)

### Step 3: Add Environment Variables on Netlify
Under **Site configuration** → **Environment variables**, add:

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://your-backend-service.onrender.com/api` (Render backend URL with `/api`) |
| `VITE_FIREBASE_API_KEY` | Your Firebase API Key (from `.env`) |
| `VITE_FIREBASE_AUTH_DOMAIN` | `taskpulse-1fcdb.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `taskpulse-1fcdb` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `taskpulse-1fcdb.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `608668472492` |
| `VITE_FIREBASE_APP_ID` | `1:608668472492:web:6062d6bf1a521750d2fb09` |

4. Click **Deploy site**.
5. Netlify will generate your live URL (e.g. `https://taskpulse.netlify.app`).

---

## Part 3: Final 1-Minute Connection

1. Copy your live Netlify domain (e.g. `https://taskpulse.netlify.app`).
2. Go back to Render → your Web Service → **Environment Variables**.
3. Update `CLIENT_URL` to match your live Netlify domain:
   ```
   CLIENT_URL=https://taskpulse.netlify.app
   ```
4. Click **Save Changes** (Render will automatically redeploy).
5. In Firebase Console:
   - Go to **Authentication** → **Settings** → **Authorized domains**.
   - Add your Netlify domain (`taskpulse.netlify.app`) so Google Sign-In works on production!

---

## Summary of Configured Files
- `client/public/_redirects`: Prevents Netlify 404 on page refresh for React Router.
- `netlify.toml`: Netlify build configuration and security headers.
- `render.yaml`: Infrastructure-as-code blueprint for Render.
- `client/src/api/axios.js`: Dynamic `VITE_API_URL` routing for production.
- `server/src/utils/token.js`: `sameSite: "none"` and `secure: true` for cross-site cookie auth.
- `server/src/app.js`: Dynamic CORS matching Netlify domains + health check.
