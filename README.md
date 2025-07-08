# 🌾 الغلة (La Ghalla) - Agricultural Marketplace

A modern, ultra-responsive agricultural marketplace platform built with Next.js 14, TypeScript, Supabase, and Tailwind CSS. Features a premium dark green glassmorphic theme with orange accents, advanced gradients, and smooth transitions.

## 🚀 Features

### ✅ Completed Features
- **Modern UI/UX**: Premium glassmorphic design with green/orange color scheme
- **RTL Arabic Support**: Full right-to-left layout support
- **Authentication System**: Complete user registration, login, and profile management
- **Equipment Marketplace**: 
  - Browse and search agricultural equipment
  - Detailed equipment listings with images
  - Create and manage equipment listings
  - Advanced filtering and sorting
- **Land Marketplace**:
  - Browse agricultural land for sale and rent
  - Detailed land listings with area, soil type, water source
  - Create and manage land listings
  - Advanced search and filtering
- **User Dashboard**: Profile management and listing overview
- **Responsive Design**: Mobile-first approach with perfect responsiveness
- **Image Upload**: Supabase storage integration for listing images
- **Real-time Updates**: Live data with Supabase real-time subscriptions

### 🔧 Technical Features
- **Next.js 14 App Router**: Latest Next.js features with server-side rendering
- **TypeScript**: Full type safety throughout the application
- **Supabase Integration**: 
  - Authentication with email/password
  - PostgreSQL database with Row Level Security (RLS)
  - File storage for images
  - Real-time subscriptions
- **Tailwind CSS**: Utility-first styling with custom design system
- **Mobile Responsive**: Optimized for all screen sizes
- **SEO Optimized**: Proper meta tags and semantic HTML

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel (recommended)
- **State Management**: React hooks, Supabase client
- **Styling**: Tailwind CSS with custom agricultural theme

## 📁 Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── about/             # About page
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Login page
│   │   └── signup/        # Signup page
│   ├── contact/           # Contact page
│   ├── dashboard/         # User dashboard
│   ├── equipment/         # Equipment marketplace
│   │   ├── [id]/         # Equipment detail page
│   │   └── new/          # Create equipment listing
│   ├── land/              # Land marketplace
│   │   ├── [id]/         # Land detail page
│   │   └── new/          # Create land listing
│   ├── profile/           # User profile management
│   └── listings/          # General listing creation
├── components/            # Reusable React components
│   ├── auth/             # Authentication components
│   ├── equipment/        # Equipment-specific components
│   ├── Header.tsx        # Main navigation
│   ├── Footer.tsx        # Footer component
│   └── ...
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── hooks/                # Custom React hooks
│   └── useData.ts        # Data fetching hooks
├── lib/                  # Utility functions
│   └── supabase/         # Supabase client configuration
├── types/                # TypeScript type definitions
│   └── database.types.ts # Database type definitions
└── globals.css           # Global styles with custom theme
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd elghellav1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

## 📊 Database Schema

### Key Tables
- **profiles**: User profile information
- **equipment**: Agricultural equipment listings
- **land_listings**: Agricultural land listings
- **categories**: Equipment categories
- **storage**: File storage for images

### Security
- Row Level Security (RLS) enabled on all tables
- User-specific data access controls
- Secure file upload and storage

## 🔄 Current Status

### ✅ Completed
- Complete authentication system
- Equipment marketplace (CRUD operations)
- Land marketplace (CRUD operations)
- User profile management
- Responsive design with mobile optimization
- Supabase integration with real-time updates
- Image upload and storage
- Advanced search and filtering

### 📋 Future Enhancements
- Messaging system between users
- Favorites/wishlist functionality
- Advanced notifications
- Payment integration
- Review and rating system
- Mobile app development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**الغلة (La Ghalla)** - Connecting farmers and investors in the agricultural sector through innovative digital solutions. 🌱
