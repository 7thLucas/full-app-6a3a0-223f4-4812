/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  // Base
  background: string;
  foreground: string;
  // Card
  card: string;
  cardForeground: string;
  // Popover
  popover: string;
  popoverForeground: string;
  // Primary
  primary: string;
  primaryForeground: string;
  // Secondary
  secondary: string;
  secondaryForeground: string;
  // Muted
  muted: string;
  mutedForeground: string;
  // Accent
  accent: string;
  accentForeground: string;
  // Destructive
  destructive: string;
  destructiveForeground: string;
  // Border / Input / Ring
  border: string;
  input: string;
  ring: string;
  // Charts
  chart1?: string;
  chart2?: string;
  chart3?: string;
  chart4?: string;
  chart5?: string;
  // Navbar
  navbarBackground: string;
  // Sidebar
  sidebarBackground: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
};

export type TFont = {
  headingFont: string;
  textFont: string;
};

export type TStat = {
  value: string;
  label: string;
};

export type TFooterLink = {
  label: string;
  url: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  logoUrl: string;
  brandColor: TBrandColor;
  font: TFont;

  // ── Brand / copy ─────────────────────────────────────────────────────────
  tagline: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroCtaLabel: string;
  heroSecondaryCtaLabel: string;
  heroStats: TStat[];

  // ── Sections ────────────────────────────────────────────────────────────
  featuredHeading: string;
  featuredSubheading: string;
  projectsHeading: string;
  projectsSubheading: string;

  // ── Lead capture / agent routing ─────────────────────────────────────────
  agentName: string;
  agentRole: string;
  agentWhatsapp: string;
  agentPhotoUrl: string;
  inquiryCtaLabel: string;
  bookVisitCtaLabel: string;
  whatsappCtaLabel: string;

  // ── Financing calculator defaults ────────────────────────────────────────
  defaultInterestRate: number;
  defaultTenureYears: number;
  defaultDownPaymentPercent: number;
  currencySymbol: string;

  // ── Feature flags ─────────────────────────────────────────────────────────
  showFinancingCalculator: boolean;
  showPromotions: boolean;
  showFavorites: boolean;

  // ── Footer ────────────────────────────────────────────────────────────────
  footerTagline: string;
  footerLinks: TFooterLink[];
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "Festa",
  logoUrl: "",
  brandColor: {
    // Base
    background:        "#ffffff",
    foreground:        "#0f172a",
    // Card
    card:              "#ffffff",
    cardForeground:    "#0f172a",
    // Popover
    popover:           "#ffffff",
    popoverForeground: "#0f172a",
    // Primary — premium teal
    primary:           "#0f766e",
    primaryForeground: "#ffffff",
    // Secondary
    secondary:           "#f1f5f9",
    secondaryForeground: "#0f172a",
    // Muted
    muted:           "#f1f5f9",
    mutedForeground: "#64748b",
    // Accent
    accent:           "#ccfbf1",
    accentForeground: "#0f766e",
    // Destructive
    destructive:           "#e11d48",
    destructiveForeground: "#ffffff",
    // Border / Input / Ring
    border: "#e2e8f0",
    input:  "#e2e8f0",
    ring:   "#0f766e",
    // Charts
    chart1: "#0f766e",
    chart2: "#10b981",
    chart3: "#f59e0b",
    chart4: "#e11d48",
    chart5: "#0ea5e9",
    // Navbar
    navbarBackground: "#ffffff",
    // Sidebar
    sidebarBackground:        "#0f172a",
    sidebarForeground:        "#cbd5e1",
    sidebarPrimary:           "#0f766e",
    sidebarPrimaryForeground: "#ffffff",
    sidebarAccent:            "#1e293b",
    sidebarAccentForeground:  "#ffffff",
    sidebarBorder:            "#1e293b",
    sidebarRing:              "#0f766e",
  },
  font: {
    headingFont: "Plus Jakarta Sans",
    textFont: "Inter",
  },

  // ── Brand / copy ─────────────────────────────────────────────────────────
  tagline: "Premium Property Sales Platform",
  heroEyebrow: "From showing to selling",
  heroTitle: "Find the home you'll fall for.",
  heroSubtitle:
    "Browse premium developments and available units with full specs, floor plans, and rich media. Inquire or book a site visit the moment you're ready.",
  heroImage:
    "https://api.qb-deck.quantumbyte.ai/common/image-generation?prompt=modern%20luxury%20residential%20property%20development%20architecture%20at%20golden%20hour%2C%20elegant%20glass%20and%20stone%20facade%2C%20landscaped%20grounds%2C%20premium%20real%20estate%20editorial%20photography",
  heroCtaLabel: "Explore Projects",
  heroSecondaryCtaLabel: "Browse Units",
  heroStats: [
    { value: "12", label: "Active Developments" },
    { value: "340+", label: "Available Units" },
    { value: "24h", label: "Agent Response" },
  ],

  // ── Sections ────────────────────────────────────────────────────────────
  featuredHeading: "Featured Developments",
  featuredSubheading: "Hand-picked projects with priority inventory and live promotions.",
  projectsHeading: "Explore All Projects",
  projectsSubheading: "Browse every development and find the unit that's right for you.",

  // ── Lead capture / agent routing ─────────────────────────────────────────
  agentName: "Sales Concierge",
  agentRole: "Festa Property Advisor",
  agentWhatsapp: "+628123456789",
  agentPhotoUrl:
    "https://api.qb-deck.quantumbyte.ai/common/image-generation?prompt=professional%20friendly%20real%20estate%20sales%20advisor%20headshot%2C%20warm%20studio%20lighting%2C%20business%20attire%2C%20clean%20background",
  inquiryCtaLabel: "Inquire Now",
  bookVisitCtaLabel: "Book a Site Visit",
  whatsappCtaLabel: "Chat on WhatsApp",

  // ── Financing calculator defaults ────────────────────────────────────────
  defaultInterestRate: 7.5,
  defaultTenureYears: 15,
  defaultDownPaymentPercent: 20,
  currencySymbol: "$",

  // ── Feature flags ─────────────────────────────────────────────────────────
  showFinancingCalculator: true,
  showPromotions: true,
  showFavorites: true,

  // ── Footer ────────────────────────────────────────────────────────────────
  footerTagline:
    "One platform from discovery to booking — present properties professionally and capture qualified leads.",
  footerLinks: [
    { label: "Projects", url: "/projects" },
    { label: "Financing", url: "/financing" },
    { label: "Favorites", url: "/favorites" },
    { label: "Admin", url: "/admin" },
  ],
  contactEmail: "sales@festa.property",
  contactPhone: "+62 812 3456 789",
  contactAddress: "Festa Sales Gallery, Jakarta",
};
