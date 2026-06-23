import { FavoriteModel } from "../models/favorite.model";

export class FavoriteService {
  static async listForVisitor(visitorId: string) {
    return FavoriteModel.find({ visitorId, deletedAt: null }).lean().exec();
  }

  static async toggle(visitorId: string, unitId: string) {
    const existing = await FavoriteModel.findOne({ visitorId, unitId, deletedAt: null }).exec();
    if (existing) {
      await FavoriteModel.deleteOne({ _id: existing._id }).exec();
      return { favorited: false };
    }
    await FavoriteModel.create({ visitorId, unitId });
    return { favorited: true };
  }

  static async unitIds(visitorId: string) {
    const favs = await FavoriteModel.find({ visitorId, deletedAt: null }).lean().exec();
    return favs.map((f) => f.unitId);
  }
}
