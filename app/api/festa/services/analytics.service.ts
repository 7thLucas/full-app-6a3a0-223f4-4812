import { ProjectModel } from "../models/project.model";
import { UnitModel } from "../models/unit.model";
import { LeadModel } from "../models/lead.model";

export class AnalyticsService {
  static async overview() {
    const [
      totalProjects,
      totalUnits,
      availableUnits,
      reservedUnits,
      soldUnits,
      totalViews,
      totalLeads,
      inquiries,
      visits,
      bookings,
      topUnits,
    ] = await Promise.all([
      ProjectModel.countDocuments({ deletedAt: null }),
      UnitModel.countDocuments({ deletedAt: null }),
      UnitModel.countDocuments({ deletedAt: null, availability: "available" }),
      UnitModel.countDocuments({ deletedAt: null, availability: "reserved" }),
      UnitModel.countDocuments({ deletedAt: null, availability: "sold" }),
      UnitModel.aggregate([
        { $match: { deletedAt: null } },
        { $group: { _id: null, views: { $sum: "$views" } } },
      ]),
      LeadModel.countDocuments({ deletedAt: null }),
      LeadModel.countDocuments({ deletedAt: null, intent: "inquiry" }),
      LeadModel.countDocuments({ deletedAt: null, intent: "site-visit" }),
      LeadModel.countDocuments({ deletedAt: null, intent: "booking" }),
      UnitModel.find({ deletedAt: null }).sort({ views: -1 }).limit(5).lean().exec(),
    ]);

    const views = totalViews[0]?.views ?? 0;
    const conversionRate = views > 0 ? (totalLeads / views) * 100 : 0;

    return {
      totalProjects,
      totalUnits,
      availableUnits,
      reservedUnits,
      soldUnits,
      totalViews: views,
      totalLeads,
      qualifiedLeads: visits + bookings,
      inquiries,
      visits,
      bookings,
      conversionRate: Number(conversionRate.toFixed(2)),
      topUnits: topUnits.map((u) => ({
        id: String(u._id),
        name: u.name,
        views: u.views ?? 0,
        availability: u.availability,
      })),
    };
  }
}
