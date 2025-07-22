import { supabase } from './supabase/supabaseClient';

export interface MarketplaceItem {
  id: string;
  name: string;
  category: 'products' | 'lands' | 'machines' | 'nurseries' | 'animals' | 'services';
  subcategory: string;
  price: number;
  unit: string;
  location: string;
  location_name: string;
  type: 'sale' | 'rent' | 'exchange' | 'partnership';
  description: string;
  is_organic: boolean;
  is_verified: boolean;
  has_delivery: boolean;
  rating: number;
  reviews: number;
  stock: number;
  image: string;
  tags: string[];
  seller_id?: string;
  seller_name: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  images?: string[];
  specifications?: Record<string, any>;
  contact_info?: {
    phone?: string;
    email?: string;
    whatsapp?: string;
  };
}

export interface SearchFilters {
  query?: string;
  category?: string;
  location?: string;
  type?: string;
  priceRange?: { min: string; max: string };
  filters?: { organic: boolean; verified: boolean; delivery: boolean };
}

// Get all marketplace items
export const getAllMarketplaceItems = async (): Promise<MarketplaceItem[]> => {
  try {
    const { data, error } = await supabase
      .from('marketplace_items')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching marketplace items:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllMarketplaceItems:', error);
    return [];
  }
};

// Search marketplace items with filters
export const searchMarketplaceItems = async (filters: SearchFilters): Promise<MarketplaceItem[]> => {
  try {
    let query = supabase
      .from('marketplace_items')
      .select('*')
      .eq('is_active', true);

    // Text search
    if (filters.query) {
      query = query.or(`name.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    // Location filter
    if (filters.location && filters.location !== 'all') {
      query = query.eq('location', filters.location);
    }

    // Type filter
    if (filters.type && filters.type !== 'all') {
      query = query.eq('type', filters.type);
    }

    // Price range filter
    if (filters.priceRange?.min) {
      query = query.gte('price', parseFloat(filters.priceRange.min));
    }
    if (filters.priceRange?.max) {
      query = query.lte('price', parseFloat(filters.priceRange.max));
    }

    // Advanced filters
    if (filters.filters?.organic) {
      query = query.eq('is_organic', true);
    }
    if (filters.filters?.verified) {
      query = query.eq('is_verified', true);
    }
    if (filters.filters?.delivery) {
      query = query.eq('has_delivery', true);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching marketplace items:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in searchMarketplaceItems:', error);
    return [];
  }
};

// Get item by ID
export const getMarketplaceItem = async (id: string): Promise<MarketplaceItem | null> => {
  try {
    const { data, error } = await supabase
      .from('marketplace_items')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching marketplace item:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getMarketplaceItem:', error);
    return null;
  }
};

// Get items by category
export const getItemsByCategory = async (category: string): Promise<MarketplaceItem[]> => {
  try {
    const { data, error } = await supabase
      .from('marketplace_items')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching items by category:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getItemsByCategory:', error);
    return [];
  }
};

// Get items by seller
export const getItemsBySeller = async (sellerId: string): Promise<MarketplaceItem[]> => {
  try {
    const { data, error } = await supabase
      .from('marketplace_items')
      .select('*')
      .eq('seller_id', sellerId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching items by seller:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getItemsBySeller:', error);
    return [];
  }
};

// Add new item
export const addMarketplaceItem = async (item: Omit<MarketplaceItem, 'id' | 'created_at' | 'updated_at'>): Promise<MarketplaceItem | null> => {
  try {
    const { data, error } = await supabase
      .from('marketplace_items')
      .insert([item])
      .select()
      .single();

    if (error) {
      console.error('Error adding marketplace item:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in addMarketplaceItem:', error);
    return null;
  }
};

// Update item
export const updateMarketplaceItem = async (id: string, updates: Partial<MarketplaceItem>): Promise<MarketplaceItem | null> => {
  try {
    const { data, error } = await supabase
      .from('marketplace_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating marketplace item:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateMarketplaceItem:', error);
    return null;
  }
};

// Delete item (soft delete by setting is_active to false)
export const deleteMarketplaceItem = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('marketplace_items')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Error deleting marketplace item:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteMarketplaceItem:', error);
    return false;
  }
};

// Upload image to Supabase Storage
export const uploadImage = async (file: File, path: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('marketplace-images')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('marketplace-images')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    return null;
  }
};

// Get marketplace statistics
export const getMarketplaceStats = async () => {
  try {
    const { data, error } = await supabase
      .from('marketplace_items')
      .select('category, price')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching marketplace stats:', error);
      return {
        totalItems: 0,
        totalCategories: 0,
        averagePrice: 0,
        totalValue: 0
      };
    }

    const totalItems = data.length;
    const categories = new Set(data.map(item => item.category));
    const totalCategories = categories.size;
    const averagePrice = data.reduce((sum, item) => sum + item.price, 0) / totalItems;
    const totalValue = data.reduce((sum, item) => sum + item.price, 0);

    return {
      totalItems,
      totalCategories,
      averagePrice: Math.round(averagePrice),
      totalValue: Math.round(totalValue)
    };
  } catch (error) {
    console.error('Error in getMarketplaceStats:', error);
    return {
      totalItems: 0,
      totalCategories: 0,
      averagePrice: 0,
      totalValue: 0
    };
  }
}; 