import { createLogger } from "~/lib/logger";
import { ProjectModel } from "../models/project.model";
import { UnitModel } from "../models/unit.model";
import { LeadModel } from "../models/lead.model";

const logger = createLogger("FestaSeed");

const img = (prompt: string) =>
  `https://api.qb-deck.quantumbyte.ai/common/image-generation?prompt=${encodeURIComponent(prompt)}`;

type SeedUnit = {
  slug: string;
  name: string;
  type: string;
  availability: string;
  bedrooms: number;
  bathrooms: number;
  landSize: number;
  buildingSize: number;
  floors: number;
  carports: number;
  price: number;
  paymentScheme: string;
  coverImage: string;
  gallery: string[];
  floorPlanImage: string;
  plotX: number;
  plotY: number;
  blockLabel: string;
  facilities: string[];
  description: string;
  featured?: boolean;
  views?: number;
};

type SeedProject = {
  slug: string;
  name: string;
  developer: string;
  tagline: string;
  description: string;
  location: string;
  city: string;
  coverImage: string;
  gallery: string[];
  videoUrl: string;
  sitePlanImage: string;
  amenities: { name: string; icon: string }[];
  nearbyPlaces: string[];
  featured: boolean;
  promotionLabel: string;
  status: string;
  paymentScheme: string;
  sortOrder: number;
  units: SeedUnit[];
};

