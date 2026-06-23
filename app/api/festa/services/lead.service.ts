import { LeadModel } from "../models/lead.model";

export class LeadService {
  static async create(data: Record<string, unknown>) {
    return LeadModel.create(data);
  }

  static async list(filter: { status?: string; intent?: string } = {}) {
    const query: Record<string, unknown> = { deletedAt: null };
    if (filter.status) query.status = filter.status;
    if (filter.intent) query.intent = filter.intent;
    return LeadModel.find(query).sort({ createdAt: -1 }).lean().exec();
  }

  static async updateStatus(id: string, status: string) {
    return LeadModel.findByIdAndUpdate(id, { $set: { status } }, { new: true }).lean().exec();
  }

  static async stats() {
    const [total, byIntent, byStatus] = await Promise.all([
      LeadModel.countDocuments({ deletedAt: null }),
      LeadModel.aggregate([
        { $match: { deletedAt: null } },
        { $group: { _id: "$intent", count: { $sum: 1 } } },
      ]),
      LeadModel.aggregate([
        { $match: { deletedAt: null } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);
    return { total, byIntent, byStatus };
  }
}
