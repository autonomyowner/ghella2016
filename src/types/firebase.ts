// Firebase types for the agricultural marketplace

export interface MarketplaceProduct {
  id?: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  isFresh: boolean;
  isOrganic: boolean;
  isExport: boolean;
  stock: number;
  maxStock: number;
  description: string;
  features: string[];
  farmerId: string;
  farmerName: string;
  farmerContact?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Expert {
  id?: string;
  name: string;
  title: string;
  specialization: string;
  bio: string;
  years_of_experience: number;
  education: string;
  location: string;
  email: string;
  phone: string;
  hourly_rate: number;
  certifications: string[];
  services_offered: string[];
  languages: string[];
  profile_image?: string;
  rating?: number;
  reviews?: number;
  availability?: 'available' | 'busy' | 'offline';
  verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserProfile {
  id?: string;
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  avatar_url?: string;
  user_type: 'farmer' | 'buyer' | 'expert' | 'both';
  is_verified: boolean;
  bio?: string;
  website?: string;
  social_links?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  created_at: Date;
  updated_at: Date;
}

export interface EquipmentListing {
  id?: string;
  user_id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  category_id: string;
  condition: 'new' | 'excellent' | 'good' | 'fair' | 'poor';
  year?: number;
  brand?: string;
  model?: string;
  hours_used?: number;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  images: string[];
  is_available: boolean;
  is_featured: boolean;
  view_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface LandListing {
  id?: string;
  user_id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  listing_type: 'sale' | 'rent';
  area_size: number;
  area_unit: 'hectare' | 'dunum' | 'acre';
  soil_type?: string;
  water_source?: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  images: string[];
  is_available: boolean;
  is_featured: boolean;
  view_count: number;
  created_at: Date;
  updated_at: Date;
}
