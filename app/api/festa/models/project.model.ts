import {
  prop,
  getModelForClass,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";
import { CommonTypegooseEntity } from "~/api/models/base/common-typegoose.entity";

class Amenity {
  @prop({ type: String, required: true })
  name!: string;

  @prop({ type: String, default: "" })
  icon?: string;
}

@modelOptions({
  schemaOptions: {
    collection: "tbl_festa_projects",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
  options: { allowMixed: Severity.ALLOW },
})
export class Project extends CommonTypegooseEntity {
  @prop({ type: String, required: true, index: true })
  slug!: string;

  @prop({ type: String, required: true })
  name!: string;

  @prop({ type: String, default: "" })
  developer?: string;

  @prop({ type: String, default: "" })
  tagline?: string;

  @prop({ type: String, default: "" })
  description?: string;

  @prop({ type: String, default: "" })
  location?: string;

  @prop({ type: String, default: "" })
  city?: string;

  @prop({ type: Number, default: 0 })
  latitude?: number;

  @prop({ type: Number, default: 0 })
  longitude?: number;

  @prop({ type: String, default: "" })
  coverImage?: string;

  @prop({ type: () => [String], default: [] })
  gallery?: string[];

  @prop({ type: String, default: "" })
  videoUrl?: string;

  @prop({ type: String, default: "" })
  sitePlanImage?: string;

  @prop({ type: () => [Amenity], default: [], _id: false })
  amenities?: Amenity[];

  @prop({ type: () => [String], default: [] })
  nearbyPlaces?: string[];

  // Pricing summary for cards (computed/denormalized lowest unit price)
  @prop({ type: Number, default: 0 })
  startingPrice?: number;

  @prop({ type: String, default: "" })
  priceRange?: string;

  // Promotions / featured
  @prop({ type: Boolean, default: false, index: true })
  featured?: boolean;

  @prop({ type: String, default: "" })
  promotionLabel?: string;

  @prop({ type: String, default: "selling" })
  status?: string; // "selling" | "coming-soon" | "sold-out"

  // Payment scheme description per project
  @prop({ type: String, default: "" })
  paymentScheme?: string;

  @prop({ type: Number, default: 0 })
  sortOrder?: number;
}

export const ProjectModel = getModelForClass(Project);
