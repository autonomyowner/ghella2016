// Centralized marketplace data management with localStorage persistence
// This would typically connect to your database (Firebase, Supabase, etc.)

export interface MarketplaceItem {
  id: string;
  name: string;
  category: 'products' | 'lands' | 'machines' | 'nurseries' | 'animals' | 'services';
  subcategory: string;
  price: number;
  unit: string;
  location: string;
  locationName: string;
  type: 'sale' | 'rent' | 'exchange' | 'partnership';
  description: string;
  isOrganic: boolean;
  isVerified: boolean;
  hasDelivery: boolean;
  rating: number;
  reviews: number;
  stock: number;
  image: string;
  tags: string[];
  sellerId: string;
  sellerName: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  images?: string[];
  specifications?: Record<string, any>;
  contactInfo?: {
    phone?: string;
    email?: string;
    whatsapp?: string;
  };
}

// Sample data - in real app this would come from your database
const initialSampleData: MarketplaceItem[] = [
  // Products
  {
    id: 'prod-1',
    name: 'طماطم طازجة',
    category: 'products',
    subcategory: 'vegetables',
    price: 150,
    unit: 'كغ',
    location: 'algiers',
    locationName: 'الجزائر',
    type: 'sale',
    description: 'طماطم طازجة من مزارع الجزائر العاصمة، جودة عالية',
    isOrganic: true,
    isVerified: true,
    hasDelivery: true,
    rating: 4.8,
    reviews: 127,
    stock: 500,
    image: '🍅',
    tags: ['طازج', 'عضوي', 'محلي', 'خضروات'],
    sellerId: 'seller-1',
    sellerName: 'مزرعة الجزائر الخضراء',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    isActive: true,
    contactInfo: {
      phone: '+213 555 123 456',
      whatsapp: '+213 555 123 456'
    }
  },
  {
    id: 'prod-2',
    name: 'قمح قاسي للتصدير',
    category: 'products',
    subcategory: 'grains',
    price: 4500,
    unit: 'قنطار',
    location: 'annaba',
    locationName: 'عنابة',
    type: 'sale',
    description: 'قمح قاسي عالي الجودة للتصدير، شهادة جودة معتمدة',
    isOrganic: true,
    isVerified: true,
    hasDelivery: true,
    rating: 4.9,
    reviews: 234,
    stock: 100,
    image: '🌾',
    tags: ['قمح', 'قاسي', 'تصدير', 'حبوب'],
    sellerId: 'seller-2',
    sellerName: 'مزرعة عنابة للتصدير',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    isActive: true
  },

  // Lands
  {
    id: 'land-1',
    name: 'أرض زراعية خصبة للبيع',
    category: 'lands',
    subcategory: 'agricultural',
    price: 5000000,
    unit: 'هكتار',
    location: 'setif',
    locationName: 'سطيف',
    type: 'sale',
    description: 'أرض زراعية خصبة في سطيف، مساحة 5 هكتار، مياه جوفية متوفرة',
    isOrganic: false,
    isVerified: true,
    hasDelivery: false,
    rating: 4.9,
    reviews: 45,
    stock: 1,
    image: '🌾',
    tags: ['أرض', 'زراعية', 'خصبة', 'سطيف'],
    sellerId: 'seller-3',
    sellerName: 'عائلة بن محمد',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    isActive: true,
    specifications: {
      area: '5 هكتار',
      soilType: 'طيني خصيب',
      waterSource: 'مياه جوفية',
      roadAccess: true
    }
  },

  // Machines/Equipment
  {
    id: 'machine-1',
    name: 'جرار زراعي حديث',
    category: 'machines',
    subcategory: 'tractors',
    price: 2500000,
    unit: 'قطعة',
    location: 'oran',
    locationName: 'وهران',
    type: 'sale',
    description: 'جرار زراعي حديث، موديل 2023، حالة ممتازة',
    isOrganic: false,
    isVerified: true,
    hasDelivery: true,
    rating: 4.7,
    reviews: 89,
    stock: 3,
    image: '🚜',
    tags: ['جرار', 'حديث', 'جودة عالية', 'معدات'],
    sellerId: 'seller-4',
    sellerName: 'شركة المعدات الزراعية',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    isActive: true,
    specifications: {
      brand: 'John Deere',
      model: '2023',
      horsepower: '75 HP',
      condition: 'ممتازة'
    }
  },
  {
    id: 'machine-2',
    name: 'مضخة ري للبيع',
    category: 'machines',
    subcategory: 'irrigation',
    price: 150000,
    unit: 'قطعة',
    location: 'constantine',
    locationName: 'قسنطينة',
    type: 'sale',
    description: 'مضخة ري حديثة، قدرة عالية، مناسبة للمزارع الكبيرة',
    isOrganic: false,
    isVerified: true,
    hasDelivery: true,
    rating: 4.5,
    reviews: 67,
    stock: 8,
    image: '💧',
    tags: ['مضخة', 'ري', 'حديثة', 'معدات'],
    sellerId: 'seller-5',
    sellerName: 'مؤسسة الري الحديث',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    isActive: true
  },

  // Nurseries
  {
    id: 'nursery-1',
    name: 'شتلات زيتون عالية الجودة',
    category: 'nurseries',
    subcategory: 'olive',
    price: 500,
    unit: 'شتلة',
    location: 'constantine',
    locationName: 'قسنطينة',
    type: 'sale',
    description: 'شتلات زيتون عالية الجودة، عمر 2 سنة، جاهزة للزراعة',
    isOrganic: true,
    isVerified: true,
    hasDelivery: true,
    rating: 4.6,
    reviews: 156,
    stock: 200,
    image: '🫒',
    tags: ['زيتون', 'شتلات', 'عضوي', 'مشاتل'],
    sellerId: 'seller-6',
    sellerName: 'مشتل قسنطينة',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    isActive: true,
    specifications: {
      age: '2 سنة',
      variety: 'دقلة نور',
      height: '1.5 متر'
    }
  },
  {
    id: 'nursery-2',
    name: 'شتلات تفاح',
    category: 'nurseries',
    subcategory: 'fruit',
    price: 300,
    unit: 'شتلة',
    location: 'batna',
    locationName: 'باتنة',
    type: 'sale',
    description: 'شتلات تفاح محسنة، مقاومة للأمراض، إنتاجية عالية',
    isOrganic: true,
    isVerified: true,
    hasDelivery: true,
    rating: 4.4,
    reviews: 89,
    stock: 150,
    image: '🍎',
    tags: ['تفاح', 'شتلات', 'محسنة', 'مشاتل'],
    sellerId: 'seller-7',
    sellerName: 'مشتل باتنة للفواكه',
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
    isActive: true
  },

  // Animals
  {
    id: 'animal-1',
    name: 'أبقار حلوب منتجة',
    category: 'animals',
    subcategory: 'cattle',
    price: 80000,
    unit: 'رأس',
    location: 'tiaret',
    locationName: 'تيارت',
    type: 'sale',
    description: 'أبقار حلوب منتجة، سلالة محسنة، إنتاجية عالية من الحليب',
    isOrganic: false,
    isVerified: true,
    hasDelivery: true,
    rating: 4.5,
    reviews: 67,
    stock: 15,
    image: '🐄',
    tags: ['أبقار', 'حلوب', 'منتجة', 'حيوانات'],
    sellerId: 'seller-8',
    sellerName: 'مزرعة تيارت للألبان',
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-09'),
    isActive: true,
    specifications: {
      breed: 'هولشتاين',
      age: '3-5 سنوات',
      milkProduction: '25 لتر/يوم',
      healthStatus: 'مطعم ومفحوص'
    }
  },
  {
    id: 'animal-2',
    name: 'أغنام للبيع',
    category: 'animals',
    subcategory: 'sheep',
    price: 25000,
    unit: 'رأس',
    location: 'setif',
    locationName: 'سطيف',
    type: 'sale',
    description: 'أغنام سلالة محسنة، مناسبة للتربية والتكاثر',
    isOrganic: false,
    isVerified: true,
    hasDelivery: true,
    rating: 4.3,
    reviews: 45,
    stock: 25,
    image: '🐑',
    tags: ['أغنام', 'تربية', 'تكاثر', 'حيوانات'],
    sellerId: 'seller-9',
    sellerName: 'مزرعة سطيف للأغنام',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
    isActive: true
  },

  // Services
  {
    id: 'service-1',
    name: 'خدمة حراثة الأراضي',
    category: 'services',
    subcategory: 'plowing',
    price: 5000,
    unit: 'هكتار',
    location: 'algiers',
    locationName: 'الجزائر',
    type: 'rent',
    description: 'خدمة حراثة الأراضي باستخدام أحدث المعدات، خدمة سريعة ومضمونة',
    isOrganic: false,
    isVerified: true,
    hasDelivery: true,
    rating: 4.7,
    reviews: 123,
    stock: 999,
    image: '🚜',
    tags: ['حراثة', 'خدمة', 'أراضي', 'معدات'],
    sellerId: 'seller-10',
    sellerName: 'شركة الخدمات الزراعية',
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-07'),
    isActive: true,
    contactInfo: {
      phone: '+213 555 789 012',
      whatsapp: '+213 555 789 012'
    }
  },
  {
    id: 'service-2',
    name: 'استشارة زراعية متخصصة',
    category: 'services',
    subcategory: 'consultation',
    price: 2000,
    unit: 'جلسة',
    location: 'oran',
    locationName: 'وهران',
    type: 'sale',
    description: 'استشارة زراعية متخصصة من خبراء في المجال، نصائح عملية ومفيدة',
    isOrganic: false,
    isVerified: true,
    hasDelivery: false,
    rating: 4.8,
    reviews: 89,
    stock: 999,
    image: '👨‍🌾',
    tags: ['استشارة', 'زراعية', 'خبراء', 'نصائح'],
    sellerId: 'seller-11',
    sellerName: 'د. أحمد الزراعي',
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06'),
    isActive: true
  }
];

