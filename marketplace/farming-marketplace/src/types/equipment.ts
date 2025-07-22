export interface Equipment {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    location: string;
    condition: 'new' | 'used';
    images: string[];
    createdAt: Date;
    updatedAt: Date;
    sellerId: string;
}
