# FeedLoop

> Capture Feedback. Without the Noise.

FeedLoop is a B2B SaaS platform providing a lightweight, privacy-focused feedback widget for web developers. It allows you to effortlessly gather, categorize, and analyze user sentiments—combining rich visual context with deep emotional insights—without compromising end-user privacy.

---

## 📖 Overview

At its core, FeedLoop solves the problem of disconnected user feedback. Instead of receiving vague bug reports via email, FeedLoop provides a seamless widget that sits quietly on your application. When a user interacts with it, it captures their exact emotional state, the visual state of the DOM, and their browser metadata, funnelling it all into an elegant, real-time dashboard.

The system is divided into two main components:
1. **The Vanilla JS Client Widget**: A high-performance, single-bundle script utilizing a Web Component (Shadow DOM) to avoid styling conflicts with your host website.
2. **The Next.js SaaS Dashboard**: A centralized control panel for B2B users to register projects, view real-time feedback streams, and triage issues.

## ✨ Core Features

### 01 // Visual Context & DOM Capture
Our widget automatically generates pixel-perfect screenshots of the user's viewport utilizing `html2canvas`. 
**Privacy First**: Sensitive fields (passwords, emails, credit cards, or any element marked with `.feedloop-mask`) are aggressively masked client-side (e.g., replaced with `••••••••` or `████████`) *before* any pixels are captured or transmitted. Your users' personal data never leaves their browser.

### 02 // Emotional Sentiment Tracking
Go beyond raw text. Users categorize their feedback with distinct emotional tags (😍 Delight, 🤔 Thinking/Feature Request, 🐛 Bug). Instantly filter your triage lists based on user frustration or appreciation to prioritize effectively.

### 03 // Browser Metadata Harvesting
Stop asking users for their environment details. FeedLoop silently and automatically harvests viewport dimensions, user-agent strings, OS details, and device capabilities, attaching them to every submission payload.

### 04 // AI Auto-Categorization
Incoming feedback text is instantly processed via secure Supabase Database Webhooks connecting to an AI model. Submissions are auto-labeled (e.g., `"Bug"`, `"UI/UX"`, `"Performance"`) in real-time, streamlining your triage pipeline.

---

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router, Server Actions, Server Components)
- **Database & Auth**: Supabase PostgreSQL (with strict Row Level Security), Auth (Magic Links/OTP), and Realtime Subscriptions.
- **Styling**: Tailwind CSS (Strictly typed to our internal design system).
- **Client Widget**: Vanilla JavaScript bundled as a lightweight Web Component.
- **Storage**: Supabase Storage for secure, pre-signed screenshot uploads.

---

## 🎨 Design System & Aesthetic

FeedLoop strictly adheres to an internal **Mastercard-Inspired / Japandi Minimalist Aesthetic**. We believe enterprise tools should feel premium, editorial, and highly focused.

- **Canvas**: Putty Cream (`#F3F0EE`) and Lifted Cream (`#FCFBFA`).
- **Contrast**: Ink Black (`#141413`) for text, 1.5px brutalist borders, and pill buttons.
- **Accent**: Signal Orange (`#CF4500`) utilized sparingly for eyebrow indicators and micro-interactions.
- **Typography**: Large, tracking-tightened (`-0.02em`) sans-serif headings with high-contrast layouts.
- **Radii**: 40px stadium cards and 20px pill buttons for a soft yet precise geometry.

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- Supabase CLI & Account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/feedloop.git
   cd feedloop
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file and add your Supabase credentials:
   ```bash
   cp .env.example .env.local
   # Populate NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Access the Application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser. Authentication is handled seamlessly via Supabase Magic Links.

---
*Let's Connect - payasaniruddha@xthcgmail.com*
*Developed By Aniruddha Payas*
*FeedLoop — Closing the gap between developers and users.*
