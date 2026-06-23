import {
  prop,
  getModelForClass,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";
import { CommonTypegooseEntity } from "~/api/models/base/common-typegoose.entity";

@modelOptions({
  schemaOptions: {
    collection: "tbl_festa_units",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
  options: { allowMixed: Severity.ALLOW },
})
export class Unit extends CommonTypegooseEntity {
  @prop({ type: String, required: true, index: true })
  projectId!: string;

  @prop({ type: String, required: true, index: true })
  slug!: string;

  @prop({ type: String, required: true })
  name!: string;

  @prop({ type: String, default: "" })
  type?: string; // e.g. "House", "Apartment", "Villa"

  @prop({ type: String, default: "available", index: true })
  availability!: string; // "available" | "reserved" | "sold"

  // Specs
  @prop({ type: Number, default: 0 })
  bedrooms?: number;

  @prop({ type: Number, default: 0 })
  bathrooms?: number;

  @prop({ type: Number, default: 0 })
  landSize?: number; // m2

  @prop({ type: Number, default: 0 })
  buildingSize?: number; // m2

  @prop({ type: Number, default: 0 })
  floors?: number;

  @prop({ type: Number, default: 0 })
  carports?: number;

  @prop({ type: String, default: "" })
  orientation?: string;

  // Pricing
  @prop({ type: Number, default: 0, index: true })
  price!: number;

  @prop({ type: String, default: "" })
  paymentScheme?: string;

  // Media
  @prop({ type: String, default: "" })
  coverImage?: string;

  @prop({ type: () => [String], default: [] })
  gallery?: string[];

  @prop({ type: String, default: "" })
  floorPlanImage?: string;

  @prop({ type: String, default: "" })
  videoUrl?: string;

  // Site plan position (percent coordinates on the project site plan image)
  @prop({ type: Number, default: 0 })
  plotX?: number;

  @prop({ type: Number, default: 0 })
  plotY?: number;

  @prop({ type: String, default: "" })
  blockLabel?: string; // e.g. "A-12"

  @prop({ type: () => [String], default: [] })
  facilities?: string[];

  @prop({ type: String, default: "" })
  description?: string;

  @prop({ type: Boolean, default: false })
  featured?: boolean;

  // Engagement counters (feed the funnel)
  @prop({ type: Number, default: 0 })
  views?: number;

  @prop({ type: Number, default: 0 })
  sortOrder?: number;
}

export const UnitModel = getModelForClass(Unit);
