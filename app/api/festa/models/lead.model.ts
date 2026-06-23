import {
  prop,
  getModelForClass,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";
import { CommonTypegooseEntity } from "~/api/models/base/common-typegoose.entity";

@modelOptions({
  schemaOptions: {
    collection: "tbl_festa_leads",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
  options: { allowMixed: Severity.ALLOW },
})
export class Lead extends CommonTypegooseEntity {
  @prop({ type: String, required: true })
  name!: string;

  @prop({ type: String, default: "" })
  email?: string;

  @prop({ type: String, required: true })
  phone!: string;

  @prop({ type: String, default: "" })
  message?: string;

  // The north-star intent type
  @prop({ type: String, required: true, index: true })
  intent!: string; // "inquiry" | "site-visit" | "booking"

  @prop({ type: String, default: "new", index: true })
  status!: string; // "new" | "contacted" | "qualified" | "won" | "lost"

  // What they were looking at when intent peaked
  @prop({ type: String, default: "" })
  projectId?: string;

  @prop({ type: String, default: "" })
  projectName?: string;

  @prop({ type: String, default: "" })
  unitId?: string;

  @prop({ type: String, default: "" })
  unitName?: string;

  // Scheduled visit date (for site-visit intent)
  @prop({ type: String, default: "" })
  preferredDate?: string;

  @prop({ type: String, default: "web" })
  source?: string;
}

export const LeadModel = getModelForClass(Lead);