const projects: SeedProject[] = [
  {
    slug: "azure-bay-residences",
    name: "Azure Bay Residences",
    developer: "Meridian Developments",
    tagline: "Waterfront living, reimagined.",
    description:
      "A landmark waterfront development of tropical-modern homes wrapped around a private marina and lush landscaped parks. Azure Bay pairs resort-grade amenities with thoughtfully designed residences for families who want calm, connected living minutes from the city.",
    location: "Marina District",
    city: "Coastal City",
    coverImage: img(
      "modern luxury waterfront residential development at golden hour, glass and stone facade, marina, palm trees, premium real estate editorial photography",
    ),
    gallery: [
      img("luxury modern villa exterior with infinity pool overlooking marina, dusk, editorial"),
      img("elegant landscaped community park with walking paths in luxury residential development"),
      img("modern residential lobby interior, warm lighting, premium materials, marble and wood"),
    ],
    videoUrl: "",
    sitePlanImage: img(
      "clean architectural site plan masterplan of a residential development, top down, blocks and roads, minimal teal and white",
    ),
    amenities: [
      { name: "Private Marina", icon: "anchor" },
      { name: "Infinity Pool", icon: "waves" },
      { name: "Clubhouse", icon: "building" },
      { name: "24/7 Security", icon: "shield" },
      { name: "Landscaped Parks", icon: "trees" },
      { name: "Fitness Center", icon: "dumbbell" },
    ],
    nearbyPlaces: [
      "Coastal International School — 5 min",
      "Bayside Mall — 8 min",
      "City General Hospital — 12 min",
      "Central Business District — 15 min",
    ],
    featured: true,
    promotionLabel: "Early-bird 5% off",
    status: "selling",
    paymentScheme: "20% down payment, 12-month installment, or in-house financing up to 15 years.",
    sortOrder: 1,
    units: [
      {
        slug: "azure-bay-marlin-a12",
        name: "The Marlin (A-12)",
        type: "House",
        availability: "available",
        bedrooms: 4,
        bathrooms: 3,
        landSize: 220,
        buildingSize: 180,
        floors: 2,
        carports: 2,
        price: 685000,
        paymentScheme: "20% DP · 15-year financing available",
        coverImage: img("modern two storey luxury house exterior, white and wood, large windows, garden, daylight"),
        gallery: [
          img("bright modern living room interior, double height ceiling, premium furniture, natural light"),
          img("modern kitchen with island, marble countertop, warm wood cabinets"),
          img("luxury master bedroom with floor to ceiling windows, garden view"),
        ],
        floorPlanImage: img("clean architectural floor plan drawing of a two storey 4 bedroom house, top view, minimal lines"),
        plotX: 28,
        plotY: 34,
        blockLabel: "A-12",
        facilities: ["Private Garden", "Solar-ready Roof", "Smart Home Wiring", "Maid's Room"],
        description:
          "A signature corner home with a double-height living room, north-facing garden, and a generous master suite overlooking the marina parkland.",
        featured: true,
        views: 312,
      },
      {
        slug: "azure-bay-coral-b07",
        name: "The Coral (B-07)",
        type: "House",
        availability: "reserved",
        bedrooms: 3,
        bathrooms: 2,
        landSize: 160,
        buildingSize: 140,
        floors: 2,
        carports: 1,
        price: 525000,
        paymentScheme: "20% DP · 12-month installment",
        coverImage: img("modern compact luxury townhouse exterior, teal accents, clean lines, daylight"),
        gallery: [
          img("cozy modern family living room, neutral tones, large window"),
          img("modern compact kitchen, white cabinets, wood accents"),
        ],
        floorPlanImage: img("clean architectural floor plan of a 3 bedroom townhouse, top view, minimal"),
        plotX: 52,
        plotY: 30,
        blockLabel: "B-07",
        facilities: ["Rooftop Terrace", "Smart Home Wiring", "Covered Carport"],
        description: "An efficient three-bedroom home with a rooftop terrace, ideal for young families.",
        views: 198,
      },
      {
        slug: "azure-bay-pearl-c03",
        name: "The Pearl (C-03)",
        type: "House",
        availability: "sold",
        bedrooms: 5,
        bathrooms: 4,
        landSize: 320,
        buildingSize: 280,
        floors: 2,
        carports: 3,
        price: 980000,
        paymentScheme: "Sold",
        coverImage: img("grand modern luxury mansion exterior, marina view, infinity pool, dusk"),
        gallery: [img("luxury home interior with grand staircase, marble floor, chandelier")],
        floorPlanImage: img("clean architectural floor plan of a large 5 bedroom luxury house, top view"),
        plotX: 70,
        plotY: 52,
        blockLabel: "C-03",
        facilities: ["Private Pool", "Home Office", "Maid's Quarters", "Marina Frontage"],
        description: "The flagship waterfront residence with private pool and direct marina frontage.",
        views: 421,
      },
      {
        slug: "azure-bay-reef-a05",
        name: "The Reef (A-05)",
        type: "House",
        availability: "available",
        bedrooms: 4,
        bathrooms: 3,
        landSize: 240,
        buildingSize: 200,
        floors: 2,
        carports: 2,
        price: 740000,
        paymentScheme: "20% DP · 15-year financing available",
        coverImage: img("modern luxury family house with large garden, white facade, wood accents, daylight"),
        gallery: [
          img("spacious modern family room, warm neutral palette, garden view"),
          img("modern dining area with pendant lights, wood table"),
        ],
        floorPlanImage: img("clean architectural floor plan of a 4 bedroom family house, top view, minimal"),
        plotX: 20,
        plotY: 58,
        blockLabel: "A-05",
        facilities: ["Private Garden", "Walk-in Closet", "Smart Home Wiring"],
        description: "A family-first layout with a wraparound garden and flexible ground-floor study.",
        views: 167,
      },
    ],
  },
  {
    slug: "verdant-heights",
    name: "Verdant Heights",
    developer: "Greenline Group",
    tagline: "Hillside homes among the trees.",
    description:
      "Terraced hillside residences designed around mature greenery and panoramic valley views. Verdant Heights brings biophilic design, cross-ventilation, and quiet privacy to every home.",
    location: "Highland Ridge",
    city: "Valley City",
    coverImage: img(
      "modern hillside residential development among lush trees, terraced houses, valley view, morning light, premium real estate photography",
    ),
    gallery: [
      img("modern house on a hillside surrounded by trees, large glass facade, valley view"),
      img("green landscaped terraces in a hillside residential community, walking path"),
    ],
    videoUrl: "",
    sitePlanImage: img("architectural masterplan site plan of a terraced hillside residential development, top down, minimal teal"),
    amenities: [
      { name: "Forest Trails", icon: "trees" },
      { name: "Yoga Pavilion", icon: "flower" },
      { name: "Co-working Lounge", icon: "laptop" },
      { name: "24/7 Security", icon: "shield" },
      { name: "Kids' Playground", icon: "baby" },
    ],
    nearbyPlaces: [
      "Highland Montessori — 6 min",
      "Ridge Organic Market — 10 min",
      "Valley Medical Center — 14 min",
    ],
    featured: true,
    promotionLabel: "Free smart-home package",
    status: "selling",
    paymentScheme: "15% down payment, in-house financing up to 20 years.",
    sortOrder: 2,
    units: [
      {
        slug: "verdant-cedar-h21",
        name: "Cedar (H-21)",
        type: "House",
        availability: "available",
        bedrooms: 3,
        bathrooms: 3,
        landSize: 200,
        buildingSize: 170,
        floors: 2,
        carports: 2,
        price: 560000,
        paymentScheme: "15% DP · 20-year financing available",
        coverImage: img("modern hillside house with large glass walls, surrounded by trees, valley view, daylight"),
        gallery: [
          img("modern living room with floor to ceiling windows overlooking a forested valley"),
          img("minimalist modern kitchen with green view, wood and white"),
        ],
        floorPlanImage: img("clean architectural floor plan of a 3 bedroom hillside house, top view, minimal"),
        plotX: 34,
        plotY: 40,
        blockLabel: "H-21",
        facilities: ["Valley-view Balcony", "Cross Ventilation", "Rainwater Harvesting"],
        description: "A light-filled home cantilevered over the slope, with a valley-view master balcony.",
        featured: true,
        views: 245,
      },
      {
        slug: "verdant-birch-h08",
        name: "Birch (H-08)",
        type: "House",
        availability: "available",
        bedrooms: 4,
        bathrooms: 3,
        landSize: 260,
        buildingSize: 210,
        floors: 2,
        carports: 2,
        price: 690000,
        paymentScheme: "15% DP · 20-year financing available",
        coverImage: img("modern terraced house among trees, warm wood facade, large windows, morning light"),
        gallery: [img("warm modern interior with timber accents and forest view")],
        floorPlanImage: img("clean architectural floor plan of a 4 bedroom terraced house, top view"),
        plotX: 58,
        plotY: 46,
        blockLabel: "H-08",
        facilities: ["Roof Garden", "Home Office", "Cross Ventilation"],
        description: "A four-bedroom home with a roof garden and a dedicated work-from-home suite.",
        views: 134,
      },
      {
        slug: "verdant-willow-h15",
        name: "Willow (H-15)",
        type: "House",
        availability: "reserved",
        bedrooms: 3,
        bathrooms: 2,
        landSize: 180,
        buildingSize: 150,
        floors: 2,
        carports: 1,
        price: 495000,
        paymentScheme: "15% DP · 20-year financing available",
        coverImage: img("compact modern hillside home, green surroundings, clean lines, daylight"),
        gallery: [img("bright compact modern living space with greenery outside")],
        floorPlanImage: img("clean architectural floor plan of a compact 3 bedroom house, top view"),
        plotX: 46,
        plotY: 66,
        blockLabel: "H-15",
        facilities: ["Balcony", "Cross Ventilation"],
        description: "An efficient, breezy home tucked into the greenery — perfect as a first home.",
        views: 112,
      },
    ],
  },
  {
    slug: "lumen-sky-towers",
    name: "Lumen Sky Towers",
    developer: "Apex Living",
    tagline: "Skyline apartments above it all.",
    description:
      "Two sculpted residential towers offering studio-to-three-bedroom apartments with floor-to-ceiling glass, sky gardens, and a full suite of lifestyle amenities in the heart of downtown.",
    location: "Downtown Core",
    city: "Metro City",
    coverImage: img(
      "modern luxury twin residential apartment towers, glass facade, city skyline, dusk, premium real estate photography",
    ),
    gallery: [
      img("luxury apartment interior with floor to ceiling windows and city skyline view at night"),
      img("rooftop sky garden of a modern apartment tower with infinity pool and city view"),
    ],
    videoUrl: "",
    sitePlanImage: img("architectural floor plate plan of an apartment tower, units layout, top down, minimal teal"),
    amenities: [
      { name: "Sky Pool", icon: "waves" },
      { name: "Sky Lounge", icon: "building" },
      { name: "Gym & Spa", icon: "dumbbell" },
      { name: "Concierge", icon: "bell" },
      { name: "EV Charging", icon: "zap" },
    ],
    nearbyPlaces: [
      "Metro Station — 2 min",
      "Grand Galleria Mall — 4 min",
      "Downtown Business Park — 6 min",
    ],
    featured: false,
    promotionLabel: "",
    status: "selling",
    paymentScheme: "25% down payment, bank mortgage partners, flexible installment.",
    sortOrder: 3,
    units: [
      {
        slug: "lumen-skyline-2br-1808",
        name: "Skyline 2BR (18-08)",
        type: "Apartment",
        availability: "available",
        bedrooms: 2,
        bathrooms: 2,
        landSize: 0,
        buildingSize: 78,
        floors: 1,
        carports: 1,
        price: 420000,
        paymentScheme: "25% DP · bank mortgage partners",
        coverImage: img("modern luxury two bedroom apartment interior, floor to ceiling windows, city skyline, evening"),
        gallery: [
          img("modern apartment living and dining with skyline view, warm lighting"),
          img("modern apartment bedroom with city view at dusk"),
        ],
        floorPlanImage: img("clean architectural floor plan of a 2 bedroom apartment unit, top view, minimal"),
        plotX: 40,
        plotY: 38,
        blockLabel: "18-08",
        facilities: ["Balcony", "Built-in Wardrobes", "Smart AC"],
        description: "A corner two-bedroom on the 18th floor with dual-aspect skyline views.",
        featured: true,
        views: 289,
      },
      {
        slug: "lumen-studio-1203",
        name: "Studio Loft (12-03)",
        type: "Apartment",
        availability: "available",
        bedrooms: 1,
        bathrooms: 1,
        landSize: 0,
        buildingSize: 42,
        floors: 1,
        carports: 0,
        price: 235000,
        paymentScheme: "25% DP · flexible installment",
        coverImage: img("modern studio loft apartment interior, compact, stylish, city view, warm lighting"),
        gallery: [img("stylish compact studio apartment with city view and modern furnishings")],
        floorPlanImage: img("clean architectural floor plan of a studio apartment unit, top view, minimal"),
        plotX: 60,
        plotY: 30,
        blockLabel: "12-03",
        facilities: ["Built-in Kitchenette", "Smart AC"],
        description: "A smart studio loft — an ideal entry into downtown living or an investor's rental.",
        views: 176,
      },
      {
        slug: "lumen-penthouse-3br-3001",
        name: "Sky Penthouse 3BR (30-01)",
        type: "Apartment",
        availability: "reserved",
        bedrooms: 3,
        bathrooms: 3,
        landSize: 0,
        buildingSize: 145,
        floors: 1,
        carports: 2,
        price: 920000,
        paymentScheme: "25% DP · bank mortgage partners",
        coverImage: img("luxury penthouse apartment interior with panoramic city skyline, premium materials, dusk"),
        gallery: [img("penthouse living room with wraparound skyline view and designer furniture")],
        floorPlanImage: img("clean architectural floor plan of a 3 bedroom penthouse, top view, minimal"),
        plotX: 50,
        plotY: 18,
        blockLabel: "30-01",
        facilities: ["Private Terrace", "Wine Cellar", "Smart Home", "Two Parking Bays"],
        description: "The crown of Lumen — a wraparound penthouse with a private sky terrace.",
        views: 358,
      },
    ],
  },
];

