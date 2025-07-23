'use client'

import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage, createOptimizedFirestore, FREE_PLAN_LIMITS } from '@/lib/firebaseConfig';
import { localStorageManager } from '@/lib/localStorageFallback';

// Hybrid hook that works with Firebase free plan limits
export const useFirebase = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isWithinLimits, setIsWithinLimits] = useState(true);
  const optimizedFirestore = createOptimizedFirestore();

  // Check if we're within Firebase free plan limits
  const checkLimits = useCallback(() => {
    const withinLimits = optimizedFirestore.isWithinLimits();
    setIsWithinLimits(withinLimits);
    return withinLimits;
  }, [optimizedFirestore]);

  // Check online status
  useEffect(() => {
    const checkOnline = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', checkOnline);
    window.addEventListener('offline', checkOnline);
    checkOnline();

    return () => {
      window.removeEventListener('online', checkOnline);
      window.removeEventListener('offline', checkOnline);
    };
  }, []);

  // Equipment operations
  const getEquipment = useCallback(async (filters?: any) => {
    try {
      // Check if we can use Firebase
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.readCount.count++;
        
        // Simple query without complex filters to avoid index requirements
        let q = query(collection(firestore, 'equipment'), orderBy('createdAt', 'desc'), limit(50));
        const snapshot = await getDocs(q);
        let equipment = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Apply filters client-side to avoid composite index requirements
        if (filters) {
          if (filters.category) {
            equipment = equipment.filter((item: any) => item.category === filters.category);
          }
          if (filters.location) {
            equipment = equipment.filter((item: any) => item.location === filters.location);
          }
          if (filters.minPrice) {
            equipment = equipment.filter((item: any) => item.price >= filters.minPrice);
          }
          if (filters.maxPrice) {
            equipment = equipment.filter((item: any) => item.price <= filters.maxPrice);
          }
          if (filters.condition) {
            equipment = equipment.filter((item: any) => item.condition === filters.condition);
          }
        }
        
        // Cache in localStorage for offline use
        equipment.forEach(item => localStorageManager.addEquipment(item));
        
        return equipment;
      } else {
        // Use localStorage fallback
        console.log('Using localStorage fallback for equipment');
        let equipment = localStorageManager.getEquipment();
        
        // Apply filters to localStorage data as well
        if (filters) {
          if (filters.category) {
            equipment = equipment.filter((item: any) => item.category === filters.category);
          }
          if (filters.location) {
            equipment = equipment.filter((item: any) => item.location === filters.location);
          }
          if (filters.minPrice) {
            equipment = equipment.filter((item: any) => item.price >= filters.minPrice);
          }
          if (filters.maxPrice) {
            equipment = equipment.filter((item: any) => item.price <= filters.maxPrice);
          }
          if (filters.condition) {
            equipment = equipment.filter((item: any) => item.condition === filters.condition);
          }
        }
        
        return equipment;
      }
    } catch (error) {
      console.error('Error fetching equipment:', error);
      // Fallback to localStorage with filters
      let equipment = localStorageManager.getEquipment();
      
      if (filters) {
        if (filters.category) {
          equipment = equipment.filter((item: any) => item.category === filters.category);
        }
        if (filters.location) {
          equipment = equipment.filter((item: any) => item.location === filters.location);
        }
        if (filters.minPrice) {
          equipment = equipment.filter((item: any) => item.price >= filters.minPrice);
        }
        if (filters.maxPrice) {
          equipment = equipment.filter((item: any) => item.price <= filters.maxPrice);
        }
        if (filters.condition) {
          equipment = equipment.filter((item: any) => item.condition === filters.condition);
        }
      }
      
      return equipment;
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  const addEquipment = useCallback(async (equipmentData: any) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.writeCount.count++;
        
        const docRef = await addDoc(collection(firestore, 'equipment'), {
        ...equipmentData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        const newEquipment = { id: docRef.id, ...equipmentData };
        localStorageManager.addEquipment(newEquipment);
        
        return { id: docRef.id, ...newEquipment };
      } else {
        // Use localStorage fallback
        const id = `local_${Date.now()}`;
        const newEquipment = { id, ...equipmentData };
        localStorageManager.addEquipment(newEquipment);
        return newEquipment;
      }
    } catch (error) {
      console.error('Error adding equipment:', error);
      // Fallback to localStorage
      const id = `local_${Date.now()}`;
      const newEquipment = { id, ...equipmentData };
      localStorageManager.addEquipment(newEquipment);
      return newEquipment;
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  const updateEquipment = useCallback(async (id: string, updates: any) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.writeCount.count++;
        
        const docRef = doc(firestore, 'equipment', id);
        await updateDoc(docRef, {
        ...updates,
          updatedAt: new Date().toISOString()
        });
        
        localStorageManager.updateEquipment(id, updates);
        return { success: true };
      } else {
        localStorageManager.updateEquipment(id, updates);
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating equipment:', error);
      localStorageManager.updateEquipment(id, updates);
      return { success: true };
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  const deleteEquipment = useCallback(async (id: string) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.writeCount.count++;
        
        await deleteDoc(doc(firestore, 'equipment', id));
        localStorageManager.deleteEquipment(id);
        
        return { success: true };
      } else {
        localStorageManager.deleteEquipment(id);
        return { success: true };
      }
    } catch (error) {
      console.error('Error deleting equipment:', error);
      localStorageManager.deleteEquipment(id);
      return { success: true };
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  // Animal operations
  const getAnimals = useCallback(async (filters?: any) => {
    try {
      // Check if we can use Firebase
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.readCount.count++;
        
        // Try to query with created_at, but fallback to simple query if it fails
        let animals: any[] = [];
        try {
          let q = query(collection(firestore, 'animal_listings'), orderBy('created_at', 'desc'), limit(50));
          const snapshot = await getDocs(q);
          animals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (orderError) {
          // If ordering by created_at fails, get all documents and sort client-side
          console.log('Ordering by created_at failed, using client-side sorting');
          const snapshot = await getDocs(collection(firestore, 'animal_listings'));
          animals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          // Sort by created_at if available, otherwise by id
          animals.sort((a: any, b: any) => {
            if (a.created_at && b.created_at) {
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
            return b.id.localeCompare(a.id);
          });
        }
        
        // Apply filters client-side to avoid composite index requirements
        if (filters) {
          if (filters.animal_type) {
            animals = animals.filter((item: any) => item.animal_type === filters.animal_type);
          }
          if (filters.location) {
            animals = animals.filter((item: any) => item.location === filters.location);
          }
          if (filters.minPrice) {
            animals = animals.filter((item: any) => item.price >= filters.minPrice);
          }
          if (filters.maxPrice) {
            animals = animals.filter((item: any) => item.price <= filters.maxPrice);
          }
          if (filters.purpose) {
            animals = animals.filter((item: any) => item.purpose === filters.purpose);
          }
          if (filters.gender) {
            animals = animals.filter((item: any) => item.gender === filters.gender);
          }
        }
        
        // Cache in localStorage for offline use
        animals.forEach(item => localStorageManager.addAnimal(item));
        
        return animals;
      } else {
        // Use localStorage fallback
        console.log('Using localStorage fallback for animals');
        let animals = localStorageManager.getAnimals();
        
        // Sort by created_at if available, otherwise by id
        animals.sort((a: any, b: any) => {
          if (a.created_at && b.created_at) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          return b.id.localeCompare(a.id);
        });
        
        // Apply filters to localStorage data as well
        if (filters) {
          if (filters.animal_type) {
            animals = animals.filter((item: any) => item.animal_type === filters.animal_type);
          }
          if (filters.location) {
            animals = animals.filter((item: any) => item.location === filters.location);
          }
          if (filters.minPrice) {
            animals = animals.filter((item: any) => item.price >= filters.minPrice);
          }
          if (filters.maxPrice) {
            animals = animals.filter((item: any) => item.price <= filters.maxPrice);
          }
          if (filters.purpose) {
            animals = animals.filter((item: any) => item.purpose === filters.purpose);
          }
          if (filters.gender) {
            animals = animals.filter((item: any) => item.gender === filters.gender);
          }
        }
        
        return animals;
      }
    } catch (error) {
      console.error('Error fetching animals:', error);
      // Fallback to localStorage with filters
      let animals = localStorageManager.getAnimals();
      
      // Sort by created_at if available, otherwise by id
      animals.sort((a: any, b: any) => {
        if (a.created_at && b.created_at) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return b.id.localeCompare(a.id);
      });
      
      if (filters) {
        if (filters.animal_type) {
          animals = animals.filter((item: any) => item.animal_type === filters.animal_type);
        }
        if (filters.location) {
          animals = animals.filter((item: any) => item.location === filters.location);
        }
        if (filters.minPrice) {
          animals = animals.filter((item: any) => item.price >= filters.minPrice);
        }
        if (filters.maxPrice) {
          animals = animals.filter((item: any) => item.price <= filters.maxPrice);
        }
        if (filters.purpose) {
          animals = animals.filter((item: any) => item.purpose === filters.purpose);
        }
        if (filters.gender) {
          animals = animals.filter((item: any) => item.gender === filters.gender);
        }
      }
      
      return animals;
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  const addAnimal = useCallback(async (animalData: any) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.writeCount.count++;
        
        const timestamps = {
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const docRef = await addDoc(collection(firestore, 'animal_listings'), {
          ...animalData,
          ...timestamps
        });
        
        const newAnimal = { id: docRef.id, ...animalData, ...timestamps };
        localStorageManager.addAnimal(newAnimal);
        
        return newAnimal;
      } else {
        // Use localStorage fallback
        const id = `local_${Date.now()}`;
        const timestamps = {
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        const newAnimal = { id, ...animalData, ...timestamps };
        localStorageManager.addAnimal(newAnimal);
        return newAnimal;
      }
    } catch (error) {
      console.error('Error adding animal:', error);
      // Fallback to localStorage
      const id = `local_${Date.now()}`;
      const timestamps = {
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      const newAnimal = { id, ...animalData, ...timestamps };
      localStorageManager.addAnimal(newAnimal);
      return newAnimal;
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  const updateAnimal = useCallback(async (id: string, updates: any) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.writeCount.count++;
        
        const docRef = doc(firestore, 'animal_listings', id);
        await updateDoc(docRef, {
          ...updates,
          updated_at: new Date().toISOString()
        });
        
        localStorageManager.updateAnimal(id, updates);
        return { success: true };
      } else {
        localStorageManager.updateAnimal(id, updates);
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating animal:', error);
      localStorageManager.updateAnimal(id, updates);
      return { success: true };
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  const deleteAnimal = useCallback(async (id: string) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.writeCount.count++;
        
        await deleteDoc(doc(firestore, 'animal_listings', id));
        localStorageManager.deleteAnimal(id);
        
        return { success: true };
      } else {
        localStorageManager.deleteAnimal(id);
        return { success: true };
      }
    } catch (error) {
      console.error('Error deleting animal:', error);
      localStorageManager.deleteAnimal(id);
      return { success: true };
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  // Land operations
  const getLand = useCallback(async (filters?: any) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.readCount.count++;
        
        let land: any[] = [];
        
        try {
          let q = query(collection(firestore, 'land_listings'), orderBy('created_at', 'desc'), limit(50));
          const snapshot = await getDocs(q);
          land = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (orderError) {
          const snapshot = await getDocs(collection(firestore, 'land_listings'));
          land = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          land.sort((a: any, b: any) => {
            if (a.created_at && b.created_at) {
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
            return b.id.localeCompare(a.id);
          });
        }
        
        // Apply filters client-side to avoid composite index requirements
        if (filters) {
          if (filters.listing_type) {
            land = land.filter((item: any) => item.listing_type === filters.listing_type);
          }
          if (filters.location) {
            land = land.filter((item: any) => item.location === filters.location);
          }
          if (filters.minPrice) {
            land = land.filter((item: any) => item.price >= filters.minPrice);
          }
          if (filters.maxPrice) {
            land = land.filter((item: any) => item.price <= filters.maxPrice);
          }
          if (filters.minArea) {
            land = land.filter((item: any) => item.area_size >= filters.minArea);
          }
          if (filters.maxArea) {
            land = land.filter((item: any) => item.area_size <= filters.maxArea);
          }
        }
        
        // Cache in localStorage for offline use
        land.forEach((item: any) => localStorageManager.addLand(item));
        
        return land;
      } else {
        // Use localStorage fallback
        console.log('Using localStorage fallback for land');
        let land = localStorageManager.getLand();
        
        // Apply filters to localStorage data as well
        if (filters) {
          if (filters.listing_type) {
            land = land.filter((item: any) => item.listing_type === filters.listing_type);
          }
          if (filters.location) {
            land = land.filter((item: any) => item.location === filters.location);
          }
          if (filters.minPrice) {
            land = land.filter((item: any) => item.price >= filters.minPrice);
          }
          if (filters.maxPrice) {
            land = land.filter((item: any) => item.price <= filters.maxPrice);
          }
          if (filters.minArea) {
            land = land.filter((item: any) => item.area_size >= filters.minArea);
          }
          if (filters.maxArea) {
            land = land.filter((item: any) => item.area_size <= filters.maxArea);
          }
        }
        
        return land;
      }
    } catch (error) {
      console.error('Error fetching land:', error);
      let land = localStorageManager.getLand();
      if (filters) {
        if (filters.listing_type) {
          land = land.filter((item: any) => item.listing_type === filters.listing_type);
        }
        if (filters.location) {
          land = land.filter((item: any) => item.location === filters.location);
        }
        if (filters.minPrice) {
          land = land.filter((item: any) => item.price >= filters.minPrice);
        }
        if (filters.maxPrice) {
          land = land.filter((item: any) => item.price <= filters.maxPrice);
        }
        if (filters.minArea) {
          land = land.filter((item: any) => item.area_size >= filters.minArea);
        }
        if (filters.maxArea) {
          land = land.filter((item: any) => item.area_size <= filters.maxArea);
        }
      }
      return land;
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  const addLand = useCallback(async (landData: any) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.writeCount.count++;
        
        const timestamps = {
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const docRef = await addDoc(collection(firestore, 'land_listings'), {
          ...landData,
          ...timestamps
        });
        
        const newLand = { id: docRef.id, ...landData, ...timestamps };
        localStorageManager.addLand(newLand);
        
        return newLand;
      } else {
        const id = `local_${Date.now()}`;
        const timestamps = {
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        const newLand = { id, ...landData, ...timestamps };
        localStorageManager.addLand(newLand);
        
        return newLand;
      }
    } catch (error) {
      console.error('Error adding land:', error);
      const id = `local_${Date.now()}`;
      const timestamps = {
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      const newLand = { id, ...landData, ...timestamps };
      localStorageManager.addLand(newLand);
      
      return newLand;
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  const updateLand = useCallback(async (id: string, updates: any) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.writeCount.count++;
        
        const docRef = doc(firestore, 'land_listings', id);
        await updateDoc(docRef, {
          ...updates,
          updated_at: new Date().toISOString()
        });
        
        localStorageManager.updateLand(id, updates);
        
        return { success: true };
      } else {
        localStorageManager.updateLand(id, updates);
        
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating land:', error);
      localStorageManager.updateLand(id, updates);
      
      return { success: true };
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  const deleteLand = useCallback(async (id: string) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.writeCount.count++;
        
        const docRef = doc(firestore, 'land_listings', id);
        await deleteDoc(docRef);
        
        localStorageManager.deleteLand(id);
        
        return { success: true };
      } else {
        localStorageManager.deleteLand(id);
        
        return { success: true };
      }
    } catch (error) {
      console.error('Error deleting land:', error);
      localStorageManager.deleteLand(id);
      
      return { success: true };
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  // Profile operations
  const getProfile = useCallback(async (userId: string) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.readCount.count++;
        
        const docRef = doc(firestore, 'profiles', userId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const profile = { id: docSnap.id, ...docSnap.data() };
          localStorageManager.updateProfile(userId, profile);
          return profile;
        }
        return null;
      } else {
        return localStorageManager.getProfile(userId);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      return localStorageManager.getProfile(userId);
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  const updateProfile = useCallback(async (userId: string, updates: any) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.writeCount.count++;
        
        const docRef = doc(firestore, 'profiles', userId);
        await updateDoc(docRef, {
          ...updates,
          updatedAt: new Date().toISOString()
        });
        
        localStorageManager.updateProfile(userId, updates);
        return { success: true };
      } else {
        localStorageManager.updateProfile(userId, updates);
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      localStorageManager.updateProfile(userId, updates);
      return { success: true };
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  // File upload with size optimization
  const uploadFile = useCallback(async (file: File, path: string) => {
    try {
      // Check file size (5MB limit for free plan)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size too large. Maximum 5MB allowed.');
      }

      if (isOnline) {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
      } else {
        // Convert to base64 for offline storage
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }, [isOnline]);

  // Search functionality
  const searchEquipment = useCallback(async (searchQuery: string) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.readCount.count++;
        
        const q = query(
          collection(firestore, 'equipment'),
          where('title', '>=', searchQuery),
          where('title', '<=', searchQuery + '\uf8ff'),
          limit(20)
        );
        
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } else {
        return localStorageManager.searchEquipment(searchQuery);
      }
    } catch (error) {
      console.error('Error searching equipment:', error);
      return localStorageManager.searchEquipment(searchQuery);
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  // Categories
  const getCategories = useCallback(async () => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.readCount.count++;
        
        const snapshot = await getDocs(collection(firestore, 'categories'));
        const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Cache categories
        categories.forEach(cat => {
          const existing = localStorageManager.getCategories().find(c => c.id === cat.id);
          if (!existing) {
            localStorageManager.getCategories().push(cat);
          }
        });
        
        return categories;
      } else {
        return localStorageManager.getCategories();
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      return localStorageManager.getCategories();
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  // Messages (simplified for free plan)
  const getMessages = useCallback(async (userId: string) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.readCount.count++;
        
        const q = query(
          collection(firestore, 'equipment'),
          where('senderId', '==', userId),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
        
        const snapshot = await getDocs(q);
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Cache messages
        messages.forEach(msg => localStorageManager.addMessage(msg));
        
        return messages;
      } else {
        return localStorageManager.getMessages(userId);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      return localStorageManager.getMessages(userId);
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  const sendMessage = useCallback(async (messageData: any) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.writeCount.count++;
        
        const docRef = await addDoc(collection(firestore, 'messages'), {
          ...messageData,
          createdAt: new Date().toISOString()
        });
        
        const message = { id: docRef.id, ...messageData };
        localStorageManager.addMessage(message);
        
        return message;
      } else {
        const id = `local_${Date.now()}`;
        const message = { id, ...messageData };
        localStorageManager.addMessage(message);
        return message;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const id = `local_${Date.now()}`;
      const message = { id, ...messageData };
      localStorageManager.addMessage(message);
      return message;
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  // Favorites
  const getFavorites = useCallback(async (userId: string) => {
    return localStorageManager.getFavorites(userId);
  }, []);

  const addFavorite = useCallback(async (userId: string, itemId: string, itemType: string) => {
    localStorageManager.addFavorite(userId, itemId, itemType);
    return { success: true };
  }, []);

  const removeFavorite = useCallback(async (userId: string, itemId: string) => {
    localStorageManager.removeFavorite(userId, itemId);
    return { success: true };
  }, []);

  // Statistics
  const getStats = useCallback(async () => {
    try {
      const equipment = localStorageManager.getEquipment();
      const profiles = localStorageManager.getCategories();
      
      return {
        totalEquipment: equipment.length,
        totalUsers: profiles.length,
        totalCategories: localStorageManager.getCategories().length,
        onlineStatus: isOnline,
        withinLimits: isWithinLimits,
        readCount: optimizedFirestore.readCount.count,
        writeCount: optimizedFirestore.writeCount.count,
        limits: FREE_PLAN_LIMITS
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        totalEquipment: 0,
        totalUsers: 0,
        totalCategories: 0,
        onlineStatus: isOnline,
        withinLimits: isWithinLimits,
        readCount: 0,
        writeCount: 0,
        limits: FREE_PLAN_LIMITS
      };
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  // Nurseries operations
  const getNurseries = useCallback(async (filters?: any) => {
    try {
      // Check if we can use Firebase
      const canUseFirebase = isOnline && isWithinLimits && checkLimits() && firestore;
      
      if (canUseFirebase) {
        optimizedFirestore.readCount.count++;
        
        // Simple query without complex filters to avoid index requirements
        let q = query(collection(firestore, 'nurseries'), orderBy('createdAt', 'desc'), limit(50));
        const snapshot = await getDocs(q);
        let nurseries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Apply filters client-side to avoid composite index requirements
        if (filters) {
          if (filters.plant_type) {
            nurseries = nurseries.filter((item: any) => item.plant_type === filters.plant_type);
          }
          if (filters.location) {
            nurseries = nurseries.filter((item: any) => item.location === filters.location);
          }
          if (filters.minPrice) {
            nurseries = nurseries.filter((item: any) => item.price >= filters.minPrice);
          }
          if (filters.maxPrice) {
            nurseries = nurseries.filter((item: any) => item.price <= filters.maxPrice);
          }
          if (filters.size) {
            nurseries = nurseries.filter((item: any) => item.size === filters.size);
          }
          if (filters.seasonality) {
            nurseries = nurseries.filter((item: any) => item.seasonality === filters.seasonality);
          }
        }
        
        // Cache in localStorage for offline use
        nurseries.forEach(item => localStorageManager.addNursery(item));
        
        return nurseries;
      } else {
        // Use localStorage fallback
        console.log('Using localStorage fallback for nurseries');
        let nurseries = localStorageManager.getNurseries();
        
        // Apply filters to localStorage data as well
        if (filters) {
          if (filters.plant_type) {
            nurseries = nurseries.filter((item: any) => item.plant_type === filters.plant_type);
          }
          if (filters.location) {
            nurseries = nurseries.filter((item: any) => item.location === filters.location);
          }
          if (filters.minPrice) {
            nurseries = nurseries.filter((item: any) => item.price >= filters.minPrice);
          }
          if (filters.maxPrice) {
            nurseries = nurseries.filter((item: any) => item.price <= filters.maxPrice);
          }
          if (filters.size) {
            nurseries = nurseries.filter((item: any) => item.size === filters.size);
          }
          if (filters.seasonality) {
            nurseries = nurseries.filter((item: any) => item.seasonality === filters.seasonality);
          }
        }
        
        return nurseries;
      }
    } catch (error) {
      console.error('Error fetching nurseries:', error);
      // Fallback to localStorage with filters
      let nurseries = localStorageManager.getNurseries();
      
      if (filters) {
        if (filters.plant_type) {
          nurseries = nurseries.filter((item: any) => item.plant_type === filters.plant_type);
        }
        if (filters.location) {
          nurseries = nurseries.filter((item: any) => item.location === filters.location);
        }
        if (filters.minPrice) {
          nurseries = nurseries.filter((item: any) => item.price >= filters.minPrice);
        }
        if (filters.maxPrice) {
          nurseries = nurseries.filter((item: any) => item.price <= filters.maxPrice);
        }
        if (filters.size) {
          nurseries = nurseries.filter((item: any) => item.size === filters.size);
        }
        if (filters.seasonality) {
          nurseries = nurseries.filter((item: any) => item.seasonality === filters.seasonality);
        }
      }
      
      return nurseries;
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  const addNursery = useCallback(async (nurseryData: any) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.writeCount.count++;
        
        const docRef = await addDoc(collection(firestore, 'nurseries'), {
          ...nurseryData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        const newNursery = { id: docRef.id, ...nurseryData };
        localStorageManager.addNursery(newNursery);
        
        return { id: docRef.id, ...newNursery };
      } else {
        // Use localStorage fallback
        const id = `local_${Date.now()}`;
        const newNursery = { id, ...nurseryData };
        localStorageManager.addNursery(newNursery);
        return newNursery;
      }
    } catch (error) {
      console.error('Error adding nursery:', error);
      // Fallback to localStorage
      const id = `local_${Date.now()}`;
      const newNursery = { id, ...nurseryData };
      localStorageManager.addNursery(newNursery);
      return newNursery;
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  const updateNursery = useCallback(async (id: string, updates: any) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.writeCount.count++;
        
        const docRef = doc(firestore, 'nurseries', id);
        await updateDoc(docRef, {
          ...updates,
          updatedAt: new Date().toISOString()
        });
        
        localStorageManager.updateNursery(id, updates);
        return { success: true };
      } else {
        localStorageManager.updateNursery(id, updates);
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating nursery:', error);
      localStorageManager.updateNursery(id, updates);
      return { success: true };
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  const deleteNursery = useCallback(async (id: string) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.writeCount.count++;
        
        const docRef = doc(firestore, 'nurseries', id);
        await deleteDoc(docRef);
        
        localStorageManager.deleteNursery(id);
        return { success: true };
      } else {
        localStorageManager.deleteNursery(id);
        return { success: true };
      }
    } catch (error) {
      console.error('Error deleting nursery:', error);
      localStorageManager.deleteNursery(id);
      return { success: true };
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  // Labor operations
  const getLabor = useCallback(async (filters?: any) => {
    try {
      // Check if we can use Firebase
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.readCount.count++;
        
        // Simple query without complex filters to avoid index requirements
        let q = query(collection(firestore, 'labor'), orderBy('createdAt', 'desc'), limit(50));
        const snapshot = await getDocs(q);
        let labor = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Apply filters client-side to avoid composite index requirements
        if (filters) {
          if (filters.labor_type) {
            labor = labor.filter((item: any) => item.labor_type === filters.labor_type);
          }
          if (filters.location) {
            labor = labor.filter((item: any) => item.location === filters.location);
          }
          if (filters.minRate) {
            labor = labor.filter((item: any) => item.hourly_rate >= filters.minRate);
          }
          if (filters.maxRate) {
            labor = labor.filter((item: any) => item.hourly_rate <= filters.maxRate);
          }
          if (filters.availability) {
            labor = labor.filter((item: any) => item.availability === filters.availability);
          }
        }
        
        // Cache in localStorage for offline use
        labor.forEach(item => localStorageManager.addLabor(item));
        
        return labor;
      } else {
        // Use localStorage fallback
        console.log('Using localStorage fallback for labor');
        let labor = localStorageManager.getLabor();
        
        // Apply filters to localStorage data as well
        if (filters) {
          if (filters.labor_type) {
            labor = labor.filter((item: any) => item.labor_type === filters.labor_type);
          }
          if (filters.location) {
            labor = labor.filter((item: any) => item.location === filters.location);
          }
          if (filters.minRate) {
            labor = labor.filter((item: any) => item.hourly_rate >= filters.minRate);
          }
          if (filters.maxRate) {
            labor = labor.filter((item: any) => item.hourly_rate <= filters.maxRate);
          }
          if (filters.availability) {
            labor = labor.filter((item: any) => item.availability === filters.availability);
          }
        }
        
        return labor;
      }
    } catch (error) {
      console.error('Error fetching labor:', error);
      // Fallback to localStorage with filters
      let labor = localStorageManager.getLabor();
      
      if (filters) {
        if (filters.labor_type) {
          labor = labor.filter((item: any) => item.labor_type === filters.labor_type);
        }
        if (filters.location) {
          labor = labor.filter((item: any) => item.location === filters.location);
        }
        if (filters.minRate) {
          labor = labor.filter((item: any) => item.hourly_rate >= filters.minRate);
        }
        if (filters.maxRate) {
          labor = labor.filter((item: any) => item.hourly_rate <= filters.maxRate);
        }
        if (filters.availability) {
          labor = labor.filter((item: any) => item.availability === filters.availability);
        }
      }
      
      return labor;
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  const addLabor = useCallback(async (laborData: any) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.writeCount.count++;
        
        const docRef = await addDoc(collection(firestore, 'labor'), {
          ...laborData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        const newLabor = { id: docRef.id, ...laborData };
        localStorageManager.addLabor(newLabor);
        
        return { id: docRef.id, ...newLabor };
      } else {
        // Use localStorage fallback
        const id = `local_${Date.now()}`;
        const newLabor = { id, ...laborData };
        localStorageManager.addLabor(newLabor);
        return newLabor;
      }
    } catch (error) {
      console.error('Error adding labor:', error);
      // Fallback to localStorage
      const id = `local_${Date.now()}`;
      const newLabor = { id, ...laborData };
      localStorageManager.addLabor(newLabor);
      return newLabor;
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  const updateLabor = useCallback(async (id: string, updates: any) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.writeCount.count++;
        
        const docRef = doc(firestore, 'labor', id);
        await updateDoc(docRef, {
          ...updates,
          updatedAt: new Date().toISOString()
        });
        
        localStorageManager.updateLabor(id, updates);
        return { success: true };
      } else {
        localStorageManager.updateLabor(id, updates);
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating labor:', error);
      localStorageManager.updateLabor(id, updates);
      return { success: true };
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  const deleteLabor = useCallback(async (id: string) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.writeCount.count++;
        
        const docRef = doc(firestore, 'labor', id);
        await deleteDoc(docRef);
        
        localStorageManager.deleteLabor(id);
        return { success: true };
      } else {
        localStorageManager.deleteLabor(id);
        return { success: true };
      }
    } catch (error) {
      console.error('Error deleting labor:', error);
      localStorageManager.deleteLabor(id);
      return { success: true };
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  // Analysis operations
  const getAnalysis = useCallback(async (filters?: any) => {
    try {
      // Check if we can use Firebase
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.readCount.count++;
        
        // Simple query without complex filters to avoid index requirements
        let q = query(collection(firestore, 'analysis'), orderBy('createdAt', 'desc'), limit(50));
        const snapshot = await getDocs(q);
        let analysis = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Apply filters client-side to avoid composite index requirements
        if (filters) {
          if (filters.service_type) {
            analysis = analysis.filter((item: any) => item.service_type === filters.service_type);
          }
          if (filters.location) {
            analysis = analysis.filter((item: any) => item.location === filters.location);
          }
          if (filters.minPrice) {
            analysis = analysis.filter((item: any) => item.price >= filters.minPrice);
          }
          if (filters.maxPrice) {
            analysis = analysis.filter((item: any) => item.price <= filters.maxPrice);
          }
          if (filters.analysis_type) {
            analysis = analysis.filter((item: any) => item.analysis_type === filters.analysis_type);
          }
        }
        
        // Cache in localStorage for offline use
        analysis.forEach(item => localStorageManager.addAnalysis(item));
        
        return analysis;
      } else {
        // Use localStorage fallback
        console.log('Using localStorage fallback for analysis');
        let analysis = localStorageManager.getAnalysis();
        
        // Apply filters to localStorage data as well
        if (filters) {
          if (filters.service_type) {
            analysis = analysis.filter((item: any) => item.service_type === filters.service_type);
          }
          if (filters.location) {
            analysis = analysis.filter((item: any) => item.location === filters.location);
          }
          if (filters.minPrice) {
            analysis = analysis.filter((item: any) => item.price >= filters.minPrice);
          }
          if (filters.maxPrice) {
            analysis = analysis.filter((item: any) => item.price <= filters.maxPrice);
          }
          if (filters.analysis_type) {
            analysis = analysis.filter((item: any) => item.analysis_type === filters.analysis_type);
          }
        }
        
        return analysis;
      }
    } catch (error) {
      console.error('Error fetching analysis:', error);
      // Fallback to localStorage with filters
      let analysis = localStorageManager.getAnalysis();
      
      if (filters) {
        if (filters.service_type) {
          analysis = analysis.filter((item: any) => item.service_type === filters.service_type);
        }
        if (filters.location) {
          analysis = analysis.filter((item: any) => item.location === filters.location);
        }
        if (filters.minPrice) {
          analysis = analysis.filter((item: any) => item.price >= filters.minPrice);
        }
        if (filters.maxPrice) {
          analysis = analysis.filter((item: any) => item.price <= filters.maxPrice);
        }
        if (filters.analysis_type) {
          analysis = analysis.filter((item: any) => item.analysis_type === filters.analysis_type);
        }
      }
      
      return analysis;
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  const addAnalysis = useCallback(async (analysisData: any) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.writeCount.count++;
        
        const docRef = await addDoc(collection(firestore, 'analysis'), {
          ...analysisData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        const newAnalysis = { id: docRef.id, ...analysisData };
        localStorageManager.addAnalysis(newAnalysis);
        
        return { id: docRef.id, ...newAnalysis };
      } else {
        // Use localStorage fallback
        const id = `local_${Date.now()}`;
        const newAnalysis = { id, ...analysisData };
        localStorageManager.addAnalysis(newAnalysis);
        return newAnalysis;
      }
    } catch (error) {
      console.error('Error adding analysis:', error);
      // Fallback to localStorage
      const id = `local_${Date.now()}`;
      const newAnalysis = { id, ...analysisData };
      localStorageManager.addAnalysis(newAnalysis);
      return newAnalysis;
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  const updateAnalysis = useCallback(async (id: string, updates: any) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.writeCount.count++;
        
        const docRef = doc(firestore, 'analysis', id);
        await updateDoc(docRef, {
          ...updates,
          updatedAt: new Date().toISOString()
        });
        
        localStorageManager.updateAnalysis(id, updates);
        return { success: true };
      } else {
        localStorageManager.updateAnalysis(id, updates);
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating analysis:', error);
      localStorageManager.updateAnalysis(id, updates);
      return { success: true };
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  const deleteAnalysis = useCallback(async (id: string) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.writeCount.count++;
        
        const docRef = doc(firestore, 'analysis', id);
        await deleteDoc(docRef);
        
        localStorageManager.deleteAnalysis(id);
        return { success: true };
      } else {
        localStorageManager.deleteAnalysis(id);
        return { success: true };
      }
    } catch (error) {
      console.error('Error deleting analysis:', error);
      localStorageManager.deleteAnalysis(id);
      return { success: true };
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  // Delivery operations
  const getDelivery = useCallback(async (filters?: any) => {
    try {
      // Check if we can use Firebase
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.readCount.count++;
        
        // Simple query without complex filters to avoid index requirements
        let q = query(collection(firestore, 'delivery'), orderBy('createdAt', 'desc'), limit(50));
        const snapshot = await getDocs(q);
        let delivery = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Apply filters client-side to avoid composite index requirements
        if (filters) {
          if (filters.service_type) {
            delivery = delivery.filter((item: any) => item.service_type === filters.service_type);
          }
          if (filters.location) {
            delivery = delivery.filter((item: any) => item.location === filters.location);
          }
          if (filters.minPrice) {
            delivery = delivery.filter((item: any) => item.price_per_km >= filters.minPrice);
          }
          if (filters.maxPrice) {
            delivery = delivery.filter((item: any) => item.price_per_km <= filters.maxPrice);
          }
          if (filters.vehicle_type) {
            delivery = delivery.filter((item: any) => item.vehicle_type === filters.vehicle_type);
          }
        }
        
        // Cache in localStorage for offline use
        delivery.forEach(item => localStorageManager.addDelivery(item));
        
        return delivery;
      } else {
        // Use localStorage fallback
        console.log('Using localStorage fallback for delivery');
        let delivery = localStorageManager.getDelivery();
        
        // Apply filters to localStorage data as well
        if (filters) {
          if (filters.service_type) {
            delivery = delivery.filter((item: any) => item.service_type === filters.service_type);
          }
          if (filters.location) {
            delivery = delivery.filter((item: any) => item.location === filters.location);
          }
          if (filters.minPrice) {
            delivery = delivery.filter((item: any) => item.price_per_km >= filters.minPrice);
          }
          if (filters.maxPrice) {
            delivery = delivery.filter((item: any) => item.price_per_km <= filters.maxPrice);
          }
          if (filters.vehicle_type) {
            delivery = delivery.filter((item: any) => item.vehicle_type === filters.vehicle_type);
          }
        }
        
        return delivery;
      }
    } catch (error) {
      console.error('Error fetching delivery:', error);
      // Fallback to localStorage with filters
      let delivery = localStorageManager.getDelivery();
      
      if (filters) {
        if (filters.service_type) {
          delivery = delivery.filter((item: any) => item.service_type === filters.service_type);
        }
        if (filters.location) {
          delivery = delivery.filter((item: any) => item.location === filters.location);
        }
        if (filters.minPrice) {
          delivery = delivery.filter((item: any) => item.price_per_km >= filters.minPrice);
        }
        if (filters.maxPrice) {
          delivery = delivery.filter((item: any) => item.price_per_km <= filters.maxPrice);
        }
        if (filters.vehicle_type) {
          delivery = delivery.filter((item: any) => item.vehicle_type === filters.vehicle_type);
        }
      }
      
      return delivery;
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  const addDelivery = useCallback(async (deliveryData: any) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.writeCount.count++;
        
        const docRef = await addDoc(collection(firestore, 'delivery'), {
          ...deliveryData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        const newDelivery = { id: docRef.id, ...deliveryData };
        localStorageManager.addDelivery(newDelivery);
        
        return { id: docRef.id, ...newDelivery };
      } else {
        // Use localStorage fallback
        const id = `local_${Date.now()}`;
        const newDelivery = { id, ...deliveryData };
        localStorageManager.addDelivery(newDelivery);
        return newDelivery;
      }
    } catch (error) {
      console.error('Error adding delivery:', error);
      // Fallback to localStorage
      const id = `local_${Date.now()}`;
      const newDelivery = { id, ...deliveryData };
      localStorageManager.addDelivery(newDelivery);
      return newDelivery;
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  const updateDelivery = useCallback(async (id: string, updates: any) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.writeCount.count++;
        
        const docRef = doc(firestore, 'delivery', id);
        await updateDoc(docRef, {
          ...updates,
          updatedAt: new Date().toISOString()
        });
        
        localStorageManager.updateDelivery(id, updates);
        return { success: true };
      } else {
        localStorageManager.updateDelivery(id, updates);
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating delivery:', error);
      localStorageManager.updateDelivery(id, updates);
      return { success: true };
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  const deleteDelivery = useCallback(async (id: string) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.writeCount.count++;
        
        const docRef = doc(firestore, 'delivery', id);
        await deleteDoc(docRef);
        
        localStorageManager.deleteDelivery(id);
        return { success: true };
      } else {
        localStorageManager.deleteDelivery(id);
        return { success: true };
      }
    } catch (error) {
      console.error('Error deleting delivery:', error);
      localStorageManager.deleteDelivery(id);
      return { success: true };
    }
  }, []); // Remove dependencies to prevent continuous re-renders

  // Vegetables operations
  const getVegetables = useCallback(async (filters?: any) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.readCount.count++;
        
        let q = query(collection(firestore, 'vegetables'), orderBy('created_at', 'desc'), limit(50));
        const snapshot = await getDocs(q);
        let vegetables = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Apply filters client-side
        if (filters) {
          if (filters.vegetable_type) {
            vegetables = vegetables.filter((item: any) => item.vegetable_type === filters.vegetable_type);
          }
          if (filters.location) {
            vegetables = vegetables.filter((item: any) => item.location === filters.location);
          }
          if (filters.minPrice) {
            vegetables = vegetables.filter((item: any) => item.price >= filters.minPrice);
          }
          if (filters.maxPrice) {
            vegetables = vegetables.filter((item: any) => item.price <= filters.maxPrice);
          }
          if (filters.freshness) {
            vegetables = vegetables.filter((item: any) => item.freshness === filters.freshness);
          }
          if (filters.organic !== undefined) {
            vegetables = vegetables.filter((item: any) => item.organic === filters.organic);
          }
        }
        
        // Cache in localStorage
        vegetables.forEach(item => localStorageManager.addVegetable(item));
        
        return vegetables;
      } else {
        console.log('Using localStorage fallback for vegetables');
        let vegetables = localStorageManager.getVegetables();
        
        // Apply filters to localStorage data
        if (filters) {
          if (filters.vegetable_type) {
            vegetables = vegetables.filter((item: any) => item.vegetable_type === filters.vegetable_type);
          }
          if (filters.location) {
            vegetables = vegetables.filter((item: any) => item.location === filters.location);
          }
          if (filters.minPrice) {
            vegetables = vegetables.filter((item: any) => item.price >= filters.minPrice);
          }
          if (filters.maxPrice) {
            vegetables = vegetables.filter((item: any) => item.price <= filters.maxPrice);
          }
          if (filters.freshness) {
            vegetables = vegetables.filter((item: any) => item.freshness === filters.freshness);
          }
          if (filters.organic !== undefined) {
            vegetables = vegetables.filter((item: any) => item.organic === filters.organic);
          }
        }
        
        return vegetables;
      }
    } catch (error) {
      console.error('Error fetching vegetables:', error);
      return localStorageManager.getVegetables();
    }
  }, [isOnline, isWithinLimits, checkLimits, optimizedFirestore]);

  const addVegetable = useCallback(async (vegetableData: any) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.writeCount.count++;
        
        const docRef = await addDoc(collection(firestore, 'vegetables'), {
          ...vegetableData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        const newVegetable = { id: docRef.id, ...vegetableData };
        localStorageManager.addVegetable(newVegetable);
        
        return { success: true, id: docRef.id };
      } else {
        const newVegetable = { 
          id: `local_${Date.now()}`, 
          ...vegetableData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        localStorageManager.addVegetable(newVegetable);
        return { success: true, id: newVegetable.id };
      }
    } catch (error) {
      console.error('Error adding vegetable:', error);
      const newVegetable = { 
        id: `local_${Date.now()}`, 
        ...vegetableData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      localStorageManager.addVegetable(newVegetable);
      return { success: true, id: newVegetable.id };
    }
  }, [isOnline, isWithinLimits, checkLimits, optimizedFirestore]);

  const updateVegetable = useCallback(async (id: string, updates: any) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.writeCount.count++;
        
        const docRef = doc(firestore, 'vegetables', id);
        await updateDoc(docRef, {
          ...updates,
          updatedAt: new Date()
        });
        
        localStorageManager.updateVegetable(id, updates);
        return { success: true };
      } else {
        localStorageManager.updateVegetable(id, updates);
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating vegetable:', error);
      localStorageManager.updateVegetable(id, updates);
      return { success: true };
    }
  }, [isOnline, isWithinLimits, checkLimits, optimizedFirestore]);

  const deleteVegetable = useCallback(async (id: string) => {
    try {
      const canUseFirebase = isOnline && isWithinLimits && checkLimits();
      
      if (canUseFirebase) {
        optimizedFirestore.writeCount.count++;
        
        const docRef = doc(firestore, 'vegetables', id);
        await deleteDoc(docRef);
        
        localStorageManager.deleteVegetable(id);
        return { success: true };
      } else {
        localStorageManager.deleteVegetable(id);
        return { success: true };
      }
    } catch (error) {
      console.error('Error deleting vegetable:', error);
      localStorageManager.deleteVegetable(id);
      return { success: true };
    }
  }, [isOnline, isWithinLimits, checkLimits, optimizedFirestore]);

  return {
    // Equipment
    getEquipment,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    searchEquipment,
    
    // Animal
    getAnimals,
    addAnimal,
    updateAnimal,
    deleteAnimal,
    
    // Land
    getLand,
    addLand,
    updateLand,
    deleteLand,
    
    // Nurseries
    getNurseries,
    addNursery,
    updateNursery,
    deleteNursery,
    
    // Vegetables
    getVegetables,
    addVegetable,
    updateVegetable,
    deleteVegetable,
    
    // Labor
    getLabor,
    addLabor,
    updateLabor,
    deleteLabor,
    
    // Analysis
    getAnalysis,
    addAnalysis,
    updateAnalysis,
    deleteAnalysis,
    
    // Delivery
    getDelivery,
    addDelivery,
    updateDelivery,
    deleteDelivery,
    
    // Profiles
    getProfile,
    updateProfile,
    
    // Files
    uploadFile,
    
    // Categories
    getCategories,
    
    // Messages
    getMessages,
    sendMessage,
    
    // Favorites
    getFavorites,
    addFavorite,
    removeFavorite,
    
    // Stats
    getStats,
    
    // Status
    isOnline,
    isWithinLimits,
    checkLimits
  };
}; 