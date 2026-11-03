# StudioSpace

A peer-to-peer marketplace where creators book photo studios, sound stages, podcast lounges, music suites and art workshops by the hour, and hosts list their own spaces.

**Live Site:** https://YOUR-LIVE-SITE.vercel.app
**Server Repo:** https://github.com/kazolroy/studiospace-server

## Features

- Search, filter by category and price, and sort studios on the Explore page
- Live availability: already-booked hours are disabled, so double booking is blocked
- Add, update and delete your own studio listings (private routes)
- Booking system with Pending, Confirmed, Completed and Cancelled status
- Email/password and Google login with password validation
- Reviews and ratings on each studio
- Toast notifications, custom modals, loading skeletons and a custom 404 page
- Fully responsive design

## Tech Stack

React, Vite, React Router, Tailwind CSS, Swiper, Firebase Authentication, react-hot-toast, Node.js, Express, MongoDB

## Local Setup

1. Clone the repo and install packages
   ```bash
   git clone https://github.com/kazolroy/studiospace-client.git
   cd studiospace-client
   npm install
   ```
2. Copy `.env.example` to `.env` and add your Firebase config and API URL
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
   ```
3. Start the server from the [server repo](https://github.com/kazolroy/studiospace-server), then run
   ```bash
   npm run dev
   ```
4. Open http://localhost:5173

## Examiner Test Credentials

- **Email:** YOUR-TEST-EMAIL@gmail.com
- **Password:** YOUR-TEST-PASSWORD
