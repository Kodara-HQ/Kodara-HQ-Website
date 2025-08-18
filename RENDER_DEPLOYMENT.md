# Deploying Kodara-HQ to Render with PostgreSQL

This guide will walk you through deploying your Kodara-HQ application to Render with a PostgreSQL database.

## Prerequisites

1. A Render account (free tier available)
2. Your project code pushed to a Git repository (GitHub, GitLab, etc.)

## Step 1: Create a PostgreSQL Database on Render

1. **Log into Render Dashboard**
   - Go to [render.com](https://render.com) and sign in

2. **Create New Database**
   - Click "New +" button
   - Select "PostgreSQL"
   - Choose "Free" plan
   - Set database name: `kodara_hq`
   - Set user: `kodara_hq_user`
   - Choose a region close to your users
   - Click "Create Database"

3. **Note Database Credentials**
   - Save the connection details (host, database name, user, password, port)
   - These will be automatically configured in your web service

## Step 2: Deploy Your Web Service

1. **Connect Your Repository**
   - Click "New +" button
   - Select "Web Service"
   - Connect your Git repository
   - Choose the repository containing your Kodara-HQ code

2. **Configure the Service**
   - **Name**: `kodara-hq-web`
   - **Environment**: `Node`
   - **Region**: Same as your database
   - **Branch**: `main` (or your default branch)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Environment Variables**
   - The database connection variables will be automatically set
   - You'll need to manually set these:
     - `JWT_SECRET`: Generate a secure random string
     - `STRIPE_SECRET_KEY`: Your Stripe secret key
     - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
     - `EMAIL_HOST`: Your SMTP server
     - `EMAIL_PORT`: SMTP port (usually 587)
     - `EMAIL_USER`: Your email address
     - `EMAIL_PASS`: Your email app password

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

## Step 3: Initialize Your Database

After your web service is deployed:

1. **Access Your Service**
   - Go to your web service dashboard
   - Note the URL (e.g., `https://kodara-hq-web.onrender.com`)

2. **Run Database Initialization**
   - Your service will automatically create tables on first run
   - Or you can manually trigger by visiting: `https://your-service-url/api/health`

## Step 4: Test Your Deployment

1. **Check Health Endpoint**
   - Visit: `https://your-service-url/api/health`
   - Should return database connection status

2. **Test Admin Login**
   - Default admin credentials:
     - Email: `admin@kodara-hq.local`
     - Password: `ChangeMe123!`
   - **Important**: Change these credentials after first login!

## Environment Variables Reference

### Automatic (from database)
- `POSTGRES_HOST`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_PORT`

### Manual (you must set)
- `JWT_SECRET`: Secure random string for JWT tokens
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
- `EMAIL_HOST`: SMTP server (e.g., smtp.gmail.com)
- `EMAIL_PORT`: SMTP port (usually 587)
- `EMAIL_USER`: Your email address
- `EMAIL_PASS`: Your email app password

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Ensure Node.js version compatibility

2. **Database Connection Errors**
   - Verify database is running
   - Check environment variables are set correctly
   - Ensure database is in the same region as web service

3. **Service Won't Start**
   - Check logs in Render dashboard
   - Verify start command is correct
   - Ensure port configuration is correct

### Logs and Debugging

- View logs in your Render service dashboard
- Check "Events" tab for deployment issues
- Use "Shell" access for debugging if needed

## Updating Your Application

1. **Push Changes to Git**
   - Make your code changes
   - Commit and push to your repository

2. **Automatic Deployment**
   - Render will automatically detect changes
   - New deployment will start automatically
   - Zero-downtime deployments

## Cost Considerations

- **Free Tier**: 
  - Database: 1GB storage, 90 days retention
  - Web Service: 750 hours/month
  - Perfect for development and small projects

- **Paid Plans**: 
  - Start at $7/month for database
  - Start at $7/month for web service
  - Better performance and reliability

## Security Notes

1. **Change Default Passwords**
   - Update admin credentials immediately
   - Use strong, unique passwords

2. **Environment Variables**
   - Never commit sensitive data to Git
   - Use Render's environment variable system

3. **Database Access**
   - Database is only accessible from your web service
   - No external connections allowed on free tier

## Support

- **Render Documentation**: [docs.render.com](https://docs.render.com)
- **Render Community**: [community.render.com](https://community.render.com)
- **PostgreSQL Documentation**: [postgresql.org/docs](https://www.postgresql.org/docs/)

---

Your Kodara-HQ application is now ready for production deployment on Render with a robust PostgreSQL database!
