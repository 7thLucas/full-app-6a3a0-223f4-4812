export type Availability = "available" | "reserved" | "sold";

export interface Amenity {
  name: string;
  icon?: string;
}

export interface Project {
  _id: string;
  slug: string;
  name: string;
  developer?: string;
  tagline?: string;
  description?: string;
  location?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  coverImage?: string;
  gallery?: string[];
  videoUrl?: string;
  sitePlanImage?: string;
  amenities?: Amenity[];
  nearbyPlaces?: string[];
  startingPrice?: number;
  priceRange?: string;
  featured?: boolean;
  promotionLabel?: string;
  status?: string;
  paymentScheme?: string;
  sortOrder?: number;
}

export interface Unit {
  _id: string;
  projectId: string;
  slug: string;
  name: string;
  type?: string;
  availability: Availability;
  bedrooms?: number;
  bathrooms?: number;
  landSize?: number;
  buildingSize?: number;
  floors?: number;
  carports?: number;
  orientation?: string;
  price: number;
  paymentScheme?: string;
  coverImage?: string;
  gallery?: string[];
  floorPlanImage?: string;
  videoUrl?: string;
  plotX?: number;
  plotY?: number;
  blockLabel?: string;
  facilities?: string[];
  description?: string;
  featured?: boolean;
  views?: number;
}

export type LeadIntent = "inquiry" | "site-visit" | "booking";
export type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost";

export interface Lead {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  message?: string;
  intent: LeadIntent;
  status: LeadStatus;
  projectId?: string;
  projectName?: string;
  unitId?: string;
  unitName?: string;
  preferredDate?: string;
  source?: string;
  createdAt?: string;
}

export interface AnalyticsOverview {
  totalProjects: number;
  totalUnits: number;
  availableUnits: number;
  reservedUnits: number;
  soldUnits: number;
  totalViews: number;
  totalLeads: number;
  qualifiedLeads: number;
  inquiries: number;
  visits: number;
  bookings: number;
  conversionRate: number;
  topUnits: { id: string; name: string; views: number; availability: Availability }[];
}
