# Nataly's Home Bakery Website

A modern, minimalist e-commerce website for Nataly's Home Bakery built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Product Catalog** - Browse delicious bakery items (Flan, Choco-flan, Chocolate Cake, Cinnamon Rolls)
- **Shopping Cart** - Add items to cart and manage quantities
- **Checkout System** - Secure 50% deposit payment via Stripe
- **Email Notifications** - Automated order confirmations and vendor notifications
- **Contact Form** - Easy customer communication
- **Responsive Design** - Mobile-first, works on all devices

## 🛠️ Tech Stack

- **Framework:** Next.js 16+ (React 18+)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL with Prisma ORM
- **Payment:** Stripe
- **Email:** Resend
- **Forms:** React Hook Form + Zod validation

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)
- Stripe account
- Resend account (for emails)

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

Required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `STRIPE_SECRET_KEY` - Stripe secret key (from Stripe Dashboard)
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret (for payment confirmations)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (for client-side)
- `RESEND_API_KEY` - Resend API key (for email sending)
- `EMAIL_FROM` - Email address to send from
- `EMAIL_TO` - Email address to receive orders
- `NEXT_PUBLIC_APP_URL` - Your application URL

### 3. Database Setup

Generate Prisma client and push schema to database:

```bash
npm run db:generate
npm run db:push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run db:push` - Push Prisma schema to database
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio (database GUI)

## 🔐 Stripe Webhook Setup

For local development, use Stripe CLI to forward webhooks:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This will give you a webhook secret to add to your `.env.local` file.

## 📁 Project Structure

```
├── src/
│   ├── app/              # Next.js app router pages and API routes
│   ├── components/       # React components
│   ├── lib/              # Utilities and helpers
│   └── types/            # TypeScript type definitions
├── prisma/               # Prisma schema and migrations
├── public/               # Static assets
└── Images/               # Design reference images
```

## 🎨 Design

The website follows a modern minimalist aesthetic with:
- Clean, readable typography
- Warm, earthy color palette
- Generous whitespace
- Subtle animations
- Mobile-first responsive design

## 📄 License

Private project for Nataly's Home Bakery
