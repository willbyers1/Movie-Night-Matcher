<div align="center">

# 🎬 Movie Night Matcher

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=for-the-badge)](CONTRIBUTING.md)

</div>

> Tinder-style movie swiping for groups. Eliminate decision paralysis and agree on what to watch in under two minutes.

---

## ⚡ Features

- **🍿 Shared Real-Time Rooms:** Create custom room codes or shareable links for instant lobby pairing with real-time participant tracking.
- **🃏 Fluid Drag-and-Swipe UX:** Mobile-first swipeable movie card stack built with Framer Motion, featuring fallback touch and keyboard controls.
- **⚡ Synchronized Match Engine:** Powered by Firebase Firestore listeners—fires a full-screen celebratory alert to all users the instant a consensus is reached.
- **📺 Streaming Platform Intelligence:** Displays region-accurate watch availability (Stream, Rent, Buy) via TMDB Watch Providers integration.
- **⚙️ Deep Room Customization:** Host-level session filters for genres, release years, minimum ratings, streaming providers, and voting thresholds.
- **📜 Persistent Match History:** Log and inspect all past room matches anytime without refetching heavy metadata.

---

## 🛠️ Tech Stack

- [React 18](https://react.dev/) — UI Library
- [TypeScript](https://www.typescriptlang.org/) — Type Safety
- [Vite](https://vitejs.dev/) — Next-Generation Frontend Tooling
- [Tailwind CSS](https://tailwindcss.com/) — Utility-First CSS Framework
- [Framer Motion](https://www.framer.com/motion/) — Drag Gesture & Card Stack Animations
- [Firebase Firestore & Auth](https://firebase.google.com/) — Real-Time Database & Anonymous User Sessions
- [TMDB API](https://www.themoviedb.org/documentation/api) — Movie Catalog & Watch Provider Data

---

## 🚀 Quick Start & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A Firebase project and a TMDB API account

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mertbatubulbul/movie-night-matcher.git
   cd movie-night-matcher
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory (refer to [Configuration](#-configuration) below).

4. **Start the development server:**
   ```bash
   npm run dev
   ```

---

## 🔑 Configuration

Create a `.env.local` file in the project root and populate it with your Firebase and TMDB credentials:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_TMDB_API_KEY=your_tmdb_api_key
```

> **Security Note:** Never commit your actual API keys or `.env.local` file to version control. Ensure `.env.local` is listed inside your `.gitignore`.

---

## 🔄 How It Works

1. **Host Creates a Room:** Host configures session filters (genres, min rating, streaming providers) and receives a shareable 6-character room code.
2. **Friends Join:** Participants join via code or link, enter a display name, and are assigned anonymous Firebase auth tokens.
3. **Swipe Away:** Members swipe right (like) or left (pass) on curated TMDB movie stacks synchronized in real time.
4. **Instant Match Alert:** When all or threshold members like the same movie, a real-time Firestore listener triggers a synchronized match overlay for everyone.
5. **Start Watching:** Tap the matched movie to see streaming links for your selected region, or keep swiping for more choices!

---

## 📦 Building for Production

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

**Created By Mert Batu BULBUL**
* 🎓 AI Engineering & Full Stack Developer * 💻 React *

**Don't forget to star ⭐ this repo if you found it useful!**

</div>

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page or submit a pull request.
