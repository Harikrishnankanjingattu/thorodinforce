# THOR — God of Thunder & Guardian of the Storm-Wearied (Vanilla Edition)

> **Zero Build Step** framework-free edition of the interactive superhero platform & conversational AI guardian. Built with pure HTML5, CSS3, and ES Module JavaScript.

---

## ⚡ Architecture & File Structure

```
thor-vanilla/
├── index.html       → All semantic markup (Landing sections, Modals, Drawers, Chat views, SVGs)
├── styles.css       → Pure CSS design system, palette tokens, Cyber-Neobrutalism, animations & keyframes
├── script.js        → Pure ES module (Web Audio engine, StormCanvas, Firebase Auth, Router, Thor AI chat)
├── assets/          → Unaltered static media (mjolnir.jpg, thor-avatar.jpg, thor-hero.jpg)
├── favicon.svg      → High-voltage Norse thunderbolt favicon
├── api/             → Vercel Serverless Functions
│   ├── chat.js      → NVIDIA NIM AI proxy (GPT-OSS-20B, Llama-3.2, GLM-5.3)
│   ├── send-email.js→ Email dispatch (Resend API, Nodemailer SMTP, or Raven Simulation)
│   └── tts.js       → Microsoft Edge Neural TTS audio streamer
├── vercel.json      → Static hosting rewrites (/api and client routing)
└── README.md        → Documentation & deployment guide
```

---

## 🚀 Running Locally

No `npm install`, `vite`, or compilation steps are needed. Serve the `thor-vanilla` directory directly with any static web server:

### Option A: Using `serve`
```bash
npx serve thor-vanilla -p 3000
```
Open `http://localhost:3000` in your browser.

### Option B: Using Python
```bash
cd thor-vanilla
python -m http.server 3000
```
Open `http://localhost:3000` in your browser.

### Option C: Using VS Code / IDE Live Server
Right-click `thor-vanilla/index.html` and click **"Open with Live Server"**.

---

## 🌐 Deploying to Vercel

1. Push or upload the `thor-vanilla` folder to GitHub.
2. In [Vercel](https://vercel.com), click **Add New Project** and import the repository.
3. Set the **Root Directory** to `thor-vanilla` (or leave default if the repository root is `thor-vanilla`).
4. Set **Framework Preset** to **Other** (no build command needed).
5. Add Environment Variables (optional, see below).
6. Click **Deploy**.

---

## 🔑 Environment Variables (Vercel Project Settings)

| Variable | Description | Default / Fallback |
| :--- | :--- | :--- |
| `NVIDIA_API_KEY` | Optional server-side NVIDIA NIM API key for LLM responses | Pre-configured client key with client-side modal override |
| `CANDIDATE_EMAIL` | Recipient email address for mortal distress signals | `harikrishnankanjingattu2005@gmail.com` |
| `RESEND_API_KEY` | Optional Resend API key for cloud email delivery | Falls back to SMTP or verified Raven Simulation |
| `SMTP_HOST` | SMTP server host (e.g. `smtp.gmail.com`) | Falls back to verified Raven Simulation |
| `SMTP_PORT` | SMTP port (e.g. `587`) | `587` |
| `SMTP_USER` | SMTP username | Optional |
| `SMTP_PASS` | SMTP app password | Optional |

---

## 🛡️ Firebase Authorized Domain Setup

1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Select the project: `thor-b248f`.
3. Go to **Authentication** → **Settings** → **Authorized domains**.
4. Click **Add domain** and enter your production domain (e.g. `your-app.vercel.app` or custom domain).
5. If running locally or from an un-authorized domain, Thor provides an immediate **"Enter as Guest Warrior"** clearance with 100% full feature parity and an on-screen domain copy button for evaluators.

---

## ⚡ Highlights

- **Zero Build Step**: Pure HTML/CSS/JS with ES module CDN imports.
- **Strict 2-Color Design**: Pitch Black (`#000000`) and Electric Neon Blue (`#00f2fe`).
- **Web Audio API Engine**: Synthesizes real thunder rumbles, lightning cracks, and Norse runic chimes without audio asset dependencies.
- **Interactive Storm Canvas**: 220 rain particles, 45 embers, sky bloom, and click-to-strike branched lightning bolts.
- **Thor AI Chat & Voice**: Neural audio voice playback + real-time LLM intelligence.
