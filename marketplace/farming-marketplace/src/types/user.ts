export interface User {
  id: string;
  username: string;
  email: string;
  profilePictureUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FarmerProfile extends User {
  farmName: string;
  location: string;
  bio?: string;
  equipmentOwned?: string[];
  landOwned?: string[];
}

export interface BuyerProfile extends User {
  preferredEquipmentTypes?: string[];
  preferredLandSize?: number;
}