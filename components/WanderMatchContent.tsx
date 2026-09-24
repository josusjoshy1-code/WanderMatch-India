"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AgoraRTC, { IAgoraRTCClient, IMicrophoneAudioTrack, ICameraVideoTrack } from "agora-rtc-sdk-ng";
import { supabase } from "@/lib/supabase";
import {
  Compass,
  Heart,
  X,
  MapPin,
  Calendar,
  MessageCircle,
  User,
  ShieldCheck,
  Send,
  ArrowLeft,
  Phone,
  Video,
  Flame,
  Star,
  Clock,
  Check,
  UtensilsCrossed,
  Bed,
  ChevronDown,
  PlusCircle,
  PhoneOff,
  Mic,
  MicOff,
  VideoOff,
  Camera,
  Sparkles,
  LogOut
} from "lucide-react";
import confetti from "canvas-confetti";

interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

interface DiningSpot {
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

interface Accommodation {
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

interface ItineraryItem {
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

interface StoryItem {
  id: string;
  locationName: string;
  image: string;
  caption: string;
  timeAgo: string;
}

interface Traveler {
  id: string;
  name: string;
  age: number;
  destination: string;
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
  phone: string;
  story: StoryItem;
}

interface StateDataset {
  state: string;
  city: string;
  terrain: string;
  travelers: Traveler[];
  itineraries: ItineraryItem[];
  stays: Accommodation[];
  dining: DiningSpot[];
}

const ALL_28_NAMES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const HD_PORTRAITS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=85",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=85",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=85",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=85",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=85",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop&q=85"
];

const STORY_LANDMARKS = [
  "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&auto=format&fit=crop&q=85",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=85",
  "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=900&auto=format&fit=crop&q=85",
  "https://images.unsplash.com/photo-1548013146-72479768bada?w=900&auto=format&fit=crop&q=85",
  "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=900&auto=format&fit=crop&q=85",
  "https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?w=900&auto=format&fit=crop&q=85"
];

function generateSixTravelers(stateName: string): Traveler[] {
  return [
    {
      id: `${stateName}_p1`,
      name: "Ananya Sharma",
      age: 23,
      destination: stateName,
      dates: "15 Oct – 22 Oct",
      budgetTier: "Moderate",
      role: "Traveler",
      promptTitle: `My ideal day in ${stateName}`,
      promptAnswer: "Renting an olive Vespa, exploring coastal and mountain trails, and catching sunset acoustic jams.",
      bio: "Product designer on workation. Looking to split cabs, coffee stops, and photography expeditions.",
      image: HD_PORTRAITS[0],
      tags: ["Photography", "Cafes", "Road Trips", "Sunsets"],
      matchRate: 98,
      isOnline: true,
      phone: "+91 98201 11223",
      story: { id: `stry_${stateName}_1`, locationName: `${stateName} Vista`, image: STORY_LANDMARKS[0], caption: `Golden hour perched right on the scenic spots of ${stateName}! 🌅`, timeAgo: "2h ago" }
    },
    {
      id: `${stateName}_p2`,
      name: "Kabir Sengupta",
      age: 26,
      destination: stateName,
      dates: "Local Resident",
      budgetTier: "Budget",
      role: "Local Insider",
      promptTitle: "I can show you around",
      promptAnswer: "Hidden river viewpoints, 80-year-old street kitchens, and trails not on Google Maps.",
      bio: "Born and raised here. Documenting heritage architecture, local folklore, and indie food stalls.",
      image: HD_PORTRAITS[1],
      tags: ["Local Food", "Heritage", "Trekking", "Storytelling"],
      matchRate: 95,
      isOnline: true,
      phone: "+91 98202 33445",
      story: { id: `stry_${stateName}_2`, locationName: `${stateName} Ridge`, image: STORY_LANDMARKS[1], caption: `Morning mist finally clearing over the high ridge. Zero tourists here right now 🏔️☕`, timeAgo: "3h ago" }
    },
    {
      id: `${stateName}_p3`,
      name: "Rhea Mukherjee",
      age: 24,
      destination: stateName,
      dates: "20 Nov – 28 Nov",
      budgetTier: "Moderate",
      role: "Traveler",
      promptTitle: "My travel non-negotiable",
      promptAnswer: "Early morning specialty pour-overs, zero rushed tourist buses, and local homestays with libraries.",
      bio: "Architectural researcher & bookworm. Looking for a quiet companion for scenic drives and hikes.",
      image: HD_PORTRAITS[2],
      tags: ["Architecture", "Specialty Coffee", "Quiet Trails"],
      matchRate: 92,
      isOnline: false,
      phone: "+91 98203 55667",
      story: { id: `stry_${stateName}_3`, locationName: `${stateName} Courtyard`, image: STORY_LANDMARKS[2], caption: `Walking through historic courtyards. Breathtaking architecture ✨`, timeAgo: "5h ago" }
    },
    {
      id: `${stateName}_p4`,
      name: "Aditya Verma",
      age: 27,
      destination: stateName,
      dates: "02 Dec – 10 Dec",
      budgetTier: "Luxury",
      role: "Traveler",
      promptTitle: "Best way to explore",
      promptAnswer: "Renting a 4x4, camping by rock pools under clear stars, and eating fresh regional thalis.",
      bio: "Tech entrepreneur traveling between cities. Up for renting SUVs and splitting luxury eco villas.",
      image: HD_PORTRAITS[3],
      tags: ["Offroading", "Stargazing", "Luxury Stays"],
      matchRate: 94,
      isOnline: true,
      phone: "+91 98204 77889",
      story: { id: `stry_${stateName}_4`, locationName: `${stateName} Alpine Pass`, image: STORY_LANDMARKS[3], caption: `Deep into the high valley with the 4x4. Pristine wilderness ❄️🔥`, timeAgo: "6h ago" }
    },
    {
      id: `${stateName}_p5`,
      name: "Tanvi Deshmukh",
      age: 25,
      destination: stateName,
      dates: "Local Resident",
      budgetTier: "Moderate",
      role: "Local Insider",
      promptTitle: "My secret recommendation",
      promptAnswer: "Dawn ferry crossings to mangrove bird sanctuaries and family-run bakeries that open at 6 AM.",
      bio: "Yoga instructor & kayaker. Happy to guide mindful nature walks and sunset beach jams.",
      image: HD_PORTRAITS[4],
      tags: ["Yoga", "Kayaking", "Nature Sanctuaries"],
      matchRate: 96,
      isOnline: true,
      phone: "+91 98205 99001",
      story: { id: `stry_${stateName}_5`, locationName: `${stateName} Ancient Fort`, image: STORY_LANDMARKS[4], caption: `Explored the secret stone ramparts before anyone arrived 🏰`, timeAgo: "8h ago" }
    },
    {
      id: `${stateName}_p6`,
      name: "Rohan Kulkarni",
      age: 28,
      destination: stateName,
      dates: "12 Jan – 19 Jan",
      budgetTier: "Moderate",
      role: "Traveler",
      promptTitle: "You should travel with me because",
      promptAnswer: "I bring professional cameras, make great road-trip playlists, and always split bills right on time.",
      bio: "Cinematographer on a documentary project. Looking for travel buddies to split scouting trips.",
      image: HD_PORTRAITS[5],
      tags: ["Filmmaking", "Music", "Budget Sharing"],
      matchRate: 91,
      isOnline: false,
      phone: "+91 98206 12345",
      story: { id: `stry_${stateName}_6`, locationName: `${stateName} Waterfall`, image: STORY_LANDMARKS[5], caption: `Hiked through dense forest to find this natural limestone plunge pool 🌊`, timeAgo: "9h ago" }
    }
  ];
}

const STATE_RECORDS: Record<string, StateDataset> = {};

ALL_28_NAMES.forEach((stateName, sIdx) => {
  STATE_RECORDS[stateName] = {
    state: stateName,
    city: `${stateName} Regional Highlands & Historic Quarters`,
    terrain: "Scenic Ridges, River Gorges & Local Escarpments",
    travelers: generateSixTravelers(stateName),
    itineraries: [
      {
        id: `it_${sIdx}_1`,
        title: `${stateName} Heritage Sunrise Ridge & Ancient Fortress Walk`,
        location: `${stateName} High Ridge`,
        host: "Ananya Sharma",
        hostImage: HD_PORTRAITS[0],
        pricePerPerson: 1800,
        duration: "Full Day (6 Hours)",
        spotsTotal: 5,
        spotsTaken: 2,
        rating: 4.9,
        reviewCount: 31,
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900",
        tag: "Historic Vantage",
        seasonName: "Pleasant Season",
        geographyNote: `Ancient stone ramparts towering over the natural river basin of ${stateName}.`,
        overview: `An early expedition up winding panoramic ridges to explore centuries-old fortifications, followed by breakfast with local storytellers.`,
        included: ["Shared SUV transit split", "Traditional local breakfast", "Monument entry pass"],
        schedule: [
          { time: "06:30 AM", activity: "Sunrise ridge ascent and stone bastion photography." },
          { time: "11:30 AM", activity: "Traditional regional brunch at an ancestral kitchen." }
        ],
        reviews: [{ id: `rev_it_${sIdx}_1`, author: "Kunal S.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kunal", rating: 5, date: "1 week ago", comment: "Spectacular viewpoints and very safe, friendly group companion." }]
      },
      {
        id: `it_${sIdx}_2`,
        title: `Old Town Bazaars & Secret Culinary Crawl`,
        location: `${stateName} Walled District`,
        host: "Kabir Sengupta",
        hostImage: HD_PORTRAITS[1],
        pricePerPerson: 1200,
        duration: "Half Day (4 Hours)",
        spotsTotal: 6,
        spotsTaken: 3,
        rating: 5.0,
        reviewCount: 35,
        image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=900",
        tag: "Culinary Heritage",
        seasonName: "Pleasant Afternoon",
        geographyNote: "Narrow paved alleys lined with heritage artisan workshops.",
        overview: `Walk through old city quarters tasting 5 authentic generational recipes passed down across decades.`,
        included: ["All food tastings included", "Artisan workshop pass", "Local culinary insider"],
        schedule: [
          { time: "03:30 PM", activity: "Guided walk through handloom and copper artisan lanes." },
          { time: "06:00 PM", activity: "Multi-course street food tasting across legacy stalls." }
        ],
        reviews: [{ id: `rev_it_${sIdx}_2`, author: "Sunita G.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sunita", rating: 5, date: "4 days ago", comment: "The food stops were unbelievable. Best flavors I've tasted in the region." }]
      },
      {
        id: `it_${sIdx}_3`,
        title: `Secret Forest Waterfall & Natural Rock Pool Swim`,
        location: `${stateName} Foothills Reserve`,
        host: "Tanvi Deshmukh",
        hostImage: HD_PORTRAITS[4],
        pricePerPerson: 1600,
        duration: "5 Hours",
        spotsTotal: 4,
        spotsTaken: 1,
        rating: 4.8,
        reviewCount: 22,
        image: "https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?w=900",
        tag: "Wilderness Spring",
        seasonName: "Clear Water Flow",
        geographyNote: "Natural mineral freshwater streams carving through forest canyons.",
        overview: `A refreshing nature trek to secluded swimming pools away from commercial tour crowds.`,
        included: ["Forest reserve permit", "Trekking safety gear", "Fresh herbal refreshments"],
        schedule: [
          { time: "08:30 AM", activity: "Jungle trail hike through ancient tree canopies." },
          { time: "11:00 AM", activity: "Swimming and picnic lunch beside natural rock pools." }
        ],
        reviews: [{ id: `rev_it_${sIdx}_3`, author: "Devrat M.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Devrat", rating: 5, date: "2 weeks ago", comment: "Clean crystal water and complete peace in the middle of nature." }]
      },
      {
        id: `it_${sIdx}_4`,
        title: `Sunset Cliff Edge Panorama & Stargazing Campfire`,
        location: `${stateName} Escarpment`,
        host: "Aditya Verma",
        hostImage: HD_PORTRAITS[3],
        pricePerPerson: 1500,
        duration: "Evening (4 Hours)",
        spotsTotal: 8,
        spotsTaken: 4,
        rating: 4.9,
        reviewCount: 27,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900",
        tag: "Sunset Vantage",
        seasonName: "Clear Night Skies",
        geographyNote: "Elevated cliff edge offering unobstructed 360-degree horizon vistas.",
        overview: `Watch the sunset over distant valleys followed by an open-air fire pit session with acoustic tunes and stargazing.`,
        included: ["Campfire access", "Spiced hot beverage", "Acoustic instruments for jamming"],
        schedule: [
          { time: "05:00 PM", activity: "Sunset golden hour photography along the ridge edge." },
          { time: "07:00 PM", activity: "Campfire acoustics and stargazing under unpolluted skies." }
        ],
        reviews: [{ id: `rev_it_${sIdx}_4`, author: "Neha V.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha", rating: 5, date: "5 days ago", comment: "Magical atmosphere by the campfire. Met wonderful fellow travelers." }]
      }
    ],
    stays: [
      {
        id: `st_${sIdx}_1`,
        name: `${stateName} Heritage Courtyard Estate`,
        type: "Heritage Homestay",
        location: `Old Town Center, ${stateName}`,
        pricePerNight: 2900,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
        architecture: "Hand-Carved Stone Courtyard & Terracotta Roofs",
        description: `A heritage estate featuring traditional masonry, shaded courtyards, and organic home-cooked regional meals.`,
        perks: ["Ancestral Breakfast", "Courtyard Garden", "Fiber Optic WiFi"],
        reviews: [{ id: `rev_st_${sIdx}_1`, author: "Amit K.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit", rating: 5, date: "1 week ago", comment: "Warm hosts, beautiful traditional architecture, and authentic local food." }]
      },
      {
        id: `st_${sIdx}_2`,
        name: `${stateName} Backpacker Social Hostel`,
        type: "Designer Backpacker Hostel",
        location: `Arts District, ${stateName}`,
        pricePerNight: 850,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
        architecture: "Modern Industrial Timber & Terraces",
        description: `A lively social hub for remote workers and solo travelers with coworking desks, rooftop common cafes, and tour desks.`,
        perks: ["Rooftop Cafe", "Community Meetups", "High-Speed WiFi"],
        reviews: [{ id: `rev_st_${sIdx}_2`, author: "Siddharth J.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SiddharthJ", rating: 5, date: "3 days ago", comment: "Clean dorms, friendly common area, and easy to find day-trip companions." }]
      },
      {
        id: `st_${sIdx}_3`,
        name: `${stateName} Mountain Nature Retreat`,
        type: "Eco Sanctuary Stay",
        location: `Green Foothills, ${stateName}`,
        pricePerNight: 3800,
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        architecture: "Sustainable Timber & River Stone Construct",
        description: `Nestled in nature with panoramic mountain views, private wooden balconies, and farm-to-table organic dining.`,
        perks: ["Panoramic Valley View", "Organic Farm Kitchen", "Campfire Deck"],
        reviews: [{ id: `rev_st_${sIdx}_3`, author: "Ritu P.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ritu", rating: 5, date: "2 weeks ago", comment: "The morning view of the hills from the balcony is worth every penny." }]
      }
    ],
    dining: [
      {
        id: `dn_${sIdx}_1`,
        name: `${stateName} Panoramic Sunset Bistro`,
        type: "Sunset View Cafe",
        location: `Cliff Road, ${stateName}`,
        avgCostForTwo: 950,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
        setting: "Open Balcony with Horizon Sunset View",
        cuisine: "Artisan Pour-Overs, Sourdough Bakes & Regional Tapas",
        description: "An open balcony cafe offering specialty coffee, fresh bakes, and elevated sunset vistas.",
        specialty: "Handcrafted Pour-Over Coffee & Local Spiced Bruschetta",
        reviews: [{ id: `rev_dn_${sIdx}_1`, author: "Ankit M.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ankit", rating: 5, date: "4 days ago", comment: "Spectacular sunset view and exceptional freshly brewed coffee." }]
      },
      {
        id: `dn_${sIdx}_2`,
        name: `${stateName} Ancestral Thali House`,
        type: "Authentic Regional Dining",
        location: `Historic Bazaar, ${stateName}`,
        avgCostForTwo: 750,
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800",
        setting: "Traditional Courtyard Dining",
        cuisine: `Slow-Cooked Claypot Curries & Grand Traditional ${stateName} Thali`,
        description: "Serving ancestral recipes slow-cooked over woodfire on brass and copper dinnerware.",
        specialty: "Grand Royal 12-Dish State Thali with Desi Ghee",
        reviews: [{ id: `rev_dn_${sIdx}_2`, author: "Kavita S.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kavita", rating: 5, date: "1 week ago", comment: "Unmatched authentic taste. Everything is served piping hot with unlimited servings." }]
      },
      {
        id: `dn_${sIdx}_3`,
        name: `The Garden Tree Lounge`,
        type: "Garden Cafe & Bakery",
        location: `Heritage Lane, ${stateName}`,
        avgCostForTwo: 700,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800",
        setting: "Shaded Tree Garden with Low Wooden Seating",
        cuisine: "Fresh Pastries, Cold Brew Coffee & Wholesome Bowls",
        description: "A garden sanctuary with hammocks, book exchange corner, and wholesome all-day breakfast bowls.",
        specialty: "Cinnamon Glazed Pastries & Iced Cold Brew",
        reviews: [{ id: `rev_dn_${sIdx}_3`, author: "Varun D.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Varun", rating: 5, date: "2 weeks ago", comment: "Very calm atmosphere. Great place to spend an afternoon reading and enjoying coffee." }]
      }
    ]
  };
});

// LOGIN GATE COMPONENT
function LoginPage({ onLoginSuccess }: { onLoginSuccess: (user: any) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (isRegistering) {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { full_name: name }
        }
      });
      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
      } else {
        const userSession = {
          id: data.user?.id || "usr_" + Date.now(),
          name: name || email.split("@")[0],
          email,
          photo: HD_PORTRAITS[0],
          destination: "Goa"
        };
        localStorage.setItem("wandermatch_session", JSON.stringify(userSession));
        onLoginSuccess(userSession);
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
      } else {
        const metaName = data.user?.user_metadata?.full_name;
        const userSession = {
          id: data.user?.id || "usr_" + Date.now(),
          name: metaName || data.user?.email?.split("@")[0] || email.split("@")[0],
          email,
          photo: HD_PORTRAITS[0],
          destination: "Goa"
        };
        localStorage.setItem("wandermatch_session", JSON.stringify(userSession));
        onLoginSuccess(userSession);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#EDEAE2] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[400px] bg-[#FBF9F5] rounded-[42px] p-8 shadow-2xl border border-[#E4DFD5]">
        <div className="text-center pt-4 pb-4 space-y-2">
          <div className="inline-flex p-3 rounded-full bg-[#E15A44]/10 text-[#E15A44]">
            <Flame className="w-8 h-8 fill-[#E15A44]" />
          </div>
          <h1 className="text-2xl font-black text-[#1F1C18]">WanderMatch India</h1>
          <p className="text-xs text-slate-500">Sign in or create a real account to connect with live travelers.</p>
        </div>

        {errorMsg && <div className="p-2.5 mb-3 bg-rose-50 text-rose-600 text-xs rounded-xl font-medium">{errorMsg}</div>}

        <form onSubmit={handleAuth} className="space-y-3.5">
          {isRegistering && (
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Samiksha Patel"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#E15A44]"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Email</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#E15A44]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#E15A44]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#E15A44] hover:bg-[#cf4f3a] text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
          >
            {loading ? "Processing..." : isRegistering ? "Create Real Account" : "Sign In to App"}
          </button>
        </form>

        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-xs font-semibold text-slate-600 hover:text-[#E15A44] transition"
          >
            {isRegistering ? "Already have an account? Sign In" : "Need an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}

// REAL AGORA WEBRTC CALL MODAL WITH SECURE AUTOMATED TOKEN FETCHING
const AGORA_APP_ID = "945042339123469f9c78d84befeef34e";

function RealCallModal({ channelName, callType, onClose }: { channelName: string; callType: "audio" | "video"; onClose: () => void }) {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [localAudio, setLocalAudio] = useState<IMicrophoneAudioTrack | null>(null);
  const [localVideo, setLocalVideo] = useState<ICameraVideoTrack | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(callType === "audio");
  const [callStatus, setCallStatus] = useState("Generating secure token...");
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let rtcClient: IAgoraRTCClient | null = null;
    let audioTrack: IMicrophoneAudioTrack | null = null;
    let videoTrack: ICameraVideoTrack | null = null;

    async function initCall() {
      try {
        setCallStatus("Generating secure token...");

        const res = await fetch(`/api/rtc-token?channelName=${encodeURIComponent(channelName)}`);
        const data = await res.json();

        if (!data.token) {
          throw new Error("Token generation returned empty.");
        }

        setCallStatus("Connecting to peer...");

        rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        setClient(rtcClient);

        await rtcClient.join("945042339123469f9c78d84befeef34e", channelName, data.token, data.uid || 0);

        audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        setLocalAudio(audioTrack);

        if (callType === "video") {
          videoTrack = await AgoraRTC.createCameraVideoTrack();
          setLocalVideo(videoTrack);
          await rtcClient.publish([audioTrack, videoTrack]);
          setTimeout(() => videoTrack.play("local-video-preview"), 300);
        } else {
          await rtcClient.publish([audioTrack]);
        }
        setCallStatus("Connected");
      } catch (err) {
        console.error("Agora call error:", err);
        setCallStatus("Connection failed.");
      }
    }

    initCall();

    return () => {
      audioTrack?.close();
      videoTrack?.close();
      rtcClient?.leave();
    };
  }, [channelName, callType]);

  useEffect(() => {
    let intv: NodeJS.Timeout;
    if (callStatus === "Connected") {
      intv = setInterval(() => setDuration((p) => p + 1), 1000);
    }
    return () => clearInterval(intv);
  }, [callStatus]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleHangup = async () => {
    localAudio?.close();
    localVideo?.close();
    await client?.leave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-8 text-white">
      <div className="text-center pt-8 space-y-1">
        <h3 className="text-xl font-bold">Secure VoIP Call</h3>
        <p className="text-xs text-emerald-400 font-semibold">
          {callStatus === "Connected" ? `Connected • ${formatTimer(duration)}` : callStatus}
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        {callType === "video" ? (
          <div id="local-video-preview" className="w-72 h-96 rounded-3xl bg-slate-900 overflow-hidden shadow-2xl border border-white/20" />
        ) : (
          <div className="w-32 h-32 rounded-full bg-[#E15A44]/20 border-4 border-[#E15A44] flex items-center justify-center animate-pulse">
            <Mic className="w-12 h-12 text-[#E15A44]" />
          </div>
        )}
      </div>

      <div className="flex justify-center items-center gap-6 pb-6">
        <button
          onClick={() => {
            localAudio?.setMuted(!isMuted);
            setIsMuted(!isMuted);
          }}
          className={`p-4 rounded-full transition ${isMuted ? "bg-white text-black" : "bg-white/20"}`}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <button onClick={handleHangup} className="p-5 bg-rose-600 hover:bg-rose-700 rounded-full shadow-xl transition">
          <PhoneOff className="w-6 h-6" />
        </button>

        {callType === "video" && (
          <button
            onClick={() => {
              localVideo?.setEnabled(isVideoOff);
              setIsVideoOff(!isVideoOff);
            }}
            className={`p-4 rounded-full transition ${isVideoOff ? "bg-white text-black" : "bg-white/20"}`}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
  );
}

// MASTER APP COMPONENT
export default function WanderMatchContent() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem("wandermatch_session");
    if (session) {
      setCurrentUser(JSON.parse(session));
    }
    setCheckingAuth(false);
  }, []);

  const [activeTab, setActiveTab] = useState<"discover" | "explore" | "bookings" | "matches" | "profile">("discover");
  const [currentState, setCurrentState] = useState("Goa");
  const [database, setDatabase] = useState<Record<string, StateDataset>>(STATE_RECORDS);
  const [bookingCategory, setBookingCategory] = useState<"stays" | "dining">("stays");

  // Story Viewer Modal State
  const [activeStoryTraveler, setActiveStoryTraveler] = useState<Traveler | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [storyReply, setStoryReply] = useState("");
  const [userCloudStories, setUserCloudStories] = useState<{ id: string; image: string; caption: string; timeAgo: string }[]>([]);

  // Fetch live user stories from Supabase on boot
  useEffect(() => {
    async function fetchCloudStories() {
      const { data, error } = await supabase
        .from('user_stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && !error) {
        setUserCloudStories(
          data.map((st: any) => ({
            id: st.id.toString(),
            image: st.image_url,
            caption: st.caption,
            timeAgo: "Recently"
          }))
        );
      }
    }
    fetchCloudStories();
  }, []);

  // Inspection Drawer States
  const [selectedItinerary, setSelectedItinerary] = useState<ItineraryItem | null>(null);
  const [selectedStay, setSelectedStay] = useState<Accommodation | null>(null);
  const [selectedDining, setSelectedDining] = useState<DiningSpot | null>(null);

  // Review & Rating Modal State
  const [activeReviewTarget, setActiveReviewTarget] = useState<{ id: string; title: string; type: "Itinerary" | "Stay" | "Dining" } | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewComment, setReviewComment] = useState("");

  // Calling State
  const [activeCall, setActiveCall] = useState<{ user: Traveler; type: "audio" | "video" } | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Chat Interface State
  const [selectedChatUser, setSelectedChatUser] = useState<Traveler | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, { id: string; sender: "me" | "them"; text: string; time: string }[]>>({
    Goa_p1: [{ id: "m1", sender: "them", text: "Hey! When are you reaching Goa? Up for checking South Goa cliff spots?", time: "10:14 AM" }]
  });
  const [inputMsg, setInputMsg] = useState("");
  const [appliedPlans, setAppliedPlans] = useState<string[]>([]);

  // Real-time Supabase Chat Subscription & Message Sync
  useEffect(() => {
    if (!selectedChatUser || !currentUser) return;

    async function fetchMessages() {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedChatUser.id}),and(sender_id.eq.${selectedChatUser.id},receiver_id.eq.${currentUser.id})`)
        .order('created_at', { ascending: true });

      if (data && !error) {
        setChatMessages((prev) => ({
          ...prev,
          [selectedChatUser.id]: data.map((m: any) => ({
            id: m.id.toString(),
            sender: m.sender_id === currentUser.id ? "me" : "them",
            text: m.text,
            time: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }))
        }));
      }
    }

    fetchMessages();

    const channel = supabase
      .channel(`chat_${currentUser.id}_${selectedChatUser.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${currentUser.id}`
        },
        (payload) => {
          const newIncoming = payload.new as any;
          if (newIncoming.sender_id === selectedChatUser.id) {
            setChatMessages((prev) => ({
              ...prev,
              [selectedChatUser.id]: [
                ...(prev[selectedChatUser.id] || []),
                {
                  id: newIncoming.id.toString(),
                  sender: "them",
                  text: newIncoming.text,
                  time: new Date(newIncoming.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                }
              ]
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChatUser, currentUser]);

  // Profile Edit State with Supabase Cloud Persistence
  const [myProfile, setMyProfile] = useState({
    name: "Traveler",
    age: 23,
    phone: "+91 98230 45678",
    homeCity: "India",
    destination: "Goa",
    travelDates: "15 Oct – 22 Oct",
    budgetTier: "Moderate" as "Budget" | "Moderate" | "Luxury",
    bio: "Exploring India's 28 states, scenic ridges, and local food heritage.",
    photo: HD_PORTRAITS[0],
    tags: ["Wanderlust", "Local Food", "Road Trips", "Photography"]
  });

  // Load saved profile from Supabase database once currentUser is available
  useEffect(() => {
    async function loadProfile() {
      if (!currentUser?.id) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (data && !error) {
        setMyProfile({
          name: data.name || currentUser.name,
          age: data.age || 23,
          phone: data.phone || "+91 98230 45678",
          homeCity: data.home_city || "India",
          destination: "Goa",
          travelDates: "15 Oct – 22 Oct",
          budgetTier: data.budget_tier || "Moderate",
          bio: data.bio || "Exploring India's 28 states, scenic ridges, and local food heritage.",
          photo: data.photo || currentUser.photo || HD_PORTRAITS[0],
          tags: data.tags || ["Wanderlust", "Local Food", "Road Trips", "Photography"]
        });
      } else {
        const savedProfile = localStorage.getItem("wandermatch_user_profile");
        if (savedProfile) {
          try {
            setMyProfile(JSON.parse(savedProfile));
          } catch (e) {}
        }
      }
    }
    loadProfile();
  }, [currentUser?.id]);

  const [editTagInput, setEditTagInput] = useState("");
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Save profile to Supabase Cloud database
  const handleSaveProfileToCloud = async () => {
    if (!currentUser?.id) return;

    const { error } = await supabase.from('profiles').upsert({
      id: currentUser.id,
      name: myProfile.name,
      age: myProfile.age,
      phone: myProfile.phone,
      home_city: myProfile.homeCity,
      budget_tier: myProfile.budgetTier,
      bio: myProfile.bio,
      photo: myProfile.photo,
      tags: myProfile.tags,
      updated_at: new Date()
    });

    if (error) {
      alert("Error saving profile to cloud: " + error.message);
      return;
    }

    localStorage.setItem("wandermatch_user_profile", JSON.stringify(myProfile));
    
    setProfileSaveSuccess(true);
    setTimeout(() => setProfileSaveSuccess(false), 2500);
  };

  const currentData = useMemo(() => {
    return database[currentState] || database["Goa"];
  }, [database, currentState]);

  const [deck, setDeck] = useState<Traveler[]>(currentData.travelers);
  const [historyDeck, setHistoryDeck] = useState<Traveler[]>([]);
  useEffect(() => {
    setDeck(currentData.travelers);
    setHistoryDeck([]);
  }, [currentData]);

  const activeCard = deck[deck.length - 1];

  const handleSwipe = (dir: "left" | "right") => {
    if (activeCard) {
      setHistoryDeck((prev) => [...prev, activeCard]);
      if (dir === "right") {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.65 } });
      }
    }
    setDeck((prev) => prev.slice(0, -1));
  };

  const handleUndoSwipe = () => {
    if (historyDeck.length === 0) return;
    const lastCard = historyDeck[historyDeck.length - 1];
    setDeck((prev) => [...prev, lastCard]);
    setHistoryDeck((prev) => prev.slice(0, -1));
  };

  // Real Cloud Story Upload to Supabase Storage
  const handleUploadRealStory = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    const filePath = `story_${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from('stories').upload(filePath, file);

    if (uploadError) {
      alert("Error uploading story to cloud: " + uploadError.message);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('stories').getPublicUrl(filePath);

    await supabase.from('user_stories').insert([
      { user_id: currentUser.id, user_name: currentUser.name, image_url: publicUrl, caption: "Exploring hidden gems today! ✈️🌿", state: currentState }
    ]);

    const newStoryItem = {
      id: "stry_" + Date.now(),
      image: publicUrl,
      caption: "Exploring hidden gems today! ✈️🌿",
      timeAgo: "Just now"
    };
    setUserCloudStories((prev) => [newStoryItem, ...prev]);
    alert("Story successfully published to the live cloud network database!");
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeStoryTraveler) {
      setStoryProgress(0);
      timer = setInterval(() => {
        setStoryProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            const currentIdx = currentData.travelers.findIndex((t) => t.id === activeStoryTraveler.id);
            if (currentIdx < currentData.travelers.length - 1) {
              setActiveStoryTraveler(currentData.travelers[currentIdx + 1]);
              return 0;
            } else {
              setActiveStoryTraveler(null);
              return 100;
            }
          }
          return prev + 1.25;
        });
      }, 70);
    }
    return () => clearInterval(timer);
  }, [activeStoryTraveler, currentData.travelers]);

  useEffect(() => {
    let intv: NodeJS.Timeout;
    if (activeCall) {
      intv = setInterval(() => setCallDuration((p) => p + 1), 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(intv);
  }, [activeCall]);

  const handleSendMessage = async () => {
    if (!inputMsg.trim() || !selectedChatUser || !currentUser) return;
    
    const textToSend = inputMsg.trim();
    setInputMsg("");

    const { error } = await supabase.from('messages').insert([
      {
        sender_id: currentUser.id,
        receiver_id: selectedChatUser.id,
        text: textToSend
      }
    ]);

    if (error) {
      console.error("Error sending message:", error.message);
      return;
    }

    const newMsg = {
      id: Date.now().toString(),
      sender: "me" as const,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setChatMessages((prev) => ({
      ...prev,
      [selectedChatUser.id]: [...(prev[selectedChatUser.id] || []), newMsg]
    }));
  };

  const handleSendStoryReply = () => {
    if (!storyReply.trim() || !activeStoryTraveler) return;
    const targetUser = activeStoryTraveler;
    const newMsg = {
      id: Date.now().toString(),
      sender: "me" as const,
      text: `Replied to your story at ${targetUser.story.locationName}: "${storyReply.trim()}"`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setChatMessages((prev) => ({
      ...prev,
      [targetUser.id]: [...(prev[targetUser.id] || []), newMsg]
    }));
    setStoryReply("");
    setActiveStoryTraveler(null);
    setSelectedChatUser(targetUser);
    setActiveTab("matches");
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReviewTarget || !reviewAuthor.trim() || !reviewComment.trim()) return;

    const newRev: Review = {
      id: `usr_rev_${Date.now()}`,
      author: reviewAuthor.trim(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${reviewAuthor.trim()}`,
      rating: reviewRating,
      date: "Just now",
      comment: reviewComment.trim()
    };

    setDatabase((prev) => {
      const stateObj = { ...prev[currentState] };
      if (activeReviewTarget.type === "Itinerary") {
        stateObj.itineraries = stateObj.itineraries.map((it) =>
          it.id === activeReviewTarget.id ? { ...it, reviews: [newRev, ...it.reviews] } : it
        );
      } else if (activeReviewTarget.type === "Stay") {
        stateObj.stays = stateObj.stays.map((st) =>
          st.id === activeReviewTarget.id ? { ...st, reviews: [newRev, ...st.reviews] } : st
        );
      } else if (activeReviewTarget.type === "Dining") {
        stateObj.dining = stateObj.dining.map((dn) =>
          dn.id === activeReviewTarget.id ? { ...dn, reviews: [newRev, ...dn.reviews] } : dn
        );
      }
      return { ...prev, [currentState]: stateObj };
    });

    if (selectedItinerary && selectedItinerary.id === activeReviewTarget.id) {
      setSelectedItinerary({ ...selectedItinerary, reviews: [newRev, ...selectedItinerary.reviews] });
    }
    if (selectedStay && selectedStay.id === activeReviewTarget.id) {
      setSelectedStay({ ...selectedStay, reviews: [newRev, ...selectedStay.reviews] });
    }
    if (selectedDining && selectedDining.id === activeReviewTarget.id) {
      setSelectedDining({ ...selectedDining, reviews: [newRev, ...selectedDining.reviews] });
    }

    setReviewAuthor("");
    setReviewComment("");
    setActiveReviewTarget(null);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && editTagInput.trim()) {
      e.preventDefault();
      if (!myProfile.tags.includes(editTagInput.trim())) {
        setMyProfile({ ...myProfile, tags: [...myProfile.tags, editTagInput.trim()] });
      }
      setEditTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setMyProfile({ ...myProfile, tags: myProfile.tags.filter((t: string) => t !== tagToRemove) });
  };

  if (checkingAuth) {
    return <div className="min-h-screen bg-[#EDEAE2] flex items-center justify-center text-xs font-bold">Verifying user session...</div>;
  }

  if (!currentUser) {
    return <LoginPage onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  const handleSignOut = () => {
    localStorage.removeItem("wandermatch_session");
    supabase.auth.signOut();
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-[#EDEAE2] flex items-center justify-center p-0 md:p-6 font-sans selection:bg-[#E15A44] selection:text-white">
      <div className="w-full max-w-[420px] h-screen md:h-[880px] bg-[#FBF9F5] md:rounded-[42px] shadow-2xl border border-[#E4DFD5] flex flex-col justify-between overflow-hidden relative">

        {/* Global App Header */}
        {!selectedChatUser && !activeStoryTraveler && (
          <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-[#EDE8DF] bg-white/90 backdrop-blur-md z-10">
            <div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#E15A44] fill-[#E15A44]" />
                <span className="text-[11px] font-black uppercase tracking-wider text-[#E15A44]">WanderMatch India</span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">Live DB</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#E15A44]" />
                <select
                  value={currentState}
                  onChange={(e) => setCurrentState(e.target.value)}
                  className="text-xs font-bold text-[#1F1C18] bg-transparent border-none focus:outline-none cursor-pointer"
                >
                  {ALL_28_NAMES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("profile")}
                className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#E15A44]"
              >
                <img src={myProfile.photo} alt="Profile" className="w-full h-full object-cover" />
              </button>
              <button onClick={handleSignOut} className="p-1.5 text-slate-500 hover:text-rose-600 transition">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <div className="flex-1 overflow-y-auto px-4 py-3 scrollbar-none flex flex-col">

          {/* TAB 1: HOMEPAGE WITH CLOUD STORIES & HD COMPANIONS */}
          {activeTab === "discover" && (
            <div className="flex flex-col h-full justify-between gap-2">

              {/* Story Upload Bar */}
              <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-[#E7E2D8] shrink-0">
                <div>
                  <h4 className="font-bold text-xs text-[#1F1C18]">Upload Real Story</h4>
                  <p className="text-[10px] text-slate-500">Save to Supabase Cloud</p>
                </div>
                <label className="px-3.5 py-1.5 bg-[#E15A44] hover:bg-[#cf4f3a] text-white text-xs font-bold rounded-xl cursor-pointer shadow transition">
                  <Camera className="w-3 h-3 inline mr-1" /> Add Photo
                  <input type="file" accept="image/*" onChange={handleUploadRealStory} className="hidden" />
                </label>
              </div>

              {/* Active Companions & My Cloud Stories Tray */}
              <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none shrink-0 pt-0.5">
                {userCloudStories.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => setActiveStoryTraveler({
                      id: st.id,
                      name: "My Story",
                      age: 23,
                      destination: currentState,
                      dates: "Today",
                      budgetTier: "Moderate",
                      role: "Traveler",
                      promptTitle: "My Uploaded Moment",
                      promptAnswer: st.caption,
                      bio: "Uploaded to Supabase Cloud",
                      image: st.image,
                      tags: ["Cloud Story"],
                      matchRate: 100,
                      isOnline: true,
                      phone: "",
                      story: { id: st.id, locationName: currentState, image: st.image, caption: st.caption, timeAgo: st.timeAgo }
                    })}
                    className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                  >
                    <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 to-teal-400 group-hover:scale-105 transition shadow-sm">
                      <img src={st.image} alt="My Story" className="w-full h-full rounded-full object-cover border-2 border-white" />
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 truncate max-w-[54px]">
                      My Story
                    </span>
                  </div>
                ))}

                {currentData.travelers.map((trv) => (
                  <div
                    key={trv.id}
                    onClick={() => setActiveStoryTraveler(trv)}
                    className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                  >
                    <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-[#E15A44] via-amber-400 to-rose-500 group-hover:scale-105 transition shadow-sm">
                      <img src={trv.image} alt={trv.name} className="w-full h-full rounded-full object-cover border-2 border-white" />
                      {trv.isOnline && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700 truncate max-w-[54px]">
                      {trv.name.split(" ")[0]}
                    </span>
                  </div>
                ))}
              </div>

              {/* State Summary Banner */}
              <div className="bg-gradient-to-r from-[#FAF2EB] to-[#F5ECE1] rounded-2xl p-2.5 border border-[#E9DCCF] flex items-center justify-between shrink-0">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#E15A44]" />
                    <span className="text-[11px] font-extrabold text-[#1F1C18]">{currentState} Expedition</span>
                  </div>
                  <p className="text-[10px] text-[#706B63]">{currentData.terrain}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-black text-[#E15A44]">Cloud Synced ☁️</span>
                </div>
              </div>

              {/* Main Swipe Deck Card */}
              <div className="relative w-full h-[430px] my-auto">
                <AnimatePresence>
                  {activeCard ? (
                    <motion.div
                      key={activeCard.id}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      onDragEnd={(_, info) => {
                        if (info.offset.x > 90) handleSwipe("right");
                        else if (info.offset.x < -90) handleSwipe("left");
                      }}
                      className="absolute inset-0 rounded-[28px] overflow-hidden bg-white shadow-xl border border-[#E7E2D8] flex flex-col cursor-grab active:cursor-grabbing select-none"
                    >
                      <div className="relative w-full h-[62%]">
                        <img src={activeCard.image} alt={activeCard.name} className="w-full h-full object-cover pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent" />
                        <div className="absolute top-3 left-3 right-3 flex justify-between">
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-black/50 text-white backdrop-blur-md flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" /> {activeCard.role}
                          </span>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E15A44] text-white shadow">
                            {activeCard.matchRate}% Match
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-4 right-4 text-white">
                          <div className="flex items-baseline gap-2">
                            <h2 className="text-2xl font-black">{activeCard.name}</h2>
                            <span className="text-lg font-light text-white/80">{activeCard.age}</span>
                          </div>
                          <p className="text-xs text-white/90 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#F28C38]" /> {currentState} • {activeCard.dates}
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 flex-1 flex flex-col justify-between bg-white">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-[#E15A44] uppercase tracking-wider">{activeCard.promptTitle}</p>
                          <p className="text-xs italic text-slate-700 leading-snug">&ldquo;{activeCard.promptAnswer}&rdquo;</p>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div className="flex gap-1 flex-wrap">
                            {activeCard.tags.slice(0, 3).map((t) => (
                              <span key={t} className="text-[9px] bg-[#F4F1EA] px-2 py-0.5 rounded-full text-slate-700 font-medium border border-slate-200">
                                {t}
                              </span>
                            ))}
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {activeCard.budgetTier} Tier
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white rounded-[28px] border border-slate-200 shadow-sm">
                      <Compass className="w-8 h-8 text-[#E15A44] animate-spin mb-2" />
                      <h4 className="font-bold text-sm text-[#1F1C18]">All caught up for {currentState}!</h4>
                      <button
                        onClick={() => setDeck(currentData.travelers)}
                        className="mt-3.5 px-5 py-2 bg-[#E15A44] text-white text-xs font-bold rounded-full shadow hover:bg-[#c94d3a] transition"
                      >
                        Reset Deck
                      </button>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Homepage Controls */}
              {activeCard && (
                <div className="flex items-center justify-center gap-5 py-1.5 shrink-0">
                  <button
                    onClick={handleUndoSwipe}
                    disabled={historyDeck.length === 0}
                    className={`p-3 rounded-full border shadow-md transition ${
                      historyDeck.length === 0 ? "bg-slate-100 text-slate-300 border-slate-200" : "bg-white text-amber-500 border-slate-200 active:scale-95"
                    }`}
                  >
                    <Clock className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleSwipe("left")}
                    className="p-3.5 bg-white rounded-full border border-slate-200 shadow-md text-slate-600 active:scale-95 transition hover:bg-slate-50"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  <button
                    onClick={() => handleSwipe("right")}
                    className="p-4 bg-[#E15A44] rounded-full text-white shadow-xl shadow-[#E15A44]/30 active:scale-95 transition hover:bg-[#cf4f3a]"
                  >
                    <Heart className="w-7 h-7 fill-white" />
                  </button>

                  <button
                    onClick={() => setSelectedChatUser(activeCard)}
                    className="p-3 bg-white rounded-full border border-slate-200 shadow-md text-blue-500 active:scale-95 transition hover:bg-slate-50"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ITINERARIES */}
          {activeTab === "explore" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-[#1F1C18]">4 Curated Itineraries in {currentState}</h2>
                <p className="text-xs text-[#706B63]">Tap to view details, full schedule, cost splits & verified reviews</p>
              </div>

              {currentData.itineraries.map((it) => (
                <div
                  key={it.id}
                  onClick={() => setSelectedItinerary(it)}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E7E2D8] shadow-sm hover:shadow-md transition cursor-pointer p-3 space-y-2.5"
                >
                  <div className="relative">
                    <img src={it.image} alt={it.title} className="w-full h-36 object-cover rounded-xl" />
                    <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-bold backdrop-blur-md">
                      {it.tag}
                    </span>
                    <span className="absolute bottom-2 right-2 bg-white text-[#1F1C18] text-xs font-bold px-2.5 py-1 rounded-lg shadow">
                      ₹{it.pricePerPerson.toLocaleString()} <span className="text-[10px] font-normal text-slate-500">/ person</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#1F1C18] leading-tight">{it.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">{it.overview}</p>
                  </div>

                  <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-xs">
                    <span className="font-bold text-[#E15A44] flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-[#E15A44]" /> {it.rating} ({it.reviews.length} reviews)
                    </span>
                    <span className="text-[11px] font-semibold text-[#E15A44] bg-[#FAF2EB] px-2.5 py-1 rounded-md">
                      Inspect & Review →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: BOOKINGS */}
          {activeTab === "bookings" && (
            <div className="space-y-4">
              <div className="flex bg-white p-1 rounded-xl border border-[#E7E2D8]">
                <button
                  onClick={() => setBookingCategory("stays")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition ${
                    bookingCategory === "stays" ? "bg-[#1F1C18] text-white" : "text-slate-600"
                  }`}
                >
                  <Bed className="w-3.5 h-3.5" /> 3 Regional Stays
                </button>
                <button
                  onClick={() => setBookingCategory("dining")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition ${
                    bookingCategory === "dining" ? "bg-[#1F1C18] text-white" : "text-slate-600"
                  }`}
                >
                  <UtensilsCrossed className="w-3.5 h-3.5" /> 3 Cafes & Dining
                </button>
              </div>

              {bookingCategory === "stays" && currentData.stays.map((st) => (
                <div
                  key={st.id}
                  onClick={() => setSelectedStay(st)}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E7E2D8] p-3.5 space-y-2.5 cursor-pointer hover:shadow-md transition"
                >
                  <div className="relative">
                    <img src={st.image} alt={st.name} className="w-full h-36 object-cover rounded-xl" />
                    <span className="absolute bottom-2 right-2 bg-white text-[#1F1C18] text-xs font-bold px-2 py-0.5 rounded-lg shadow">
                      ₹{st.pricePerNight.toLocaleString()} <span className="text-[10px] font-normal text-slate-500">/ night</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[#1F1C18]">{st.name}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{st.description}</p>
                    <p className="text-[11px] font-semibold text-[#8C5E3C] mt-1">🏗️ {st.architecture}</p>
                  </div>

                  <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-xs">
                    <span className="font-bold text-[#E15A44] flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-[#E15A44]" /> {st.rating} ({st.reviews.length} reviews)
                    </span>
                    <span className="text-[11px] font-semibold text-[#E15A44] bg-[#FAF2EB] px-2.5 py-1 rounded-md">
                      Inspect Stay →
                    </span>
                  </div>
                </div>
              ))}

              {bookingCategory === "dining" && currentData.dining.map((dn) => (
                <div
                  key={dn.id}
                  onClick={() => setSelectedDining(dn)}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E7E2D8] p-3.5 space-y-2.5 cursor-pointer hover:shadow-md transition"
                >
                  <div className="relative">
                    <img src={dn.image} alt={dn.name} className="w-full h-36 object-cover rounded-xl" />
                    <span className="absolute bottom-2 right-2 bg-white text-[#1F1C18] text-xs font-bold px-2 py-0.5 rounded-lg shadow">
                      ₹{dn.avgCostForTwo.toLocaleString()} <span className="text-[10px] font-normal text-slate-500">for two</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[#1F1C18]">{dn.name}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{dn.description}</p>
                    <p className="text-[11px] font-semibold text-[#E15A44] mt-1">🍴 Specialty: {dn.specialty}</p>
                  </div>

                  <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-xs">
                    <span className="font-bold text-[#E15A44] flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-[#E15A44]" /> {dn.rating} ({dn.reviews.length} reviews)
                    </span>
                    <span className="text-[11px] font-semibold text-[#E15A44] bg-[#FAF2EB] px-2.5 py-1 rounded-md">
                      Inspect Dining Spot →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: CHATS */}
          {activeTab === "matches" && !selectedChatUser && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-[#1F1C18]">Travel Matches in {currentState}</h2>
              {currentData.travelers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedChatUser(user)}
                  className="bg-white p-3.5 rounded-2xl border border-[#E7E2D8] flex items-center justify-between cursor-pointer hover:bg-[#F4F1EA] transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={user.image} alt={user.name} className="w-12 h-12 rounded-full object-cover border" />
                      {user.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#1F1C18]">{user.name}</h4>
                      <p className="text-[11px] text-slate-500 truncate max-w-[170px]">
                        {chatMessages[user.id]?.[chatMessages[user.id].length - 1]?.text || "Tap to chat & call"}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#E15A44] bg-[#FAF2EB] px-2 py-1 rounded-full">
                    {user.matchRate}% Match
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* ACTIVE CHAT SCREEN */}
          {selectedChatUser && (
            <div className="flex flex-col h-full -mx-4 -my-3 bg-[#FBF9F5]">
              <div className="p-3 bg-white border-b border-[#EDE8DF] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <button onClick={() => setSelectedChatUser(null)} className="p-1 text-slate-600">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <img src={selectedChatUser.image} alt={selectedChatUser.name} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1F1C18]">{selectedChatUser.name}</h4>
                    <p className="text-[10px] text-emerald-600 font-semibold">Active now</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-700">
                  <button
                    onClick={() => setActiveCall({ user: selectedChatUser, type: "audio" })}
                    className="p-2 hover:bg-slate-100 rounded-full text-[#E15A44]"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveCall({ user: selectedChatUser, type: "video" })}
                    className="p-2 hover:bg-slate-100 rounded-full text-[#E15A44]"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                {(chatMessages[selectedChatUser.id] || []).map((m) => (
                  <div key={m.id} className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-xs ${
                      m.sender === "me" ? "bg-[#E15A44] text-white rounded-tr-none" : "bg-white border text-[#1F1C18] rounded-tl-none shadow-sm"
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-white border-t border-[#EDE8DF] flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-[#F5F2EA] rounded-full px-4 py-2 text-xs text-[#1F1C18] focus:outline-none"
                />
                <button onClick={handleSendMessage} className="p-2 bg-[#E15A44] text-white rounded-full">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: PROFILE */}
          {activeTab === "profile" && (
            <div className="space-y-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#1F1C18]">My Profile & Personal Details</h2>
                  <p className="text-xs text-slate-500">Edit details visible to other travelers</p>
                </div>
                <span className="text-[10px] font-bold text-[#E15A44] bg-[#FAF2EB] border border-[#E15A44]/20 px-2 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Profile
                </span>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-[#E7E2D8] shadow-sm flex items-center gap-4">
                <div className="relative">
                  <img
                    src={myProfile.photo}
                    alt={myProfile.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#E15A44] shadow"
                  />
                  <label className="absolute bottom-0 right-0 p-1.5 bg-[#1F1C18] text-white rounded-full cursor-pointer hover:bg-black transition shadow">
                    <Camera className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setMyProfile({ ...myProfile, photo: url });
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="flex-1">
                  <h3 className="font-extrabold text-sm text-[#1F1C18]">{myProfile.name}, {myProfile.age}</h3>
                  <p className="text-xs text-slate-500">{myProfile.homeCity}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Active Nomad
                    </span>
                    <span className="text-[10px] bg-[#FAF2EB] text-[#E15A44] font-bold px-2 py-0.5 rounded-full">
                      {myProfile.budgetTier} Budget
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-[#E7E2D8] shadow-sm space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={myProfile.name}
                      onChange={(e) => setMyProfile({ ...myProfile, name: e.target.value })}
                      className="w-full text-xs font-semibold p-2 bg-[#F9F7F2] border border-slate-200 rounded-xl focus:outline-none focus:border-[#E15A44]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Age</label>
                    <input
                      type="number"
                      value={myProfile.age}
                      onChange={(e) => setMyProfile({ ...myProfile, age: Number(e.target.value) })}
                      className="w-full text-xs font-semibold p-2 bg-[#F9F7F2] border border-slate-200 rounded-xl focus:outline-none focus:border-[#E15A44]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={myProfile.phone}
                      onChange={(e) => setMyProfile({ ...myProfile, phone: e.target.value })}
                      className="w-full text-xs font-semibold p-2 bg-[#F9F7F2] border border-slate-200 rounded-xl focus:outline-none focus:border-[#E15A44]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Hometown</label>
                    <input
                      type="text"
                      value={myProfile.homeCity}
                      onChange={(e) => setMyProfile({ ...myProfile, homeCity: e.target.value })}
                      className="w-full text-xs font-semibold p-2 bg-[#F9F7F2] border border-slate-200 rounded-xl focus:outline-none focus:border-[#E15A44]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Budget Preference</label>
                    <select
                      value={myProfile.budgetTier}
                      onChange={(e) => setMyProfile({ ...myProfile, budgetTier: e.target.value as any })}
                      className="w-full text-xs font-semibold p-2 bg-[#F9F7F2] border border-slate-200 rounded-xl focus:outline-none focus:border-[#E15A44]"
                    >
                      <option value="Budget">Budget (Hostels & Public Transit)</option>
                      <option value="Moderate">Moderate (Boutique Stays & Cabs)</option>
                      <option value="Luxury">Luxury (Resorts & 4x4 Private)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Travel Dates</label>
                    <input
                      type="text"
                      value={myProfile.travelDates}
                      onChange={(e) => setMyProfile({ ...myProfile, travelDates: e.target.value })}
                      className="w-full text-xs font-semibold p-2 bg-[#F9F7F2] border border-slate-200 rounded-xl focus:outline-none focus:border-[#E15A44]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Bio & Travel Philosophy</label>
                  <textarea
                    rows={3}
                    value={myProfile.bio}
                    onChange={(e) => setMyProfile({ ...myProfile, bio: e.target.value })}
                    className="w-full text-xs font-normal p-2.5 bg-[#F9F7F2] border border-slate-200 rounded-xl focus:outline-none focus:border-[#E15A44]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Interests & Travel Tags (Press Enter to Add)
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {myProfile.tags.map((t: string) => (
                      <span
                        key={t}
                        className="text-[10px] font-bold bg-[#FAF2EB] text-[#E15A44] border border-[#E9DCCF] px-2 py-0.5 rounded-full flex items-center gap-1"
                      >
                        {t}
                        <X
                          onClick={() => handleRemoveTag(t)}
                          className="w-3 h-3 cursor-pointer hover:text-black"
                        />
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Scuba Diving, Trekking..."
                    value={editTagInput}
                    onChange={(e) => setEditTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="w-full text-xs p-2 bg-[#F9F7F2] border border-slate-200 rounded-xl focus:outline-none focus:border-[#E15A44]"
                  />
                </div>

                <button
                  onClick={handleSaveProfileToCloud}
                  className="w-full py-3 bg-[#E15A44] hover:bg-[#cf4f3a] text-white text-xs font-bold rounded-xl shadow-lg transition active:scale-95"
                >
                  {profileSaveSuccess ? "Changes Saved Live ✓" : "Save Profile Details"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom App Navigation */}
        {!selectedChatUser && !activeStoryTraveler && (
          <div className="px-5 py-3 bg-white border-t border-[#EDE8DF] flex justify-between items-center z-10">
            {[
              { id: "discover", label: "Home", icon: Compass },
              { id: "explore", label: "4 Trips", icon: Calendar },
              { id: "bookings", label: "Stays & Food", icon: Bed },
              { id: "matches", label: "Chat", icon: MessageCircle },
              { id: "profile", label: "Profile", icon: User }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className="flex flex-col items-center gap-0.5 transition active:scale-90"
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-[#E15A44]" : "text-slate-400"}`} />
                  <span className={`text-[10px] font-bold ${isActive ? "text-[#E15A44]" : "text-slate-400"}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* FULL-SCREEN STORY VIEWER MODAL */}
        <AnimatePresence>
          {activeStoryTraveler && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute inset-0">
                <img
                  src={activeStoryTraveler.story.image}
                  alt={activeStoryTraveler.story.locationName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90" />
              </div>

              <div className="relative z-10 p-4 space-y-2">
                <div className="w-full bg-white/30 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-white h-full transition-all duration-75"
                    style={{ width: `${storyProgress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={activeStoryTraveler.image}
                      alt={activeStoryTraveler.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-white drop-shadow">
                          {activeStoryTraveler.name}
                        </span>
                        <span className="text-[10px] text-white/70 font-semibold">• {activeStoryTraveler.story.timeAgo}</span>
                      </div>
                      <p className="text-[11px] text-amber-300 font-bold flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {activeStoryTraveler.story.locationName}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveStoryTraveler(null)}
                    className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="absolute inset-y-20 inset-x-0 flex justify-between z-10">
                <div
                  onClick={() => {
                    const currentIdx = currentData.travelers.findIndex((t) => t.id === activeStoryTraveler.id);
                    if (currentIdx > 0) {
                      setActiveStoryTraveler(currentData.travelers[currentIdx - 1]);
                    }
                  }}
                  className="w-1/3 h-full cursor-pointer"
                />
                <div
                  onClick={() => {
                    const currentIdx = currentData.travelers.findIndex((t) => t.id === activeStoryTraveler.id);
                    if (currentIdx < currentData.travelers.length - 1) {
                      setActiveStoryTraveler(currentData.travelers[currentIdx + 1]);
                    } else {
                      setActiveStoryTraveler(null);
                    }
                  }}
                  className="w-2/3 h-full cursor-pointer"
                />
              </div>

              <div className="relative z-10 p-5 space-y-3">
                <div className="bg-black/50 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                  <p className="text-xs text-white leading-relaxed font-medium">
                    {activeStoryTraveler.story.caption}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Reply to ${activeStoryTraveler.name.split(" ")[0]}...`}
                    value={storyReply}
                    onChange={(e) => setStoryReply(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendStoryReply()}
                    className="flex-1 bg-white/20 border border-white/30 rounded-full px-4 py-2.5 text-xs text-white placeholder-white/60 focus:outline-none focus:bg-white/30 backdrop-blur-md"
                  />
                  <button
                    onClick={handleSendStoryReply}
                    className="p-2.5 bg-[#E15A44] hover:bg-[#cf4f3a] text-white rounded-full shadow-lg transition active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DETAIL DRAWER: ITINERARY */}
        <AnimatePresence>
          {selectedItinerary && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              className="absolute inset-0 z-50 bg-[#FBF9F5] flex flex-col justify-between overflow-y-auto"
            >
              <div className="relative">
                <img src={selectedItinerary.image} alt={selectedItinerary.title} className="w-full h-56 object-cover" />
                <button
                  onClick={() => setSelectedItinerary(null)}
                  className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#E15A44] px-2.5 py-0.5 rounded-full">
                    {selectedItinerary.tag}
                  </span>
                  <h2 className="text-lg font-bold mt-1 text-white leading-tight drop-shadow">{selectedItinerary.title}</h2>
                </div>
              </div>

              <div className="p-5 space-y-4 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-[#EDE8DF]">
                  <div className="flex items-center gap-3">
                    <img src={selectedItinerary.hostImage} alt={selectedItinerary.host} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-xs text-[#1F1C18]">{selectedItinerary.host}</h4>
                      <p className="text-[10px] text-slate-500">{selectedItinerary.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[#E15A44]">₹{selectedItinerary.pricePerPerson.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500">Per person split</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Expedition Description</h3>
                  <p className="text-xs text-slate-700 leading-relaxed">{selectedItinerary.overview}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">What We Split & Share</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedItinerary.included.map((inc, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700 bg-white p-2 rounded-xl border border-[#EDE8DF]">
                        <Check className="w-3.5 h-3.5 text-[#E15A44] shrink-0" />
                        <span className="text-[11px]">{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 border-t pt-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Reviews ({selectedItinerary.reviews.length})
                    </h3>
                    <button
                      onClick={() => setActiveReviewTarget({ id: selectedItinerary.id, title: selectedItinerary.title, type: "Itinerary" })}
                      className="text-xs font-bold text-[#E15A44] flex items-center gap-1 bg-[#FAF2EB] px-2.5 py-1 rounded-full"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Add My Review
                    </button>
                  </div>

                  <div className="space-y-2">
                    {selectedItinerary.reviews.map((rev) => (
                      <div key={rev.id} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-800">{rev.author}</span>
                          <span className="text-[10px] text-[#E15A44] font-bold flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-[#E15A44]" /> {rev.rating}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 italic">&ldquo;{rev.comment}&rdquo;</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white border-t flex items-center justify-between shrink-0">
                <div>
                  <div className="text-xs font-bold text-[#1F1C18]">₹{selectedItinerary.pricePerPerson.toLocaleString()} / person</div>
                  <div className="text-[10px] text-slate-500">{selectedItinerary.spotsTotal - selectedItinerary.spotsTaken} Spots Left</div>
                </div>
                <button
                  onClick={() => {
                    if (!appliedPlans.includes(selectedItinerary.id)) {
                      setAppliedPlans([...appliedPlans, selectedItinerary.id]);
                      confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
                      alert("Application submitted! Host will review your profile to split costs.");
                    }
                  }}
                  className="px-6 py-2.5 bg-[#E15A44] text-white text-xs font-bold rounded-full shadow"
                >
                  {appliedPlans.includes(selectedItinerary.id) ? "Applied ✓" : "Join & Split Costs"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DETAIL DRAWER: STAY */}
        <AnimatePresence>
          {selectedStay && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              className="absolute inset-0 z-50 bg-[#FBF9F5] flex flex-col justify-between overflow-y-auto"
            >
              <div className="relative">
                <img src={selectedStay.image} alt={selectedStay.name} className="w-full h-56 object-cover" />
                <button
                  onClick={() => setSelectedStay(null)}
                  className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#E15A44] px-2.5 py-0.5 rounded-full">
                    {selectedStay.type}
                  </span>
                  <h2 className="text-lg font-bold mt-1 text-white leading-tight drop-shadow">{selectedStay.name}</h2>
                </div>
              </div>

              <div className="p-5 space-y-4 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-[#EDE8DF]">
                  <div>
                    <h4 className="font-bold text-xs text-[#1F1C18]">{selectedStay.location}</h4>
                    <p className="text-[10px] text-slate-500">Verified architectural regional stay</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[#E15A44]">₹{selectedStay.pricePerNight.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500">Per night</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Property Description</h3>
                  <p className="text-xs text-slate-700 leading-relaxed">{selectedStay.description}</p>
                  <p className="text-xs font-semibold text-[#8C5E3C] mt-1.5">🏗️ Architecture: {selectedStay.architecture}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Included Amenities</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStay.perks.map((p, i) => (
                      <span key={i} className="text-xs bg-white border border-[#EDE8DF] px-2.5 py-1 rounded-lg text-slate-700 font-medium">
                        ✓ {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 border-t pt-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Guest Reviews ({selectedStay.reviews.length})
                    </h3>
                    <button
                      onClick={() => setActiveReviewTarget({ id: selectedStay.id, title: selectedStay.name, type: "Stay" })}
                      className="text-xs font-bold text-[#E15A44] flex items-center gap-1 bg-[#FAF2EB] px-2.5 py-1 rounded-full"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Rate Stay
                    </button>
                  </div>

                  <div className="space-y-2">
                    {selectedStay.reviews.map((rev) => (
                      <div key={rev.id} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-800">{rev.author}</span>
                          <span className="text-[10px] text-[#E15A44] font-bold flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-[#E15A44]" /> {rev.rating}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 italic">&ldquo;{rev.comment}&rdquo;</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white border-t flex items-center justify-between shrink-0">
                <div>
                  <div className="text-xs font-bold text-[#1F1C18]">₹{selectedStay.pricePerNight.toLocaleString()} / night</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">Instant confirmation available</div>
                </div>
                <button
                  onClick={() => alert(`Hold request sent for ${selectedStay.name}!`)}
                  className="px-6 py-2.5 bg-[#E15A44] text-white text-xs font-bold rounded-full shadow"
                >
                  Reserve Stay
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DETAIL DRAWER: DINING */}
        <AnimatePresence>
          {selectedDining && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              className="absolute inset-0 z-50 bg-[#FBF9F5] flex flex-col justify-between overflow-y-auto"
            >
              <div className="relative">
                <img src={selectedDining.image} alt={selectedDining.name} className="w-full h-56 object-cover" />
                <button
                  onClick={() => setSelectedDining(null)}
                  className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#E15A44] px-2.5 py-0.5 rounded-full">
                    {selectedDining.type}
                  </span>
                  <h2 className="text-lg font-bold mt-1 text-white leading-tight drop-shadow">{selectedDining.name}</h2>
                </div>
              </div>

              <div className="p-5 space-y-4 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-[#EDE8DF]">
                  <div>
                    <h4 className="font-bold text-xs text-[#1F1C18]">{selectedDining.location}</h4>
                    <p className="text-[10px] text-slate-500">📍 Setting: {selectedDining.setting}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[#E15A44]">₹{selectedDining.avgCostForTwo.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500">Average for two</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">About the Venue</h3>
                  <p className="text-xs text-slate-700 leading-relaxed">{selectedDining.description}</p>
                  <p className="text-xs font-semibold text-[#E15A44] mt-1.5">🍴 Recommended: {selectedDining.specialty}</p>
                </div>

                <div className="space-y-2 border-t pt-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Foodie Reviews ({selectedDining.reviews.length})
                    </h3>
                    <button
                      onClick={() => setActiveReviewTarget({ id: selectedDining.id, title: selectedDining.name, type: "Dining" })}
                      className="text-xs font-bold text-[#E15A44] flex items-center gap-1 bg-[#FAF2EB] px-2.5 py-1 rounded-full"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Rate Cafe
                    </button>
                  </div>

                  <div className="space-y-2">
                    {selectedDining.reviews.map((rev) => (
                      <div key={rev.id} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-800">{rev.author}</span>
                          <span className="text-[10px] text-[#E15A44] font-bold flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-[#E15A44]" /> {rev.rating}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 italic">&ldquo;{rev.comment}&rdquo;</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white border-t flex items-center justify-between shrink-0">
                <div>
                  <div className="text-xs font-bold text-[#1F1C18]">₹{selectedDining.avgCostForTwo.toLocaleString()} for two</div>
                  <div className="text-[10px] text-slate-500">Table booking available</div>
                </div>
                <button
                  onClick={() => alert(`Table reservation requested at ${selectedDining.name} for 2 people!`)}
                  className="px-6 py-2.5 bg-[#1F1C18] text-white text-xs font-bold rounded-full shadow"
                >
                  Reserve Table
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CLIENT RATING & REVIEW FORM MODAL */}
        <AnimatePresence>
          {activeReviewTarget && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <div className="bg-[#FBF9F5] w-full max-w-sm rounded-3xl p-6 border border-[#E7E2D8] shadow-2xl relative">
                <button
                  onClick={() => setActiveReviewTarget(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-200 text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-base font-bold text-[#1F1C18]">Rate & Review</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sharing your experience for <span className="font-bold text-[#E15A44]">{activeReviewTarget.title}</span>
                </p>

                <form onSubmit={handleSubmitReview} className="mt-4 space-y-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">Your Star Rating</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="p-1 text-[#E15A44] transition hover:scale-110"
                        >
                          <Star className={`w-6 h-6 ${star <= reviewRating ? "fill-[#E15A44]" : "stroke-[#E15A44] fill-none"}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Samiksha P."
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#1F1C18] focus:outline-none focus:border-[#E15A44]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">Your Honest Review</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="How was the view, price, guide, and authenticity?"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-[#1F1C18] focus:outline-none focus:border-[#E15A44]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#E15A44] text-white text-xs font-bold rounded-xl shadow transition active:scale-95"
                  >
                    Submit Verified Review
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* REAL-TIME CALL OVERLAY */}
        <AnimatePresence>
          {activeCall && (
            <RealCallModal
              channelName={`room_${activeCall.user.id}`}
              callType={activeCall.type}
              onClose={() => setActiveCall(null)}
            />
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}