import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebaseConfig';
import { MarketplaceProduct } from '@/types/firebase';

// Sample marketplace products for the Algerian agricultural marketplace
const sampleProducts: Omit<MarketplaceProduct, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: "طماطم طازجة",
    category: "vegetables",
    price: 150,
    unit: "كغ",
    location: "تيارت",
    rating: 4.8,
    reviews: 127,
    image: "🍅",
    isFresh: true,
    isOrganic: false,
    isExport: false,
    stock: 375,
    maxStock: 500,
    description: "من مزارع تيارت - جودة عالية",
    features: ["طازج", "شهادة جودة", "توصيل مجاني"],
    farmerId: "farmer1",
    farmerName: "أحمد بن محمد",
    farmerContact: "+213 555 123 456",
    isActive: true
  },
  {
    name: "قمح قاسي",
    category: "grains",
    price: 4500,
    unit: "قنطار",
    location: "سطيف",
    rating: 4.5,
    reviews: 89,
    image: "🌾",
    isFresh: false,
    isOrganic: true,
    isExport: true,
    stock: 45,
    maxStock: 50,
    description: "من سطيف - محصول 2024",
    features: ["للتصدير", "عضوي", "جودة عالية"],
    farmerId: "farmer2",
    farmerName: "فاطمة بوعلام",
    farmerContact: "+213 555 234 567",
    isActive: true
  },
  {
    name: "جزر عضوي",
    category: "vegetables",
    price: 80,
    unit: "كغ",
    location: "مستغانم",
    rating: 4.2,
    reviews: 156,
    image: "🥕",
    isFresh: true,
    isOrganic: true,
    isExport: false,
    stock: 95,
    maxStock: 100,
    description: "من مستغانم - زراعة عضوية",
    features: ["عضوي", "خصم 15%", "حصاد اليوم"],
    farmerId: "farmer3",
    farmerName: "محمد السعيد",
    farmerContact: "+213 555 345 678",
    isActive: true
  },
  {
    name: "زيتون مخلل",
    category: "processed",
    price: 1200,
    unit: "كغ",
    location: "قسنطينة",
    rating: 4.7,
    reviews: 203,
    image: "🫒",
    isFresh: false,
    isOrganic: false,
    isExport: true,
    stock: 200,
    maxStock: 250,
    description: "من قسنطينة - مخلل طبيعي",
    features: ["للتصدير", "طبيعي", "جودة عالية"],
    farmerId: "farmer4",
    farmerName: "عائشة محمودي",
    farmerContact: "+213 555 456 789",
    isActive: true
  },
  {
    name: "بطاطس حمراء",
    category: "vegetables",
    price: 90,
    unit: "كغ",
    location: "البليدة",
    rating: 4.3,
    reviews: 98,
    image: "🥔",
    isFresh: true,
    isOrganic: false,
    isExport: false,
    stock: 600,
    maxStock: 800,
    description: "من البليدة - طازجة",
    features: ["طازج", "جودة عالية", "توصيل سريع"],
    farmerId: "farmer5",
    farmerName: "يوسف بن علي",
    farmerContact: "+213 555 567 890",
    isActive: true
  },
  {
    name: "تمر دقلة نور",
    category: "fruits",
    price: 800,
    unit: "كغ",
    location: "بسكرة",
    rating: 4.9,
    reviews: 312,
    image: "🌴",
    isFresh: false,
    isOrganic: true,
    isExport: true,
    stock: 150,
    maxStock: 200,
    description: "من بسكرة - تمر ممتاز",
    features: ["للتصدير", "عضوي", "جودة ممتازة"],
    farmerId: "farmer6",
    farmerName: "خديجة العربي",
    farmerContact: "+213 555 678 901",
    isActive: true
  },
  {
    name: "زيت الزيتون البكر",
    category: "processed",
    price: 2000,
    unit: "لتر",
    location: "تيزي وزو",
    rating: 4.6,
    reviews: 87,
    image: "🫒",
    isFresh: false,
    isOrganic: true,
    isExport: true,
    stock: 120,
    maxStock: 150,
    description: "من تيزي وزو - عصر بارد",
    features: ["للتصدير", "عضوي", "عصر بارد"],
    farmerId: "farmer7",
    farmerName: "عمر أيت أحمد",
    farmerContact: "+213 555 789 012",
    isActive: true
  },
  {
    name: "خرشوف طازج",
    category: "vegetables",
    price: 200,
    unit: "كغ",
    location: "عين الدفلى",
    rating: 4.4,
    reviews: 65,
    image: "🥬",
    isFresh: true,
    isOrganic: false,
    isExport: false,
    stock: 80,
    maxStock: 100,
    description: "من عين الدفلى - طازج اليوم",
    features: ["طازج", "موسمي", "جودة عالية"],
    farmerId: "farmer8",
    farmerName: "نادية بن سعيد",
    farmerContact: "+213 555 890 123",
    isActive: true
  }
];

export async function addSampleProductsToFirestore() {
  try {
    console.log('Adding sample products to Firestore...');
    
    for (const product of sampleProducts) {
      await addDoc(collection(firestore, 'products'), {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    console.log('Sample products added successfully!');
    return true;
  } catch (error) {
    console.error('Error adding sample products:', error);
    return false;
  }
}

export default sampleProducts;
