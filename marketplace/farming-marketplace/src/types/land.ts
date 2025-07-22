export interface Land {
    id: string;
    title: string;
    description: string;
    size: number; // in acres
    price: number; // in currency units
    location: string;
    ownerId: string; // reference to the user who owns the land
    createdAt: Date;
    updatedAt: Date;
}