// LocalStorage management
const STORAGE_KEY = 'marketplace_data';

// Helper function to convert dates when loading from localStorage
const parseDates = (item: any): MarketplaceItem => ({
  ...item,
  createdAt: new Date(item.createdAt),
  updatedAt: new Date(item.updatedAt)
});

// Load data from localStorage or use initial data
const loadMarketplaceData = (): MarketplaceItem[] => {
  if (typeof window === 'undefined') {
    return initialSampleData;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed.map(parseDates) : initialSampleData;
    }
  } catch (error) {
    console.error('Error loading marketplace data:', error);
  }
  
  return initialSampleData;
};

// Save data to localStorage
const saveMarketplaceData = (data: MarketplaceItem[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving marketplace data:', error);
  }
};

// Initialize marketplace data
let marketplaceData: MarketplaceItem[] = loadMarketplaceData();

// Search and filter functions
export const searchMarketplace = (
  query: string,
  category: string,
  location: string,
  type: string,
  priceRange: { min: string; max: string },
  filters: { organic: boolean; verified: boolean; delivery: boolean }
): MarketplaceItem[] => {
  return marketplaceData.filter(item => {
    // Text search
    const matchesSearch = !query || 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));

    // Category filter
    const matchesCategory = category === 'all' || item.category === category;

    // Location filter
    const matchesLocation = location === 'all' || item.location === location;

    // Type filter
    const matchesType = type === 'all' || item.type === type;

    // Price range filter
    const matchesPrice = (!priceRange.min || item.price >= parseInt(priceRange.min)) &&
                        (!priceRange.max || item.price <= parseInt(priceRange.max));

    // Advanced filters
    const matchesOrganic = !filters.organic || item.isOrganic;
    const matchesVerified = !filters.verified || item.isVerified;
    const matchesDelivery = !filters.delivery || item.hasDelivery;

    return matchesSearch && matchesCategory && matchesLocation && 
           matchesType && matchesPrice && matchesOrganic && 
           matchesVerified && matchesDelivery;
  });
};

