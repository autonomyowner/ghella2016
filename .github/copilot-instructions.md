# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a **Farming & Agricultural Equipment Marketplace** built with Next.js 14, TypeScript, and Firebase. The platform allows farmers to buy and sell agricultural equipment, land, and machinery.

## Key Features
- **Equipment Listings**: Tractors, harvesters, plows, irrigation systems
- **Land Listings**: Farmland sales and rentals
- **User Authentication**: Farmer profiles, buyer/seller accounts
- **Search & Filtering**: Location, price, equipment type, land size
- **File Uploads**: Equipment photos, land documentation
- **Mobile Responsive**: Tailwind CSS for responsive design
- **Payment Integration**: Secure transactions for equipment and land deals

## Tech Stack
- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Firebase (Database, Auth, Storage)
- **State Management**: React hooks, Firebase realtime
- **Styling**: Tailwind CSS with custom agricultural theme
- **Deployment**: Vercel (recommended)

## Coding Guidelines
- Use TypeScript for all components and functions
- Follow Next.js 14 App Router conventions
- Implement responsive design with mobile-first approach
- Use Firebase client for database operations
- Create reusable components for listings, filters, and forms
- Implement proper error handling and loading states
- Use semantic HTML for accessibility
- Follow agricultural industry terminology and best practices

## Directory Structure
- `/src/app` - App Router pages and layouts
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and Firebase client
- `/src/types` - TypeScript type definitions
- `/src/hooks` - Custom React hooks
- `/public` - Static assets (images, icons)

## Firebase Schema Considerations
- **Users**: Profile data for farmers and buyers
- **Equipment**: Agricultural machinery listings
- **Land**: Farmland sales and rental listings
- **Categories**: Equipment types (tractors, harvesters, etc.)
- **Locations**: Geographic data for search
- **Transactions**: Purchase and rental records

When generating code, prioritize agricultural industry needs, user experience for farmers, and scalable marketplace functionality.
