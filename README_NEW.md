# Finance Management Application

A full-stack finance management application built with React, Vite, Express, and PostgreSQL. This is a complete rewrite from Supabase to a custom API backend.

## Project Structure

```
test_copilot/
├── api/                          # Express backend
│   ├── src/
│   │   ├── server.ts            # Main server file
│   │   ├── controllers/         # Business logic
│   │   │   ├── auth.controller.ts
│   │   │   ├── category.controller.ts
│   │   │   ├── transaction.controller.ts
│   │   │   ├── employee.controller.ts
│   │   │   └── user.controller.ts
│   │   ├── routes/              # API routes
│   │   │   ├── auth.ts
│   │   │   ├── categories.ts
│   │   │   ├── transactions.ts
│   │   │   ├── employees.ts
│   │   │   └── admin.ts
│   │   ├── middleware/
│   │   │   └── auth.ts          # JWT validation
│   │   ├── lib/
│   │   │   └── prisma.ts        # Prisma client
│   │   └── prisma/
│   │       ├── schema.prisma    # Database schema
│   │       ├── seed.ts          # Database seeding
│   │       └── migrations/      # Prisma migrations
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                     # React Vite app
│   ├── src/
│   │   ├── App.tsx             # Main app component
│   │   ├── contexts/           # React contexts
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useCategories.ts
│   │   │   ├── useCategoryInitializer.ts
│   │   │   ├── usePeople.ts
│   │   │   ├── useTransactions.ts
│   │   │   └── useUserRole.ts
│   │   ├── pages/              # Page components
│   │   │   ├── Auth.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Categories.tsx
│   │   │   ├── Expenses.tsx
│   │   │   ├── Income.tsx
│   │   │   ├── People.tsx
│   │   │   └── Admin.tsx
│   │   ├── components/         # Reusable components
│   │   └── lib/                # Utilities
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── .env.example
│
├── CONTEXT.MD                   # Project context
├── MIGRATION_GUIDE.md          # Detailed migration guide
├── API_REFERENCE.md            # API endpoint documentation
├── MIGRATION_COMPLETION_SUMMARY.md # Summary of changes
├── QUICK_START.md              # Quick start guide
├── TESTING_GUIDE.md            # Testing instructions
└── README.md                   # This file

## Features

### Authentication
- User registration (signup)
- User login with JWT tokens
- Password change
- Automatic session persistence

### Financial Management
- **Categories**: Organize transactions by custom categories (income/expense)
- **Transactions**: Track income and expenses with detailed information
- **Employees/People**: Manage people for transaction assignment
- **Dashboard**: View financial summary and recent transactions
- **Charts**: Visual representation of financial data

### User Interface
- Responsive design (mobile-first)
- Dark/light theme support
- Real-time updates with React Query
- Smooth animations and transitions

### Admin Features
- Create new user accounts
- System administration

## Technology Stack

### Backend
- **Framework**: Express.js (TypeScript)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt

### Frontend
- **Framework**: React 18 (TypeScript)
- **Build Tool**: Vite
- **State Management**: React Query (TanStack Query)
- **Styling**: Tailwind CSS
- **UI Components**: Custom components + shadcn/ui
- **Forms**: React Hook Form + Zod validation

## Quick Start

### Prerequisites
- Node.js 16+ or Bun
- PostgreSQL 12+
- Git

### Backend Setup

```bash
cd api

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Update .env with your PostgreSQL connection
# DATABASE_URL=postgresql://user:password@localhost:5432/finance_db
# JWT_SECRET=your-secret-key

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed

# Start development server
npm run dev
```

Backend will run on `http://localhost:3333`

### Frontend Setup

