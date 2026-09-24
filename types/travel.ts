export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface DiningSpot {
  id: string;
  name: string;
  type: string;
  location: string;
  avgCostForTwo: number;
  rating: number;
  image: string;
  setting: string;
  cuisine: string;
  description: string;
  specialty: string;
  reviews: Review[];
}

export interface Accommodation {
  id: string;
  name: string;
  type: string;
  location: string;
  pricePerNight: number;
  rating: number;
  image: string;
  architecture: string;
  description: string;
  perks: string[];
  reviews: Review[];
}

export interface ItineraryItem {
  id: string;
  title: string;
  location: string;
  host: string;
  hostImage: string;
  pricePerPerson: number;
  duration: string;
  spotsTotal: number;
  spotsTaken: number;
  rating: number;
  reviewCount: number;
  image: string;
  tag: string;
  seasonName: string;
  geographyNote: string;
  overview: string;
  included: string[];
  schedule: { time: string; activity: string }[];
  reviews: Review[];
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  destination: string;
  homeCity: string;
  dates: string;
  budgetTier: "Budget" | "Moderate" | "Luxury";
  role: "Traveler" | "Local Insider";
  promptTitle: string;
  promptAnswer: string;
  bio: string;
  image: string;
  tags: string[];
  matchRate: number;
  isOnline: boolean;
  phone?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}