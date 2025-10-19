# La Kbira - Luxury Moroccan Fashion E-Commerce Platform

<div align="center">

![La Kbira](https://img.shields.io/badge/La%20Kbira-Luxury%20Fashion-D4AF37?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)

**A cinematic, bilingual e-commerce platform for luxury Moroccan fashion**

[Live Demo](#) • [Features](#features) • [Tech Stack](#tech-stack) • [Setup](#setup)

</div>

---

## 🌟 Overview

**La Kbira** (لا كبيرة) is a state-of-the-art luxury fashion e-commerce platform that blends Moroccan heritage with contemporary elegance. Built with cutting-edge web technologies, it offers an immersive shopping experience with intelligent order management.

### ✨ Key Highlights

- 🎬 **Cinematic Design**: Animated background slideshow with Moroccan patterns
- 🎨 **Live Color Preview**: Real-time product visualization with color overlays
- 🌍 **Bilingual Support**: Seamless Arabic/English interface
- 📝 **Waiting List System**: Registry-based order management
- 🎛️ **Smart Dashboard**: Intelligent admin panel for order approval/rejection
- 📱 **Fully Responsive**: Optimized for all devices

---

## 🚀 Features

### Customer-Facing Features

#### 1. **Cinematic Homepage**
- Full-screen animated background with product imagery
- Auto-rotating slideshow (4-second intervals)
- Moroccan geometric patterns overlay
- Elegant typography with Arabic calligraphy
- Trust indicators and value propositions

#### 2. **Interactive Product Catalog**
- Grid layout with product cards
- Multiple product images per item
- Color and size availability indicators
- Price display in AED
- Bilingual product names and descriptions

#### 3. **Advanced Product Detail Pages**
- **Live Color Preview**: Dynamic color overlay on product images
- Image gallery with thumbnail navigation
- Color selection with visual swatches
- Size selection (S, M, L, XL, Custom)
- Fabric and craftsmanship details
- Limited edition badges

#### 4. **Comprehensive Order Form**
- **Personal Information**: Name, email, phone, WhatsApp
- **Shipping Details**: City, country, full address
- **Product Customization**: Color and size selection
- **Custom Measurements**: Optional detailed measurements (height, bust, waist, hips, shoulders, arm length)
- **Special Requests**: Customer notes field
- **Dynamic Pricing**: Base price + customization fee
- Real-time total calculation

### Admin Features

#### 5. **Intelligent Dashboard**
- **Statistics Overview**:
  - Total orders
  - Pending orders
  - Approved orders
  - Rejected orders
- **Order Management**:
  - View all orders with detailed information
  - Approve/Reject orders with one click
  - Add admin notes to orders
  - Provide rejection reasons
  - Color-coded order status
- **Order Details Display**:
  - Customer contact information
  - Shipping location
  - Product specifications
  - Custom measurements (if applicable)
  - Customer notes
  - Order timeline

---

## 🛠️ Tech Stack

### Frontend
- **React 19**: Latest React with modern hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first styling
- **Wouter**: Lightweight routing
- **shadcn/ui**: Beautiful, accessible components
- **Lucide Icons**: Modern icon library
- **Sonner**: Toast notifications

### Backend
- **Express 4**: Fast, minimalist web framework
- **tRPC 11**: End-to-end typesafe APIs
- **Drizzle ORM**: Type-safe database toolkit
- **MySQL/TiDB**: Relational database
- **Superjson**: Automatic serialization

### Authentication & Security
- **Manus OAuth**: Secure authentication
- **JWT**: Session management
- **Role-based Access Control**: Admin/user roles

### Development Tools
- **Vite**: Lightning-fast build tool
- **ESLint**: Code linting
- **TypeScript Compiler**: Type checking
- **Git**: Version control
- **GitHub**: Code hosting

---

## 📦 Setup

### Prerequisites
- Node.js 22.x or higher
- pnpm package manager
- MySQL/TiDB database
- Manus account (for OAuth)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/OgSmiley1/lakbira-dash.git
   cd lakbira-dash
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   DATABASE_URL=mysql://user:password@host:port/database
   JWT_SECRET=your-jwt-secret
   VITE_APP_ID=your-manus-app-id
   OAUTH_SERVER_URL=https://api.manus.im
   VITE_OAUTH_PORTAL_URL=https://portal.manus.im
   OWNER_OPEN_ID=your-owner-id
   OWNER_NAME=Your Name
   VITE_APP_TITLE=La Kbira Fashion
   VITE_APP_LOGO=/logo.svg
   ```

4. **Initialize the database**
   ```bash
   pnpm db:push
   ```

5. **Seed sample data (optional)**
   ```bash
   node scripts/seed.js
   ```

6. **Start the development server**
   ```bash
   pnpm dev
   ```

7. **Access the application**
   - Frontend: `http://localhost:3000`
   - Admin Dashboard: `http://localhost:3000/dashboard`

---

## 📁 Project Structure

```
lakbira-dash/
├── client/                 # Frontend React application
│   ├── public/            # Static assets (images, fonts)
│   └── src/
│       ├── pages/         # Page components
│       │   ├── Home.tsx           # Cinematic homepage
│       │   ├── Products.tsx       # Product catalog
│       │   ├── ProductDetail.tsx  # Product detail with live preview
│       │   ├── OrderForm.tsx      # Comprehensive order form
│       │   └── Dashboard.tsx      # Admin dashboard
│       ├── components/    # Reusable UI components
│       ├── lib/          # Utilities and tRPC client
│       └── index.css     # Global styles and theme
├── server/               # Backend Express + tRPC
│   ├── routers.ts       # tRPC API routes
│   ├── db.ts            # Database queries
│   └── _core/           # Core server utilities
├── drizzle/             # Database schema and migrations
│   └── schema.ts        # Database schema definitions
├── shared/              # Shared types and constants
└── package.json         # Dependencies and scripts
```

---

## 🎨 Design System

### Color Palette
- **Primary (Moroccan Gold)**: `#D4AF37`
- **Secondary (Deep Burgundy)**: `#8B0000`
- **Accent (Terracotta)**: `#E07A5F`
- **Neutral (Cream)**: `#F5F5DC`
- **Background**: `#FAFAF9`

### Typography
- **Arabic**: Noto Naskh Arabic (serif)
- **English**: Playfair Display (serif headings), Inter (body)

### Moroccan Patterns
- Geometric zellige patterns
- Traditional embroidery motifs
- Subtle overlay on hero sections

---

## 🔐 Authentication & Roles

### User Roles
- **Admin**: Full access to dashboard, order management
- **User**: Browse products, submit orders

### Admin Access
To access the admin dashboard:
1. Log in with your Manus account
2. Ensure your account has `admin` role in the database
3. Navigate to `/dashboard`

---

## 📊 Database Schema

### Tables

#### `users`
- `id`: Primary key
- `name`: User's full name
- `email`: Email address
- `role`: `admin` | `user`
- `createdAt`: Account creation timestamp
- `lastSignedIn`: Last login timestamp

#### `products`
- `id`: Primary key
- `nameEn`: English product name
- `nameAr`: Arabic product name
- `descriptionEn`: English description
- `descriptionAr`: Arabic description
- `basePrice`: Price in cents (AED)
- `images`: JSON array of image URLs
- `availableColors`: JSON array of color objects
- `availableSizes`: JSON array of sizes
- `fabricEn`: Fabric description (English)
- `fabricAr`: Fabric description (Arabic)
- `isActive`: Product visibility

#### `orders`
- `id`: Primary key
- `orderNumber`: Unique order identifier
- `customerName`: Customer's full name
- `customerEmail`: Email address
- `customerPhone`: Phone number
- `customerWhatsapp`: WhatsApp number
- `shippingCity`: Delivery city
- `shippingAddress`: Full address
- `shippingCountry`: Country
- `productId`: Reference to product
- `selectedColor`: Chosen color
- `selectedSize`: Chosen size
- `customMeasurements`: JSON object with measurements
- `customerNotes`: Special requests
- `basePrice`: Product base price
- `customizationFee`: Additional fee for custom measurements
- `totalPrice`: Final price
- `status`: `pending` | `approved` | `rejected` | `processing` | `completed`
- `adminNotes`: Internal admin notes
- `rejectionReason`: Reason for rejection
- `createdAt`: Order creation timestamp
- `approvedAt`: Approval timestamp
- `rejectedAt`: Rejection timestamp
- `completedAt`: Completion timestamp

---

## 🚦 API Endpoints (tRPC)

### Public Procedures
- `auth.me`: Get current user
- `auth.logout`: Logout user
- `products.list`: Get all active products
- `products.getById`: Get product by ID
- `collections.list`: Get all collections
- `collections.getById`: Get collection by ID
- `orders.create`: Submit a new order

### Protected Procedures (Admin only)
- `orders.list`: Get all orders
- `orders.getById`: Get order by ID
- `orders.updateStatus`: Approve/reject order

---

## 🎯 Future Enhancements

### Planned Features
- [ ] Instagram integration for automatic image import
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications for order status changes
- [ ] WhatsApp Business API integration
- [ ] Advanced analytics dashboard
- [ ] Customer account portal
- [ ] Wishlist functionality
- [ ] Product reviews and ratings
- [ ] Multi-currency support
- [ ] Shipping tracking integration
- [ ] AR try-on feature
- [ ] Size recommendation AI

---

## 📝 Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build

# Database
pnpm db:push      # Push schema changes to database
pnpm db:studio    # Open Drizzle Studio

# Code Quality
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript compiler
```

---

## 🤝 Contributing

This is a proprietary project. For collaboration inquiries, please contact the project owner.

---

## 📄 License

Proprietary - All rights reserved

---

## 👨‍💻 Developer

Built with ❤️ by [OgSmiley1](https://github.com/OgSmiley1)

---

## 🙏 Acknowledgments

- Inspired by Moroccan heritage and craftsmanship
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- Fonts from [Google Fonts](https://fonts.google.com)

---

<div align="center">

**La Kbira** - *Where Tradition Meets Elegance*

لا كبيرة - *حيث يلتقي التراث بالأناقة*

</div>

