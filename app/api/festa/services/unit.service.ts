import { UnitModel } from "../models/unit.model";

export class UnitService {
  static async listByProject(projectId: string, availability?: string) {
    const query: Record<string, unknown> = { projectId, deletedAt: null };
    if (availability) query.availability = availability;
    return UnitModel.find(query).sort({ sortOrder: 1, price: 1 }).lean().exec();
  }

  static async list(filter: {
    availability?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    featured?: boolean;
    sort?: string;
  } = {}) {
    const query: Record<string, unknown> = { deletedAt: null };
    if (filter.availability) query.availability = filter.availability;
    if (filter.type) query.type = filter.type;
    if (filter.bedrooms) query.bedrooms = { $gte: filter.bedrooms };
    if (filter.featured !== undefined) query.featured = filter.featured;
    if (filter.minPrice || filter.maxPrice) {
      const priceQuery: Record<string, number> = {};
      if (filter.minPrice) priceQuery.$gte = filter.minPrice;
      if (filter.maxPrice) priceQuery.$lte = filter.maxPrice;
      query.price = priceQuery;
    }

    let sort: Record<string, 1 | -1> = { sortOrder: 1, price: 1 };
    if (filter.sort === "price-asc") sort = { price: 1 };
    else if (filter.sort === "price-desc") sort = { price: -1 };
    else if (filter.sort === "newest") sort = { createdAt: -1 };

    return UnitModel.find(query).sort(sort).lean().exec();
  }

  static async getBySlug(slug: string) {
    return UnitModel.findOne({ slug, deletedAt: null }).lean().exec();
  }

  static async getById(id: string) {
    return UnitModel.findById(id).lean().exec();
  }

  static async getManyByIds(ids: string[]) {
    return UnitModel.find({ _id: { $in: ids }, deletedAt: null }).lean().exec();
  }

  static async create(data: Record<string, unknown>) {
    return UnitModel.create(data);
  }

  static async update(id: string, data: Record<string, unknown>) {
    return UnitModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean().exec();
  }

  static async remove(id: string) {
    return UnitModel.findByIdAndUpdate(
      id,
      { $set: { deletedAt: new Date() } },
      { new: true },
    ).lean().exec();
  }

  static async incrementViews(id: string) {
    return UnitModel.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec();
  }
}
