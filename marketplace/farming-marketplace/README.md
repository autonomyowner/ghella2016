# Farming & Agricultural Equipment Marketplace

Welcome to the Farming & Agricultural Equipment Marketplace project! This application is designed to facilitate the buying and selling of agricultural equipment, land, and machinery, providing a seamless experience for farmers and buyers.

## Project Overview

This marketplace allows users to:
- List and browse various agricultural equipment such as tractors, harvesters, and irrigation systems.
- Buy or rent farmland with detailed listings.
- Create user profiles for farmers and buyers, enabling personalized experiences.
- Search and filter listings based on location, price, equipment type, and land size.
- Upload images and documents related to equipment and land.
- Make secure transactions for purchases and rentals.

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Storage)
- **State Management**: React hooks, Supabase realtime
- **Deployment**: Vercel

## Key Features

- **User Authentication**: Secure login and registration for users.
- **Responsive Design**: Mobile-first approach using Tailwind CSS.
- **Reusable Components**: Modular components for listings, forms, and UI elements.
- **Error Handling**: Proper error handling and loading states for a better user experience.

## Directory Structure

The project is organized as follows:

```
farming-marketplace
├── src
│   ├── app
│   ├── components
│   ├── lib
│   ├── types
│   └── hooks
├── public
├── .env.local
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   cd farming-marketplace
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your environment variables in `.env.local`:
   ```
   SUPABASE_URL=<your-supabase-url>
   SUPABASE_ANON_KEY=<your-supabase-anon-key>
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.