# Setup Instructions

## Database Setup

Before running the application, you need to:

1. **Create the MySQL database:**
   ```sql
   CREATE DATABASE incident_tracker;
   ```

2. **Run migrations to create tables:**
   ```bash
   cd backend
   npm run migrate
   ```

3. **Seed the database with sample data (optional):**
   ```bash
   npm run seed
   ```

## Common Issues

### Error: "Table 'incident_tracker.incidents' doesn't exist"

**Solution:** Run the database migrations:
```bash
cd backend
npm run migrate
```

### Error: "SQL syntax error near '10'"

**Solution:** This has been fixed. Make sure you're using the latest code. The issue was query parameters being passed as strings instead of numbers.

### Error: "Cannot connect to database"

**Solution:** 
1. Check your `.env` file has correct database credentials
2. Ensure MySQL is running
3. Verify database exists: `SHOW DATABASES;`
4. Check connection: `mysql -u root -p incident_tracker`

## Quick Start

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Create .env file (copy from .env.example and update values)
cp .env.example .env

# 3. Create database
mysql -u root -p
CREATE DATABASE incident_tracker;
exit

# 4. Run migrations
npm run migrate

# 5. Seed database (optional)
npm run seed

# 6. Start server
npm start
```