// Get item by ID
export const getMarketplaceItem = (id: string): MarketplaceItem | undefined => {
  return marketplaceData.find(item => item.id === id);
};

// Get items by category
export const getItemsByCategory = (category: string): MarketplaceItem[] => {
  return marketplaceData.filter(item => item.category === category);
};

// Get items by seller
export const getItemsBySeller = (sellerId: string): MarketplaceItem[] => {
  return marketplaceData.filter(item => item.sellerId === sellerId);
};

// Add new item (for when users post new items)
export const addMarketplaceItem = (item: Omit<MarketplaceItem, 'id' | 'createdAt' | 'updatedAt'>): MarketplaceItem => {
  const newItem: MarketplaceItem = {
    ...item,
    id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  marketplaceData.push(newItem);
  saveMarketplaceData(marketplaceData);
  return newItem;
};

// Update item
export const updateMarketplaceItem = (id: string, updates: Partial<MarketplaceItem>): MarketplaceItem | null => {
  const index = marketplaceData.findIndex(item => item.id === id);
  if (index === -1) return null;
  
  marketplaceData[index] = {
    ...marketplaceData[index],
    ...updates,
    updatedAt: new Date()
  };
  
  saveMarketplaceData(marketplaceData);
  return marketplaceData[index];
};

// Delete item
export const deleteMarketplaceItem = (id: string): boolean => {
  const index = marketplaceData.findIndex(item => item.id === id);
  if (index === -1) return false;
  
  marketplaceData.splice(index, 1);
  saveMarketplaceData(marketplaceData);
  return true;
};

// Get all marketplace data
export const getAllMarketplaceData = (): MarketplaceItem[] => {
  return [...marketplaceData];
};

// Reset to initial data (for development/testing)
export const resetMarketplaceData = (): void => {
  marketplaceData = [...initialSampleData];
  saveMarketplaceData(marketplaceData);
}; 