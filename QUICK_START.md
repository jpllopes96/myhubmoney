# Quick Start Checklist

## Before Running the Application

### Backend Setup (api folder)
- [ ] Copy `.env.example` to `.env`
- [ ] Update `DATABASE_URL` with your PostgreSQL connection string
- [ ] Update `JWT_SECRET` with a secure random string (for production)
- [ ] Install dependencies: `npm install` or `bun install`
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] (Optional) Seed database: `npx prisma db seed`
- [ ] Start backend: `npm run dev`
- [ ] Verify backend running on `http://localhost:3333`

### Frontend Setup (frontend folder)
- [ ] Copy `.env.example` to `.env`
- [ ] Verify `VITE_API_URL=http://localhost:3333` (or update if backend on different URL)
- [ ] Install dependencies: `npm install` or `bun install`
- [ ] Start frontend: `npm run dev`
- [ ] Verify frontend running (typically `http://localhost:5173` or `http://localhost:3000`)

## Testing the Application

### Authentication Flow
- [ ] Navigate to `/auth` page
- [ ] Test signup with new email and password
- [ ] Verify token is created and stored in localStorage
- [ ] Verify redirect to dashboard on successful login
- [ ] Test login with existing credentials
- [ ] Test logout from BottomNav menu

### Categories
- [ ] Verify default categories created on first login
- [ ] Go to `/categories`
- [ ] Create new category
- [ ] Edit category
- [ ] Delete category
- [ ] Verify categories filtered by type (income/expense)

### Transactions
- [ ] Go to `/expenses` or `/income`
- [ ] Create transaction
- [ ] Verify category selection works
- [ ] Verify employee selection works
- [ ] Edit transaction
- [ ] Delete transaction
- [ ] Check dashboard summary updates correctly

### Employees/People
- [ ] Go to `/people`
- [ ] Create employee
- [ ] Edit employee
- [ ] Delete employee

### Admin Features (if applicable)
- [ ] Go to `/admin` (if admin user)
- [ ] Create new user account
- [ ] Verify user can login with new credentials

### Settings
- [ ] Change password from BottomNav menu
- [ ] Verify password change works
- [ ] Test re-login with new password

## Troubleshooting

### Backend Issues
- [ ] Verify PostgreSQL is running
- [ ] Check DATABASE_URL is correct
- [ ] Check no port conflicts (should be 3333)
- [ ] Check JWT_SECRET is set
- [ ] Review server logs for errors

### Frontend Issues
- [ ] Check VITE_API_URL matches backend URL
- [ ] Verify no CORS errors in browser console
- [ ] Check localStorage for auth token
- [ ] Clear browser cache if components not updating

### API Connection Issues
- [ ] Test API with curl: `curl http://localhost:3333/api/auth/me -H "Authorization: Bearer <token>"`
- [ ] Check network tab in browser DevTools
- [ ] Verify Authorization header is being sent
- [ ] Check token hasn't expired (7 days)

## Useful Endpoints for Testing

### Without Authentication
```bash
# Signup
curl -X POST http://localhost:3333/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'

# Login
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### With Authentication
```bash
# Replace TOKEN with actual token from login response

# Get current user
curl http://localhost:3333/api/auth/me \
  -H "Authorization: Bearer TOKEN"

# List categories
curl http://localhost:3333/api/categories \
  -H "Authorization: Bearer TOKEN"

# List transactions
curl http://localhost:3333/api/transactions \
  -H "Authorization: Bearer TOKEN"
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Token expired or missing - re-login |
| CORS error | Check VITE_API_URL and backend CORS settings |
| Cannot connect to API | Verify backend is running on port 3333 |
| Database connection error | Check DATABASE_URL and PostgreSQL running |
| Token not saving | Check browser allows localStorage |
| Default categories not created | Clear localStorage, logout, and re-signup |

## Important Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/db_name
JWT_SECRET=your-secret-key-here
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3333
```

## Production Deployment Checklist

- [ ] Change JWT_SECRET to a secure random value
- [ ] Update DATABASE_URL to production database
- [ ] Set VITE_API_URL to production API URL
- [ ] Enable HTTPS for all API calls
- [ ] Configure CORS for production domain only
- [ ] Move tokens from localStorage to httpOnly cookies
- [ ] Set up proper error logging/monitoring
- [ ] Configure rate limiting
- [ ] Test all endpoints with production credentials
- [ ] Set up automated backups for database
- [ ] Configure SSL certificates
- [ ] Set up CI/CD pipeline

## Documentation Files

- **MIGRATION_GUIDE.md** - Detailed migration documentation
- **API_REFERENCE.md** - Complete API endpoint reference
- **MIGRATION_COMPLETION_SUMMARY.md** - What was changed and why
