# ⚡ THOR — Interactive Superhero Platform & AI Conversational Guardian

> **White Matrix Assignment Submission**  
> **Superhero:** Thor, God of Thunder (Original Norse Mythological Interpretation)  
> **Date:** September 13, 2026  
> **Contact:** +91 88 91 67 61 43 · info@whitematrix.co.in · [www.whitematrix.co.in](https://www.whitematrix.co.in)

---

## 🌩️ Overview

**THOR** is an immersive superhero landing page and conversational AI platform that reimagines traditional "Contact Us" forms into an authentic narrative encounter with **Thor, God of Thunder**. 

Rooted in public-domain Norse mythology rather than Marvel/Disney cinematic depictions, this project showcases an original visual identity, bespoke artwork, dynamic storm canvas simulations, Web Audio API sound synthesis, and an interactive conversational state machine that captures visitor grievances and dispatches real-time email notifications to the hero's real-world alter ego.

---

## ✨ Key Features

### 1. Module A — Story & Mythic Identity
- **Atmospheric Storm Canvas**: HTML5 Canvas engine simulating angled rain particles, drifting smoke clouds, rising electric embers, and randomized fractal lightning discharges.
- **Dynamic Lighting & Transitions**: Page-load lightning intro transition, full-screen thunder-crack strobe overlays on summon triggers, and glowing electric borders.
- **Narrative Chronicle (Origin Lore)**: Interactive 4-chapter progression detailing Thor's pride in Asgard, the fateful mortal tempest, his voluntary exile to Midgard, and the sacred guardian's vow.
- **Powers & Divine Artifacts**: 5 interactive cards (Lightning Command, Superhuman Strength, Storm-Flight, Weather Calming, Regenerative Healing) with stat bars and unique hover micro-animations (sparks flicker, hammer swing, vortex swirl, vital pulse).
- **Mjölnir Showcase**: Star-forged geometric war hammer rendered with glowing runes and celestial specifications.
- **Mission & Character Voice**: Explores both outer physical disasters and inner personal tempests, complete with an interactive Norse quote showcase and Web Audio chime triggers.

### 2. Module B — Conversational Chatbot
- **Conversational State Machine**: Gathers details **one turn at a time** — never a form disguised as chat:
  1. **Name** (captures name and responds warmly)
  2. **Age** (conversational number sanity check between 1–120 with in-character re-prompt)
  3. **Location** (Midgard realm / city / country)
  4. **Email Address** (regex format validation with mythological re-prompt if invalid)
  5. **Urgency Level** (⚡ Low / ⚡⚡ Medium / ⚡⚡⚡ High quick-select chips or free text)
  6. **Grievance / Request**: *"So... tell me. How can I help you?"* (multi-sentence free-text input)
  7. **Confirmation & Dispatch**: In-character confirmation + spark celebration confetti
- **Asgardian Spark Typing Indicator**: Realistic staggered response timing to feel organic and alive.
- **Session Persistence**: Progress survives accidental page refreshes or scrolls via `sessionStorage`.
- **Sound FX**: Web Audio API thunder rumbles, lightning cracks, and message spark chimes with global mute controls.

### 3. Module C — Automated Email Notification Backend
- **Endpoint**: `/api/send-email` (serverless & dev-server compatible).
- **Subject**: `🦸 Someone Needs Your Help!`
- **Rich HTML Template**: Formatted with visitor name, age, location, email, urgency level, timestamp, and grievance text.
- **Delivery Support**: Supports **Resend API**, **Nodemailer SMTP**, and built-in **Verified Raven Simulation**.
- **Raven Dispatch Inspector**: An evaluator inspection modal accessible right from the chat or floating button to view the rendered email payload with 100% visible proof.

---

## 🚀 Quick Start (Run Locally)

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## ⚙️ Environment Variables (Optional for Live Sending)

Create a `.env.local` file in the project root:

```env
# Alter-ego recipient address
CANDIDATE_EMAIL=harikrishnankanjingattu2005@gmail.com
TO_EMAIL=harikrishnankanjingattu2005@gmail.com

# Option A: Resend API (Recommended)
RESEND_API_KEY=re_your_api_key

# Option B: Nodemailer SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-user@gmail.com
SMTP_PASS=your-app-password
```

*(If no keys are provided, the platform seamlessly runs in simulation mode, logging payloads and displaying the email in the live inspector modal).*

---

## 🌐 Public Deployment (Vercel Ready)

This repository includes `api/send-email.ts` pre-configured for Vercel Serverless Functions.

1. Push this repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Set your `CANDIDATE_EMAIL` and `RESEND_API_KEY` (or SMTP credentials) in Vercel Environment Variables.
4. Deploy! Your static frontend and email API will be live instantly on your public URL.

---

## 🛡️ Originality & Public Domain Note

This project is an original creative work inspired by public-domain Norse mythology. It deliberately avoids Marvel/Disney trademarked suits, character designs, or cinematic storylines, making it completely original and suitable for public hosting and assignment evaluation.
