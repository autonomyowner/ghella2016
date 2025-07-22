const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['your-firebase-storage-url.com'], // Replace with your firebase storage URL
  },
  env: {
    firebase_URL: process.env.firebase_URL,
    firebase_ANON_KEY: process.env.firebase_ANON_KEY,
  },
};

module.exports = nextConfig;