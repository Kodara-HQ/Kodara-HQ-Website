# Kodara-HQ Website

Express.js + MSSQL + Nodemailer with a responsive static frontend (HTML/CSS/JS).

## Quick start

1. Copy env file
   - Windows PowerShell:
     - `Copy-Item .env.example .env`
2. Edit `.env` with your database and SMTP credentials
3. Install deps
   - `npm install`
4. Initialize database (creates tables if missing)
   - `npm run db:init`
5. Start dev server
   - `npm run dev`

App runs at `http://localhost:3000`.

## API Endpoints

- POST `/api/contact`
- GET `/api/projects`
- GET `/api/testimonials`
- POST `/api/subscribe`

## Tech Notes

- DB driver: `mssql`
- Email: `nodemailer`
- Password hashing ready: `bcrypt` (not used yet)


