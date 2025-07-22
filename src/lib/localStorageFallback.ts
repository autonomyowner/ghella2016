// Local Storage Fallback for Firebase Free Plan Limits
export interface LocalStorageData {
  equipment: any[];
  animals: any[];
  profiles: any[];
  categories: any[];
  messages: any[];
  favorites: any[];
  reviews: any[];
  lastSync: number;
  land: any[]; // Added land property
  nurseries: any[]; // Added nurseries property
  labor: any[]; // Added labor property
  analysis: any[]; // Added analysis property
  delivery: any[]; // Added delivery property
  vegetables: any[]; // Added vegetables property
}

export class LocalStorageManager {
  private static instance: LocalStorageManager;
  private data: LocalStorageData;
  private readonly STORAGE_KEY = 'elghella_marketplace_data';
  private readonly SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    this.data = this.loadFromStorage();
  }

  static getInstance(): LocalStorageManager {
    if (!LocalStorageManager.instance) {
      LocalStorageManager.instance = new LocalStorageManager();
    }
    return LocalStorageManager.instance;
  }

  private loadFromStorage(): LocalStorageData {
    if (typeof window === 'undefined') {
      return this.getDefaultData();
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...this.getDefaultData(), ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
    }

    return this.getDefaultData();
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  private getDefaultData(): LocalStorageData {
    return {
      equipment: [],
      animals: [],
      profiles: [],
      categories: [],
      messages: [],
      favorites: [],
      reviews: [],
      lastSync: Date.now(),
      land: [], // Initialize land
      nurseries: [], // Initialize nurseries
      labor: [], // Initialize labor
      analysis: [], // Initialize analysis
      delivery: [], // Initialize delivery
      vegetables: [], // Initialize vegetables
    };
  }

  // Equipment operations
  getEquipment(): any[] {
    return this.data.equipment;
  }

  addEquipment(item: any): void {
    const existingIndex = this.data.equipment.findIndex(e => e.id === item.id);
    if (existingIndex >= 0) {
      this.data.equipment[existingIndex] = { ...item, updatedAt: Date.now() };
    } else {
      this.data.equipment.push({ ...item, createdAt: Date.now(), updatedAt: Date.now() });
    }
    this.saveToStorage();
  }

  updateEquipment(id: string, updates: any): void {
    const index = this.data.equipment.findIndex(e => e.id === id);
    if (index >= 0) {
      this.data.equipment[index] = { ...this.data.equipment[index], ...updates, updatedAt: Date.now() };
      this.saveToStorage();
    }
  }

  deleteEquipment(id: string): void {
    this.data.equipment = this.data.equipment.filter(e => e.id !== id);
    this.saveToStorage();
  }

  // Animal operations
  getAnimals(): any[] {
    return this.data.animals;
  }

  addAnimal(item: any): void {
    const existingIndex = this.data.animals.findIndex(a => a.id === item.id);
    if (existingIndex >= 0) {
      this.data.animals[existingIndex] = { ...item, updated_at: Date.now() };
    } else {
      this.data.animals.push({ ...item, created_at: Date.now(), updated_at: Date.now() });
    }
    this.saveToStorage();
  }

  updateAnimal(id: string, updates: any): void {
    const index = this.data.animals.findIndex(a => a.id === id);
    if (index >= 0) {
      this.data.animals[index] = { ...this.data.animals[index], ...updates, updated_at: Date.now() };
      this.saveToStorage();
    }
  }

  deleteAnimal(id: string): void {
    this.data.animals = this.data.animals.filter(a => a.id !== id);
    this.saveToStorage();
  }

  // Profile operations
  getProfile(userId: string): any | null {
    return this.data.profiles.find(p => p.id === userId) || null;
  }

  updateProfile(userId: string, updates: any): void {
    const index = this.data.profiles.findIndex(p => p.id === userId);
    if (index >= 0) {
      this.data.profiles[index] = { ...this.data.profiles[index], ...updates, updatedAt: Date.now() };
    } else {
      this.data.profiles.push({ id: userId, ...updates, createdAt: Date.now(), updatedAt: Date.now() });
    }
    this.saveToStorage();
  }

  // Categories operations
  getCategories(): any[] {
    return this.data.categories;
  }

  // Messages operations
  getMessages(userId: string): any[] {
    return this.data.messages.filter(m => m.senderId === userId || m.receiverId === userId);
  }

  addMessage(message: any): void {
    this.data.messages.push({ ...message, createdAt: Date.now() });
    this.saveToStorage();
  }

  // Favorites operations
  getFavorites(userId: string): any[] {
    return this.data.favorites.filter(f => f.userId === userId);
  }

  addFavorite(userId: string, itemId: string, itemType: string): void {
    const existing = this.data.favorites.find(f => f.userId === userId && f.itemId === itemId);
    if (!existing) {
      this.data.favorites.push({ userId, itemId, itemType, createdAt: Date.now() });
      this.saveToStorage();
    }
  }

  removeFavorite(userId: string, itemId: string): void {
    this.data.favorites = this.data.favorites.filter(f => !(f.userId === userId && f.itemId === itemId));
    this.saveToStorage();
  }

  // Reviews operations
  getReviews(itemId: string): any[] {
    return this.data.reviews.filter(r => r.itemId === itemId);
  }

  addReview(review: any): void {
    this.data.reviews.push({ ...review, createdAt: Date.now() });
    this.saveToStorage();
  }

  // Land operations
  getLand(): any[] {
    return this.data.land || [];
  }

  addLand(item: any): void {
    const data = this.data;
    data.land = data.land || [];
    data.land.push(item);
    this.saveToStorage();
  }

  updateLand(id: string, updates: any): void {
    const data = this.data;
    data.land = data.land || [];
    const index = data.land.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      data.land[index] = { ...data.land[index], ...updates };
      this.saveToStorage();
    }
  }

  deleteLand(id: string): void {
    const data = this.data;
    data.land = data.land || [];
    data.land = data.land.filter((item: any) => item.id !== id);
    this.saveToStorage();
  }

  // Nurseries operations
  getNurseries(): any[] {
    return this.data.nurseries || [];
  }

  addNursery(item: any): void {
    const data = this.data;
    data.nurseries = data.nurseries || [];
    data.nurseries.push(item);
    this.saveToStorage();
  }

  updateNursery(id: string, updates: any): void {
    const data = this.data;
    data.nurseries = data.nurseries || [];
    const index = data.nurseries.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      data.nurseries[index] = { ...data.nurseries[index], ...updates };
      this.saveToStorage();
    }
  }

  deleteNursery(id: string): void {
    const data = this.data;
    data.nurseries = data.nurseries || [];
    data.nurseries = data.nurseries.filter((item: any) => item.id !== id);
    this.saveToStorage();
  }

  // Labor operations
  getLabor(): any[] {
    return this.data.labor || [];
  }

  addLabor(item: any): void {
    const data = this.data;
    data.labor = data.labor || [];
    data.labor.push(item);
    this.saveToStorage();
  }

  updateLabor(id: string, updates: any): void {
    const data = this.data;
    data.labor = data.labor || [];
    const index = data.labor.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      data.labor[index] = { ...data.labor[index], ...updates };
      this.saveToStorage();
    }
  }

  deleteLabor(id: string): void {
    const data = this.data;
    data.labor = data.labor || [];
    data.labor = data.labor.filter((item: any) => item.id !== id);
    this.saveToStorage();
  }

  // Analysis operations
  getAnalysis(): any[] {
    return this.data.analysis || [];
  }

  addAnalysis(item: any): void {
    const data = this.data;
    data.analysis = data.analysis || [];
    data.analysis.push(item);
    this.saveToStorage();
  }

  updateAnalysis(id: string, updates: any): void {
    const data = this.data;
    data.analysis = data.analysis || [];
    const index = data.analysis.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      data.analysis[index] = { ...data.analysis[index], ...updates };
      this.saveToStorage();
    }
  }

  deleteAnalysis(id: string): void {
    const data = this.data;
    data.analysis = data.analysis || [];
    data.analysis = data.analysis.filter((item: any) => item.id !== id);
    this.saveToStorage();
  }

  // Delivery operations
  getDelivery(): any[] {
    return this.data.delivery || [];
  }

  addDelivery(item: any): void {
    const data = this.data;
    data.delivery = data.delivery || [];
    data.delivery.push(item);
    this.saveToStorage();
  }

  updateDelivery(id: string, updates: any): void {
    const data = this.data;
    data.delivery = data.delivery || [];
    const index = data.delivery.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      data.delivery[index] = { ...data.delivery[index], ...updates };
      this.saveToStorage();
    }
  }

  deleteDelivery(id: string): void {
    const data = this.data;
    data.delivery = data.delivery || [];
    data.delivery = data.delivery.filter((item: any) => item.id !== id);
    this.saveToStorage();
  }

  // Vegetables operations
  getVegetables(): any[] {
    return this.data.vegetables || [];
  }

  addVegetable(item: any): void {
    const data = this.data;
    data.vegetables = data.vegetables || [];
    data.vegetables.push(item);
    this.saveToStorage();
  }

  updateVegetable(id: string, updates: any): void {
    const data = this.data;
    data.vegetables = data.vegetables || [];
    const index = data.vegetables.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      data.vegetables[index] = { ...data.vegetables[index], ...updates };
      this.saveToStorage();
    }
  }

  deleteVegetable(id: string): void {
    const data = this.data;
    data.vegetables = data.vegetables || [];
    data.vegetables = data.vegetables.filter((item: any) => item.id !== id);
    this.saveToStorage();
  }

  // Sync status
  needsSync(): boolean {
    return Date.now() - this.data.lastSync > this.SYNC_INTERVAL;
  }

  markSynced(): void {
    this.data.lastSync = Date.now();
    this.saveToStorage();
  }

  // Search functionality
  searchEquipment(query: string): any[] {
    const searchTerm = query.toLowerCase();
    return this.data.equipment.filter(item => 
      item.title?.toLowerCase().includes(searchTerm) ||
      item.description?.toLowerCase().includes(searchTerm) ||
      item.location?.toLowerCase().includes(searchTerm) ||
      item.category?.toLowerCase().includes(searchTerm)
    );
  }

  // Filter functionality
  filterEquipment(filters: {
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: string;
  }): any[] {
    return this.data.equipment.filter(item => {
      if (filters.category && item.category !== filters.category) return false;
      if (filters.location && !item.location?.includes(filters.location)) return false;
      if (filters.minPrice && item.price < filters.minPrice) return false;
      if (filters.maxPrice && item.price > filters.maxPrice) return false;
      if (filters.condition && item.condition !== filters.condition) return false;
      return true;
    });
  }

  // Clear all data (for testing or reset)
  clearAll(): void {
    this.data = this.getDefaultData();
    this.saveToStorage();
  }

  // Export data for backup
  exportData(): LocalStorageData {
    return { ...this.data };
  }

  // Import data from backup
  importData(data: LocalStorageData): void {
    this.data = { ...this.getDefaultData(), ...data };
    this.saveToStorage();
  }
}

// Singleton instance
export const localStorageManager = LocalStorageManager.getInstance(); 