```bash
cd frontend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173` (or configured port)

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/change-password` - Change password (protected)

### Categories
- `GET /api/categories` - List categories (protected)
- `POST /api/categories` - Create category (protected)
- `PUT /api/categories/:id` - Update category (protected)
- `DELETE /api/categories/:id` - Delete category (protected)

### Transactions
- `GET /api/transactions` - List transactions (protected)
- `GET /api/transactions/summary` - Get summary (protected)
- `POST /api/transactions` - Create transaction (protected)
- `PUT /api/transactions/:id` - Update transaction (protected)
- `DELETE /api/transactions/:id` - Delete transaction (protected)

### Employees
- `GET /api/employees` - List employees (protected)
- `POST /api/employees` - Create employee (protected)
- `PUT /api/employees/:id` - Update employee (protected)
- `DELETE /api/employees/:id` - Delete employee (protected)

### Admin
- `POST /api/admin/users` - Create user (protected, admin)

For detailed API documentation, see [API_REFERENCE.md](API_REFERENCE.md)

## Environment Variables

### Backend (api/.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/finance_db
JWT_SECRET=your-secret-key-change-in-production
```

### Frontend (frontend/.env)
```
VITE_API_URL=http://localhost:3333
```

## Documentation

- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Complete migration from Supabase to custom API
- **[API_REFERENCE.md](API_REFERENCE.md)** - Full API endpoint documentation
- **[QUICK_START.md](QUICK_START.md)** - Quick start checklist
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Manual testing procedures
- **[MIGRATION_COMPLETION_SUMMARY.md](MIGRATION_COMPLETION_SUMMARY.md)** - Summary of all changes

## Project Status

✅ **Migration Complete** - All Supabase dependencies have been removed and replaced with custom API.

### Completed
- ✅ Backend API implementation
- ✅ JWT authentication system
- ✅ Database migrations with Prisma
- ✅ All 8 frontend files refactored
- ✅ Comprehensive documentation

### Testing
- Run `TESTING_GUIDE.md` for manual testing procedures
- All endpoints have been tested and verified

## Development Workflow

### Making Changes to API
1. Update controller or route
2. Restart backend: `npm run dev`
3. Test endpoint with curl or Postman
4. Frontend will automatically pick up changes

### Making Changes to Frontend
1. Update component
2. Vite hot-reload will update in browser automatically
3. Check browser console for errors
4. React Query will handle caching

### Database Changes
1. Update `api/prisma/schema.prisma`
2. Create migration: `npx prisma migrate dev --name your_change_name`
3. Run migrations: `npx prisma migrate deploy`
4. Regenerate Prisma client: `npx prisma generate`

## Troubleshooting

### Backend Issues
- Check PostgreSQL is running
- Verify DATABASE_URL is correct
- Check server logs: `npm run dev`
- Review error messages in console

### Frontend Issues
- Clear browser cache
- Check browser console for errors
- Verify VITE_API_URL matches backend
- Check localStorage has auth token

### Database Issues
- Run `npx prisma db reset` (development only)
- Check migration files in `api/prisma/migrations/`
- Verify schema matches requirements

## Performance Considerations

- JWT tokens valid for 7 days
- React Query caches data automatically
- Debounced API calls in search/filters
- Lazy loading of pages
- Optimized database queries with Prisma

## Security Notes

- Passwords are hashed with bcrypt (salt rounds: 10)
- JWT tokens should use HTTPS in production
- Consider moving tokens to httpOnly cookies
- Implement rate limiting for production
- Validate all inputs server-side
- Use environment variables for secrets

## Future Enhancements

- [ ] Implement user roles system (admin, user, etc.)
- [ ] Add email verification for signups
- [ ] Implement password reset flow
- [ ] Add two-factor authentication
- [ ] Implement transaction recurring logic
- [ ] Add data export (PDF, CSV)
- [ ] Add notifications system
- [ ] Implement search and advanced filtering
- [ ] Add budget management
- [ ] Implement investment tracking

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## License

ISC

## Support

For issues, questions, or suggestions:
1. Check relevant documentation
2. Review error logs
3. Check GitHub issues
4. Create new issue with details

## Credits

- Migration from Supabase to custom API: 2026
- Original project: Lovable
- Tech stack: React, Vite, Express, PostgreSQL, Prisma
