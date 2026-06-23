import {
  prop,
  getModelForClass,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";
import { CommonTypegooseEntity } from "~/api/models/base/common-typegoose.entity";

/**
 * Favorites are keyed by a lightweight client-generated visitor id (stored in
 * localStorage) so buyers can shortlist units without a full auth flow. This is
 * the "saved favorites with customer accounts" capability in its day-one,
 * frictionless form.
 */
@modelOptions({
  schemaOptions: {
    collection: "tbl_festa_favorites",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
  options: { allowMixed: Severity.ALLOW },
})
export class Favorite extends CommonTypegooseEntity {
  @prop({ type: String, required: true, index: true })
  visitorId!: string;

  @prop({ type: String, required: true, index: true })
  unitId!: string;
}

export const FavoriteModel = getModelForClass(Favorite);
