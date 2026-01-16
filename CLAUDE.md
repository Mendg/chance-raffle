# Chance Raffle - Friendship Circle

A nonprofit raffle application where participants authorize a payment and get randomly charged anywhere from $1 to $360. Each dollar amount corresponds to a raffle entry number (1-360), and each number can only be assigned once.

## Project Overview

This is a Next.js 15 application with:
- **Frontend**: React with Tailwind CSS, Friendship Circle branding (navy #1b365d, teal #36bbae)
- **Backend**: Next.js API routes with Prisma ORM
- **Database**: SQLite (development) - can be switched to PostgreSQL for production
- **Payments**: Stripe with manual capture (authorize $360, capture random amount)

## Build & Development Commands

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Seed the database with default settings and admin user
npm run db:seed

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Open Prisma Studio (database GUI)
npm run db:studio

# Run linter
npm run lint
```

## Environment Variables

Copy `.env` and configure:

```env
# Database
DATABASE_URL="file:./dev.db"

# Stripe (required for payments)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Admin Authentication
JWT_SECRET="your-secure-secret"

# Email (optional)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your-email@example.com"
SMTP_PASSWORD="your-password"
EMAIL_FROM="noreply@friendshipcircle.org"
```

## Project Structure

```
/
├── prisma/              # Database schema and migrations
│   ├── schema.prisma    # Prisma schema
│   ├── seed.ts          # Database seeder
│   └── migrations/      # Migration files
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── api/         # API routes
│   │   │   ├── payment/ # Payment intent creation
│   │   │   ├── entries/ # Entry management
│   │   │   ├── stats/   # Raffle statistics
│   │   │   └── admin/   # Admin operations
│   │   ├── admin/       # Admin dashboard
│   │   └── confirmation/# Payment confirmation page
│   ├── components/      # React components
│   ├── lib/             # Utility functions
│   │   ├── prisma.ts    # Database client
│   │   ├── stripe.ts    # Stripe integration
│   │   ├── raffle.ts    # Raffle logic
│   │   ├── email.ts     # Email sending
│   │   └── auth.ts      # Authentication
│   ├── types/           # TypeScript types
│   └── generated/       # Prisma generated client
└── public/              # Static assets
```

## Key Features

1. **Random Entry Assignment**: Numbers 1-360 randomly assigned, each unique
2. **Stripe Manual Capture**: Authorize $360, capture only the assigned amount
3. **Overflow Period**: 3-hour window after sellout for additional entries (halacha compliance)
4. **Admin Dashboard**: View entries, add manual entries, draw winner, export CSV
5. **Email Confirmations**: Entry confirmation and winner notification

## Default Admin Credentials

After running `npm run db:seed`:
- Email: `admin@friendshipcircle.org`
- Password: `admin123`

**Change these in production!**

## API Endpoints

- `POST /api/payment` - Create payment intent
- `POST /api/entries` - Create new entry
- `GET /api/entries` - List public entries
- `GET /api/stats` - Get raffle statistics
- `POST /api/admin/login` - Admin login
- `GET /api/admin/entries` - Get all entries (admin)
- `POST /api/admin/entries` - Create manual entry (admin)
- `POST /api/admin/draw` - Draw winner (admin)
- `GET/PATCH /api/admin/settings` - Manage settings (admin)

## Code Style Guidelines

- TypeScript strict mode
- Functional React components with hooks
- Tailwind CSS for styling with custom CSS variables
- Zod for API validation
- Prisma transactions for race condition prevention
