import watch1 from "@/assets/watch-1.jpg";
import watch2 from "@/assets/watch-2.jpg";
import watch3 from "@/assets/watch-3.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  isNew?: boolean;
  isLimited?: boolean;
  description: string;
  features: string[];
  colors: string[];
  straps: string[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "Royal Gold Heritage",
    price: 45000,
    originalPrice: 55000,
    image: watch1,
    rating: 4.8,
    reviews: 124,
    category: "Men's Luxury",
    isNew: true,
    description: "A masterpiece of traditional craftsmanship with modern precision. The Royal Gold Heritage features a sophisticated black dial with gold accents.",
    features: [
      "Swiss Automatic Movement",
      "Sapphire Crystal Glass",
      "Water Resistant 100m",
      "Gold-Plated Case",
      "Premium Leather Strap"
    ],
    colors: ["Black", "Gold"],
    straps: ["Leather", "Metal"]
  },
  {
    id: "2",
    name: "Elegance Blue Silver",
    price: 32000,
    originalPrice: 38000,
    image: watch2,
    rating: 4.6,
    reviews: 89,
    category: "Women's Elegant",
    isLimited: true,
    description: "Sophisticated elegance meets modern design. The Elegance Blue Silver captures the essence of contemporary femininity.",
    features: [
      "Quartz Movement",
      "Mineral Crystal",
      "Water Resistant 50m",
      "Stainless Steel Case",
      "Adjustable Bracelet"
    ],
    colors: ["Silver", "Blue"],
    straps: ["Metal", "Leather"]
  },
  {
    id: "3",
    name: "TechPro Smart Elite",
    price: 28000,
    image: watch3,
    rating: 4.7,
    reviews: 156,
    category: "Smart Watch",
    isNew: true,
    description: "The future of timekeeping. TechPro Smart Elite combines advanced technology with premium design for the modern professional.",
    features: [
      "AMOLED Display",
      "GPS Tracking",
      "Heart Rate Monitor",
      "7-Day Battery Life",
      "Water Resistant IP68"
    ],
    colors: ["Black", "Silver"],
    straps: ["Silicone", "Metal", "Leather"]
  },
  {
    id: "4",
    name: "Classic Heritage Gold",
    price: 65000,
    originalPrice: 75000,
    image: watch1,
    rating: 4.9,
    reviews: 78,
    category: "Limited Edition",
    isLimited: true,
    description: "A timeless piece that represents the pinnacle of watchmaking artistry. Limited to only 100 pieces worldwide.",
    features: [
      "Hand-Assembled Movement",
      "18K Gold Case",
      "Crocodile Leather Strap",
      "Numbered Edition",
      "Lifetime Warranty"
    ],
    colors: ["Gold"],
    straps: ["Leather"]
  },
  {
    id: "5",
    name: "Couple's Harmony Set",
    price: 55000,
    originalPrice: 65000,
    image: watch2,
    rating: 4.8,
    reviews: 92,
    category: "Couple Watches",
    description: "Perfect harmony in design and precision. This couple's set represents unity in style and elegance.",
    features: [
      "Matching Design",
      "Swiss Movement",
      "Scratch Resistant",
      "Elegant Gift Box",
      "2-Year Warranty"
    ],
    colors: ["Silver", "Rose Gold"],
    straps: ["Metal", "Leather"]
  },
  {
    id: "6",
    name: "Sport Pro Carbon",
    price: 35000,
    image: watch3,
    rating: 4.5,
    reviews: 134,
    category: "Sports",
    isNew: true,
    description: "Built for athletes and adventure seekers. The Sport Pro Carbon delivers uncompromising performance in extreme conditions.",
    features: [
      "Carbon Fiber Case",
      "Shock Resistant",
      "200m Water Resistant",
      "Luminous Hands",
      "Titanium Bracelet"
    ],
    colors: ["Black", "Carbon"],
    straps: ["Metal", "Silicone"]
  }
];

export const categories = [
  "All",
  "Men's Luxury",
  "Women's Elegant", 
  "Smart Watch",
  "Limited Edition",
  "Couple Watches",
  "Sports"
];

export const priceRanges = [
  { label: "Under ₹30,000", min: 0, max: 30000 },
  { label: "₹30,000 - ₹50,000", min: 30000, max: 50000 },
  { label: "₹50,000 - ₹70,000", min: 50000, max: 70000 },
  { label: "Above ₹70,000", min: 70000, max: Infinity }
];

export const brands = [
  "LuxeTimes",
  "Heritage Gold", 
  "TechPro",
  "Elegance",
  "Sport Pro"
];

export const colors = [
  "Black",
  "Gold", 
  "Silver",
  "Blue",
  "Rose Gold",
  "Carbon"
];

export const strapTypes = [
  "Leather",
  "Metal",
  "Silicone"
];