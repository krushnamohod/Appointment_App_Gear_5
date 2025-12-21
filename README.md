# 🗓️ Appointment Booking System

A full-stack appointment booking application with an admin dashboard, customer portal, and AI-powered chatbot assistant. Built for hackathon with modern technologies and a beautiful UI.

## 🎬 Demo Video

[![Watch Demo Video](https://img.shields.io/badge/YouTube-Watch%20Demo-red?style=for-the-badge&logo=youtube)](https://youtu.be/L9kw-WZggKA)

![Appointment App](./Appointment%20app%20-The%20perfect%20booking%20system%20-%2024%20hours.png)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
├──────────────────────────┬──────────────────────────────────┤
│     Admin Dashboard      │       Customer Portal            │
│     (React + Vite)       │       (React + Vite)             │
│     Port: 5174           │       Port: 5173                 │
└──────────────────────────┴──────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Express.js)                      │
│                       Port: 3000                            │
├─────────────────────────────────────────────────────────────┤
│  REST API │ Socket.IO │ AI Chatbot (Ollama) │ Email Service │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐    ┌──────────┐
        │PostgreSQL│   │  Redis   │    │  Ollama  │
        │ Database │   │  Cache   │    │    AI    │
        └──────────┘   └──────────┘    └──────────┘
```

## ✨ Features

### Customer Portal
- 📅 Browse and book appointment slots
- 🏢 View available services and resources (venues, courts, equipment)
- 👤 User authentication & profile management
- 💳 Payment integration (PhonePe)
- 🤖 **AI Chatbot** - Get help booking appointments, service recommendations
- 📱 Mobile-responsive design
- 🔔 Real-time updates via Socket.IO

### Admin Dashboard
- 📊 **Dashboard** - Analytics & reporting with charts
- 📋 **Services** - Create/manage services with custom questions, pricing, capacity
- 👨‍⚕️ **Providers** - Manage service providers and their schedules
- 🏟️ **Resources** - Manage venues, courts, equipment with hierarchy support
- 📆 **Appointments** - View, confirm, or cancel bookings
- 🎫 **Discounts** - Create promo codes with percentage-based discounts
- 👥 **Users** - User management with role-based access (Admin, Organiser, Provider)
- ⚙️ **Settings** - Application configuration

### Backend API
- 🔐 JWT Authentication with role-based access control
- 📧 Email notifications (Nodemailer)
- 💰 Payment processing with PhonePe
- 🤖 AI Chatbot integration with Ollama/DeepSeek
- 🔄 Real-time WebSocket events
- 📁 File uploads for images

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, TailwindCSS, Zustand, Recharts |
| **Backend** | Node.js, Express 5, Socket.IO |
| **Database** | PostgreSQL + Prisma ORM |
| **Cache** | Redis |
| **AI** | Ollama (DeepSeek Coder model) |
| **Payments** | PhonePe |
| **Email** | Nodemailer |

## 📦 Project Structure

```
Appointment_App_Gear_5/
├── admin/                 # Admin dashboard (React + Vite)
│   └── src/
│       ├── components/    # UI components
│       ├── views/         # Page views
│       └── store/         # Zustand state management
│
├── customer/              # Customer portal (React + Vite)  
│   └── src/
│       ├── components/    # UI components (auth, booking, chat, home)
│       ├── services/      # API service layer
│       └── context/       # React context
│
├── backend/               # Express.js API server
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── src/
│       ├── controllers/   # Route handlers
│       ├── routes/        # API routes
│       ├── services/      # Business logic
│       ├── middlewares/   # Auth, error handling
│       └── utils/         # Helpers
│
└── README.md
```

## 🗄️ Database Schema

| Model | Description |
|-------|-------------|
| **User** | Customers, admins, organizers, providers |
| **Service** | Bookable services with pricing, questions, capacity |
| **Provider** | Service providers with working hours |
| **Resource** | Venues, courts, equipment (supports hierarchy) |
| **Slot** | Available time slots for booking |
| **Booking** | Customer appointments |
| **Transaction** | Payment records |
| **Discount** | Promotional codes |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis (optional, for caching)
- Ollama (optional, for AI chatbot)

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install admin dependencies
cd ../admin
npm install

# Install customer dependencies
cd ../customer
npm install
```

### 2. Environment Setup

Create `.env` file in `backend/`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/appointment_db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3000

# Email (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# PhonePe Payment (optional)
PHONEPE_MERCHANT_ID="your-merchant-id"
PHONEPE_SALT_KEY="your-salt-key"
PHONEPE_SALT_INDEX=1

# Ollama AI (optional)
OLLAMA_HOST="http://localhost:11434"
OLLAMA_MODEL="deepseek-coder-v2:16b-lite-instruct-q4_K_M"
```

Create `.env` file in `admin/` and `customer/`:

```env
VITE_API_URL="http://localhost:3000/api"
```

### 3. Database Setup

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed sample data (optional)
node prisma/seed.js
```

### 4. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev          # Runs on http://localhost:3000

# Terminal 2 - Admin
cd admin
npm run dev          # Runs on http://localhost:5174

# Terminal 3 - Customer
cd customer
npm run dev          # Runs on http://localhost:5173
```

## 📡 API Endpoints

| Route | Description |
|-------|-------------|
| `POST /api/auth/register` | User registration |
| `POST /api/auth/login` | User login |
| `GET /api/services` | List all services |
| `GET /api/resources` | List all resources |
| `GET /api/providers` | List all providers |
| `GET /api/slots` | Get available slots |
| `POST /api/bookings` | Create a booking |
| `GET /api/bookings` | List user bookings |
| `POST /api/payments/initiate` | Start payment |
| `GET /api/discounts` | List discounts |
| `POST /api/chatbot/message` | AI chatbot |
| `GET /api/reports` | Admin analytics |
| `GET /api/users` | User management |

## 🔐 User Roles

| Role | Permissions |
|------|-------------|
| **CUSTOMER** | Book appointments, view own bookings |
| **PROVIDER** | View assigned appointments |
| **ORGANISER** | Manage services, providers, resources |
| **ADMIN** | Full system access |

## 🤖 AI Chatbot

The integrated chatbot uses Ollama with DeepSeek model to:
- Answer questions about services
- Recommend services based on symptoms/needs
- Guide users through the booking process
- Provide general appointment assistance

**Setup Ollama:**
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull the model
ollama pull deepseek-coder-v2:16b-lite-instruct-q4_K_M
```

## 📜 Scripts

### Backend
```bash
npm run dev      # Development with nodemon
npm start        # Production
```

### Admin / Customer
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm test         # Run tests (admin only)
```

## 🎨 Design System

The app uses a warm, professional design with:
- **Primary Color**: Terracotta (#C4653C)
- **Background**: Paper cream (#FAF6F0)
- **Font**: Inter / system fonts
- **Icons**: Lucide React

## 📄 License

MIT License - Built for hackathon purposes.

---

**Built with ❤️ by Team Gear 5**
