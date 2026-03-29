# EpicRides — Demo Site Replica

## Overview
Full-stack replica of epicrides.ca (Vancouver-to-Whistler bus service). Express + EJS + SQLite demo with booking system and admin CMS.

## Tech Stack
- Node.js + Express (server)
- EJS (templates)
- better-sqlite3 (database)
- express-session + bcryptjs (auth)
- Vanilla CSS/JS (frontend)

## Commands
- `npm run dev` — Start dev server with nodemon (port 3000)
- `npm start` — Production start

## Project Structure
- `server.js` — Express app entry
- `database.js` — SQLite schema, seed data, helper functions
- `routes/` — Express route modules (pages, booking, admin)
- `views/` — EJS templates (layout.ejs is the shared wrapper)
- `public/` — Static assets (css, js, images)
- `middleware/` — Auth middleware

## Database
- File: `epicrides.db` (auto-created on first run)
- Admin login: `admin` / `epicrides2026`

## Conventions
- Use semicolons in JS
- Use 2-space indentation
- RESTful route naming
- All DB access through helper functions in database.js
- EJS templates extend layout.ejs via `<%- include %>` pattern
