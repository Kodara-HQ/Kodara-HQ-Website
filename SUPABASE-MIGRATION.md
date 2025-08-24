# 🚀 Migration from MSSQL to Supabase

This guide will help you migrate your Kodara-HQ website from MSSQL (Azure) to Supabase for public access.

## 🎯 Why Migrate to Supabase?

- **Public Access**: No more private connection restrictions
- **Real-time Features**: Built-in real-time subscriptions
- **Authentication**: Built-in user management and auth
- **API**: RESTful and GraphQL APIs out of the box
- **Database**: PostgreSQL with automatic backups
- **Hosting**: Managed hosting with global CDN

## 📋 Prerequisites

- Supabase project created at: `https://yrfywmdaraafqzcw.tvqj.supabase.co`
- API Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyZnl3bWRhcmFhZnF6Y3d0dnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMzIwNjcsImV4cCI6MjA3MTYwODA2N30.NQcfmgeJJPXYTzd9i2nj9_l_pQLmEO4vtMYTjtzZ_1c`

## 🔧 Installation & Setup

### 1. Install Dependencies
```bash
npm install @supabase/supabase-js
```

### 2. Environment Configuration
Copy the Supabase environment file:
```bash
# Windows PowerShell
Copy-Item server/config.supabase.env.example .env

# Or manually create .env with:
SUPABASE_URL=https://yrfywmdaraafqzcw.tvqj.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyZnl3bWRhcmFhZnF6Y3d0dnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMzIwNjcsImV4cCI6MjA3MTYwODA2N30.NQcfmgeJJPXYTzd9i2nj9_l_pQLmEO4vtMYTjtzZ_1c
```

### 3. Test Connection
```bash
npm run test:supabase
```

## 🗄️ Database Setup

### 1. Create Tables in Supabase
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `server/src/db/supabase-schema.sql`
4. Execute the SQL

### 2. Initialize Database
```bash
npm run db:init:supabase
```

## 🔄 Code Changes Required

### 1. Update Database Imports
Replace MSSQL imports with Supabase:
```javascript
// OLD (MSSQL)
const { getPool, sql } = require('./db/pool');

// NEW (Supabase)
const { getPool } = require('./db/supabase-pool');
```

### 2. Update Database Queries
Convert MSSQL queries to Supabase:

```javascript
// OLD (MSSQL)
const pool = await getPool();
const result = await pool.request()
  .input('email', sql.VarChar, email)
  .query('SELECT * FROM Users WHERE email = @email');

// NEW (Supabase)
const supabase = getPool();
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('email', email);
```

### 3. Update Controllers
You'll need to update these files:
- `server/src/controllers/contactController.js`
- `server/src/controllers/projectController.js`
- `server/src/controllers/testimonialController.js`
- `server/src/controllers/subscriptionController.js`

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## 📊 Database Schema Comparison

| MSSQL Table | Supabase Table | Changes |
|-------------|----------------|---------|
| `Users` | `users` | ID changed to UUID, added timestamps |
| `Projects` | `projects` | ID changed to UUID, added timestamps |
| `Testimonials` | `testimonials` | ID changed to UUID, added timestamps |
| `ContactMessages` | `contact_messages` | ID changed to UUID, snake_case naming |
| `Subscriptions` | `subscriptions` | ID changed to UUID, added timestamps |
| `Payments` | `payments` | ID changed to UUID, snake_case naming |
| `PasswordResets` | `password_resets` | ID changed to UUID, snake_case naming |

## 🔒 Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Public read access** to projects and testimonials
- **Authenticated user access** to personal data
- **Open submission** for contact forms and subscriptions

## 🧪 Testing

### Test Database Connection
```bash
npm run test:supabase
```

### Test API Endpoints
```bash
# Test contact form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"Hello"}'

# Test projects endpoint
curl http://localhost:3000/api/projects

# Test testimonials endpoint
curl http://localhost:3000/api/testimonials
```

## 🚨 Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check your Supabase URL and API key
   - Ensure your Supabase project is active
   - Verify network connectivity

2. **Table Not Found**
   - Run the schema creation script
   - Check table names (they're now snake_case)
   - Verify RLS policies are set correctly

3. **Authentication Errors**
   - Check API key permissions
   - Ensure RLS policies allow the operations you need

### Getting Help

- Check [Supabase Documentation](https://supabase.com/docs)
- Review the [Supabase Discord](https://discord.supabase.com)
- Check your Supabase dashboard logs

## 🎉 Migration Complete!

Once you've completed these steps, your application will be running on Supabase with:
- ✅ Public database access
- ✅ Real-time capabilities
- ✅ Built-in authentication
- ✅ Automatic backups
- ✅ Global CDN
- ✅ RESTful API

Your website will now be accessible from anywhere without private connection restrictions!
