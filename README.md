# Kodara-HQ Website

Express.js + PostgreSQL + Nodemailer with a responsive static frontend (HTML/CSS/JS).

## Quick start

1. Copy env file
   - Windows PowerShell:
     - `Copy-Item env.example .env`
2. Edit `.env` with your database and SMTP credentials
3. Install deps
   - `npm install`
4. Initialize database (creates tables if missing)
   - `npm run db:init`
5. Start dev server
   - `npm run dev`

App runs at `http://localhost:3000`.

## Database Setup

### Local Development
- Install PostgreSQL locally
- Create database: `kodara_hq`
- Update `.env` with your local PostgreSQL credentials

### Render Deployment
- See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for complete deployment guide
- Free PostgreSQL database available on Render
- Automatic environment variable configuration

## API Endpoints

- POST `/api/contact`
- GET `/api/projects`
- GET `/api/testimonials`
- POST `/api/subscribe`

## Tech Notes

- **Database**: PostgreSQL with `pg` driver
- **Email**: `nodemailer`
- **Password hashing**: `bcrypt` (ready for authentication)
- **Deployment**: Render-ready with `render.yaml` configuration

## Database Commands

```bash
# Initialize database schema
npm run db:init

# Seed with sample data
npm run db:seed

# Reset data (clears Projects and Testimonials)
npm run db:reset
```

## Environment Variables

Copy `env.example` to `.env` and configure:

- `POSTGRES_*`: Database connection details
- `JWT_SECRET`: Secret for JWT tokens
- `STRIPE_*`: Stripe payment configuration
- `EMAIL_*`: SMTP email configuration

## Deployment

### Render (Recommended)
- Free tier available
- Automatic PostgreSQL database
- Zero-downtime deployments
- See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)

### Other Platforms
- Update database connection in `server/src/db/pool.js`
- Set environment variables
- Ensure PostgreSQL is available


