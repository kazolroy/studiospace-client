# 🎬 StudioSpace — Peer-to-Peer Creative Workspace Marketplace

**Live site:** https://your-studiospace.vercel.app  <!-- replace after deploying -->
**API:** https://your-studiospace-api.vercel.app  ·  **Server repo:** https://github.com/<you>/studiospace-server

StudioSpace lets creators discover, compare and reserve photo studios, sound stages, podcast lounges, music suites and art workshops by the hour, while hosts list and manage their own spaces.

## ✨ Key Features

- **Smart discovery** – debounced search, category chips, price cap and sorting (newest, top rated, price) on `/studios`, with friendly empty states.
- **Live availability booking** – pick a date and see already-reserved hours struck out; the server rejects overlapping slots, so double bookings can't happen. Totals include the refundable deposit.
- **Full CRUD for hosts** – add, update and delete listings (private routes) with amenity tags, gallery images and optional imgbb image upload; deletes use a custom confirmation modal.
- **Booking lifecycle** – bookings start as *Pending*; guests can cancel, hosts can Confirm / Decline / Complete from the Dashboard; status badges on **My Bookings**.
- **Reviews & ratings** – one review per user, ratings recalculated on the server.
- **Secure auth** – email/password + Google sign-in (Firebase), password rules (upper, lower, 6+), JWT-verified API, and sessions that survive reloads on private routes.
- **Polished UX** – Swiper hero slider, skeleton loaders & branded spinner, custom 404, react-hot-toast notifications (no `alert()`), fully responsive dark UI.

## 🧰 Tech Stack

React 18 · Vite · React Router 6 · Tailwind CSS · Swiper · Firebase Auth · react-hot-toast · react-icons — **Server:** Node.js, Express, MongoDB, jose.

## 🚀 Local Setup

```bash
git clone <this-repo> && cd studiospace-client
npm install
cp .env.example .env      # add Firebase keys, API url and (optional) imgbb key
npm run dev               # http://localhost:5173
```

Run the API from the server repo (`npm install && npm run seed && npm run dev`). In Firebase, enable **Email/Password** and **Google** providers and add your deployed domain to *Authorized domains*.

## 🔑 Examiner Test Credentials

| Role | Email | Password |
| --- | --- | --- |
| Guest / Host | `examiner@studiospace.com` | `Examiner123` |

> Create this account once via **Register** (or Firebase console) before submission. Google login also works.

## 🌐 Deployment notes

`vercel.json` rewrites every route to `index.html`, so reloading `/studios/:id` or any private route never 404s. Auth state is restored (`loading` flag) before private routes decide to redirect, so logged-in users stay on the page after reload.
