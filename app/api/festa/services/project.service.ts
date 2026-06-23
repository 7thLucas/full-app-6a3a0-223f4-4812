import { ProjectModel } from "../models/project.model";
import { UnitModel } from "../models/unit.model";

export class ProjectService {
  static async list(filter: { featured?: boolean } = {}) {
    const query: Record<string, unknown> = { deletedAt: null };
    if (filter.featured !== undefined) query.featured = filter.featured;
    return ProjectModel.find(query).sort({ sortOrder: 1, createdAt: -1 }).lean().exec();
  }

  static async getBySlug(slug: string) {
    return ProjectModel.findOne({ slug, deletedAt: null }).lean().exec();
  }

  static async getById(id: string) {
    return ProjectModel.findById(id).lean().exec();
  }

  static async create(data: Record<string, unknown>) {
    return ProjectModel.create(data);
  }

  static async update(id: string, data: Record<string, unknown>) {
    return ProjectModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean().exec();
  }

  static async remove(id: string) {
    return ProjectModel.findByIdAndUpdate(
      id,
      { $set: { deletedAt: new Date() } },
      { new: true },
    ).lean().exec();
  }

  /** Recompute denormalized starting price + range from a project's units. */
  static async refreshPricing(projectId: string) {
    const units = await UnitModel.find({ projectId, deletedAt: null }).lean().exec();
    const prices = units.map((u) => u.price).filter((p) => typeof p === "number" && p > 0);
    if (prices.length === 0) {
      await ProjectModel.findByIdAndUpdate(projectId, {
        $set: { startingPrice: 0, priceRange: "" },
      }).exec();
      return;
    }
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    await ProjectModel.findByIdAndUpdate(projectId, {
      $set: { startingPrice: min, priceRange: min === max ? `${min}` : `${min}-${max}` },
    }).exec();
  }
}