const sampleLeads = [
  {
    name: "Daniel Reyes",
    email: "daniel.reyes@example.com",
    phone: "+62 811 1111 222",
    intent: "site-visit",
    status: "new",
    projectName: "Azure Bay Residences",
    unitName: "The Marlin (A-12)",
    preferredDate: "2026-06-28",
    message: "Would love to see the marina-facing units this weekend.",
    source: "web",
  },
  {
    name: "Priya Anand",
    email: "priya.anand@example.com",
    phone: "+62 812 3333 444",
    intent: "inquiry",
    status: "contacted",
    projectName: "Verdant Heights",
    unitName: "Cedar (H-21)",
    message: "Is the 20-year financing available for the Cedar unit?",
    source: "web",
  },
  {
    name: "Marcus Lim",
    email: "marcus.lim@example.com",
    phone: "+62 813 5555 666",
    intent: "booking",
    status: "qualified",
    projectName: "Lumen Sky Towers",
    unitName: "Skyline 2BR (18-08)",
    message: "Ready to book the 18-08 unit. Please send the booking form.",
    source: "web",
  },
];

export async function seedFesta(): Promise<void> {
  try {
    const existing = await ProjectModel.countDocuments({});
    if (existing > 0) {
      logger.info("Festa data already present, skipping seed");
      return;
    }

    logger.info("Seeding Festa projects, units, and demo leads...");

    for (const p of projects) {
      const { units, ...projectData } = p;
      const created = await ProjectModel.create(projectData);
      const projectId = String(created._id);

      const prices: number[] = [];
      for (let i = 0; i < units.length; i++) {
        const u = units[i];
        await UnitModel.create({ ...u, projectId, sortOrder: i });
        if (u.price > 0) prices.push(u.price);
      }
      if (prices.length > 0) {
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        await ProjectModel.findByIdAndUpdate(projectId, {
          $set: { startingPrice: min, priceRange: min === max ? `${min}` : `${min}-${max}` },
        });
      }
    }

    await LeadModel.insertMany(sampleLeads);

    logger.info("✅ Festa seed completed");
  } catch (error) {
    logger.error("❌ Festa seed failed:", error);
  }
}
