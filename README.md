# Lumenci Assistant — AI Patent Claim Chart Refinement

## Deploy to Railway (Step-by-Step)

### Option A: Deploy via GitHub (Recommended)

1. **Create a GitHub repo**
   ```bash
   # Unzip the project
   unzip lumenci-app.zip
   cd lumenci-app

   # Initialize git
   git init
   git add .
   git commit -m "Initial commit - Lumenci Assistant"

   # Create repo on GitHub, then push
   git remote add origin https://github.com/YOUR_USERNAME/lumenci-assistant.git
   git branch -M main
   git push -u origin main
   ```

2. **Go to Railway**
   - Visit [railway.app](https://railway.app) and sign in with GitHub
   - Click **"New Project"**
   - Select **"Deploy from GitHub Repo"**
   - Choose your `lumenci-assistant` repo

3. **Railway auto-detects everything**
   - It reads `railway.json` and uses the Dockerfile
   - Build starts automatically
   - Wait ~2 minutes for deployment

4. **Get your public URL**
   - Go to **Settings → Networking → Generate Domain**
   - Click **"Generate Domain"**
   - Your app is live at `https://lumenci-assistant-xxxx.up.railway.app`

### Option B: Deploy via Railway CLI

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and deploy**
   ```bash
   cd lumenci-app
   railway login
   railway init        # Creates a new project
   railway up          # Deploys the app
   railway domain      # Generates a public URL
   ```

### Option C: Deploy via Vercel (Alternative)

1. Push to GitHub (same as Step 1 above)
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repo
4. Framework: **Vite** (auto-detected)
5. Click Deploy — done in 30 seconds

---

## Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Build for Production

```bash
npm run build
npm run preview
```

## Features
- AI chat-based claim chart refinement
- Voice-narrated product demo (Web Speech API)
- Volume control + playback speed
- Help assistant bot
- Lumenci branding (orange #E8531E)
- Export simulation (Word, PDF, CSV)
- Source verification tags + quality scoring
