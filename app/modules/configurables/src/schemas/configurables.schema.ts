/* START: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */
export interface FieldSchemaType {
  fieldName?: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "color"
    | "url"
    | "enum"
    | "datetime"
    | "file"
    | "files";
  required?: boolean;
  label?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
  fields?: FieldSchemaType[];
  item?: FieldSchemaType;
}
/* END: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */

export type ConfigurableSchemas = {
  formSchema: FieldSchemaType[];
};



export const configurableSchemas: ConfigurableSchemas = {
  formSchema: [
    {
      fieldName: "appName",
      type: "string",
      required: true,
      label: "App Name",
    },
    {
      fieldName: "logoUrl",
      type: "url",
      required: true,
      label: "Logo URL",
    },
    {
      fieldName: "brandColor",
      type: "object",
      required: true,
      label: "Brand Color",
      fields: [
        // ── Base ────────────────────────────────────────────────────────────
        { fieldName: "background",        type: "color", required: true,  label: "Background" },
        { fieldName: "foreground",        type: "color", required: true,  label: "Foreground" },
        // ── Card ────────────────────────────────────────────────────────────
        { fieldName: "card",              type: "color", required: true,  label: "Card" },
        { fieldName: "cardForeground",    type: "color", required: true,  label: "Card Foreground" },
        // ── Popover ─────────────────────────────────────────────────────────
        { fieldName: "popover",           type: "color", required: true,  label: "Popover" },
        { fieldName: "popoverForeground", type: "color", required: true,  label: "Popover Foreground" },
        // ── Primary ─────────────────────────────────────────────────────────
        { fieldName: "primary",           type: "color", required: true,  label: "Primary" },
        { fieldName: "primaryForeground", type: "color", required: true,  label: "Primary Foreground" },
        // ── Secondary ───────────────────────────────────────────────────────
        { fieldName: "secondary",           type: "color", required: true,  label: "Secondary" },
        { fieldName: "secondaryForeground", type: "color", required: true,  label: "Secondary Foreground" },
        // ── Muted ───────────────────────────────────────────────────────────
        { fieldName: "muted",           type: "color", required: true,  label: "Muted" },
        { fieldName: "mutedForeground", type: "color", required: true,  label: "Muted Foreground" },
        // ── Accent ──────────────────────────────────────────────────────────
        { fieldName: "accent",           type: "color", required: true,  label: "Accent" },
        { fieldName: "accentForeground", type: "color", required: true,  label: "Accent Foreground" },
        // ── Destructive ─────────────────────────────────────────────────────
        { fieldName: "destructive",           type: "color", required: true,  label: "Destructive" },
        { fieldName: "destructiveForeground", type: "color", required: true,  label: "Destructive Foreground" },
        // ── Border / Input / Ring ────────────────────────────────────────────
        { fieldName: "border", type: "color", required: true, label: "Border" },
        { fieldName: "input",  type: "color", required: true, label: "Input" },
        { fieldName: "ring",   type: "color", required: true, label: "Ring" },
        // ── Charts ──────────────────────────────────────────────────────────
        { fieldName: "chart1", type: "color", required: false, label: "Chart 1" },
        { fieldName: "chart2", type: "color", required: false, label: "Chart 2" },
        { fieldName: "chart3", type: "color", required: false, label: "Chart 3" },
        { fieldName: "chart4", type: "color", required: false, label: "Chart 4" },
        { fieldName: "chart5", type: "color", required: false, label: "Chart 5" },
        // ── Navbar ──────────────────────────────────────────────────────────
        { fieldName: "navbarBackground", type: "color", required: true, label: "Navbar Background" },
        // ── Sidebar ─────────────────────────────────────────────────────────
        { fieldName: "sidebarBackground",        type: "color", required: true,  label: "Sidebar Background" },
        { fieldName: "sidebarForeground",        type: "color", required: true,  label: "Sidebar Foreground" },
        { fieldName: "sidebarPrimary",           type: "color", required: true,  label: "Sidebar Primary" },
        { fieldName: "sidebarPrimaryForeground", type: "color", required: true,  label: "Sidebar Primary Foreground" },
        { fieldName: "sidebarAccent",            type: "color", required: true,  label: "Sidebar Accent" },
        { fieldName: "sidebarAccentForeground",  type: "color", required: true,  label: "Sidebar Accent Foreground" },
        { fieldName: "sidebarBorder",            type: "color", required: true,  label: "Sidebar Border" },
        { fieldName: "sidebarRing",              type: "color", required: true,  label: "Sidebar Ring" },
      ],
    },

    {
      fieldName: "font",
      type: "object",
      required: true,
      label: "Typography",
      fields: [
        {
          fieldName: "headingFont",
          type: "enum",
          required: true,
          label: "Heading Font",
          options: [
            "Inter",
            "Inter Tight",
            "Plus Jakarta Sans",
            "Poppins",
            "Montserrat",
            "Raleway",
            "Playfair Display",
            "Lora",
            "Merriweather",
            "EB Garamond",
            "Cinzel",
            "Cormorant Garamond",
            "Libre Baskerville",
            "PT Serif",
            "Nunito",
            "Outfit",
            "DM Sans",
            "Sora",
            "Space Grotesk",
            "Josefin Sans",
            "Rubik",
            "Quicksand",
            "Figtree",
            "Lexend",
          ],
        },
        {
          fieldName: "textFont",
          type: "enum",
          required: true,
          label: "Text Font",
          options: [
            "Inter",
            "Inter Tight",
            "Plus Jakarta Sans",
            "Poppins",
            "Montserrat",
            "Raleway",
            "Lora",
            "Merriweather",
            "EB Garamond",
            "Libre Baskerville",
            "PT Serif",
            "Nunito",
            "Outfit",
            "DM Sans",
            "Sora",
            "Source Sans 3",
            "Noto Sans",
            "Lato",
            "Open Sans",
            "Roboto",
            "Rubik",
            "Quicksand",
            "Figtree",
            "Lexend",
          ],
        },
      ],
    },

    // ── Brand / copy ─────────────────────────────────────────────────────────
    { fieldName: "tagline", type: "string", required: false, label: "Tagline" },
    { fieldName: "heroEyebrow", type: "string", required: false, label: "Hero Eyebrow" },
    { fieldName: "heroTitle", type: "string", required: true, label: "Hero Title" },
    { fieldName: "heroSubtitle", type: "string", required: false, label: "Hero Subtitle", maxLength: 400 },
    { fieldName: "heroImage", type: "url", required: false, label: "Hero Image URL" },
    { fieldName: "heroCtaLabel", type: "string", required: false, label: "Hero Primary CTA Label" },
    { fieldName: "heroSecondaryCtaLabel", type: "string", required: false, label: "Hero Secondary CTA Label" },
    {
      fieldName: "heroStats",
      type: "array",
      required: false,
      label: "Hero Stats",
      item: {
        type: "object",
        fields: [
          { fieldName: "value", type: "string", required: true, label: "Value" },
          { fieldName: "label", type: "string", required: true, label: "Label" },
        ],
      },
    },

    // ── Sections ─────────────────────────────────────────────────────────────
    { fieldName: "featuredHeading", type: "string", required: false, label: "Featured Section Heading" },
    { fieldName: "featuredSubheading", type: "string", required: false, label: "Featured Section Subheading" },
    { fieldName: "projectsHeading", type: "string", required: false, label: "Projects Section Heading" },
    { fieldName: "projectsSubheading", type: "string", required: false, label: "Projects Section Subheading" },

    // ── Lead capture / agent routing ─────────────────────────────────────────
    { fieldName: "agentName", type: "string", required: false, label: "Agent Name" },
    { fieldName: "agentRole", type: "string", required: false, label: "Agent Role" },
    { fieldName: "agentWhatsapp", type: "string", required: false, label: "Agent WhatsApp Number" },
    { fieldName: "agentPhotoUrl", type: "url", required: false, label: "Agent Photo URL" },
    { fieldName: "inquiryCtaLabel", type: "string", required: false, label: "Inquiry CTA Label" },
    { fieldName: "bookVisitCtaLabel", type: "string", required: false, label: "Book Visit CTA Label" },
    { fieldName: "whatsappCtaLabel", type: "string", required: false, label: "WhatsApp CTA Label" },

    // ── Financing calculator defaults ────────────────────────────────────────
    { fieldName: "defaultInterestRate", type: "number", required: false, label: "Default Interest Rate (%)", min: 0, max: 30 },
    { fieldName: "defaultTenureYears", type: "number", required: false, label: "Default Loan Tenure (years)", min: 1, max: 40 },
    { fieldName: "defaultDownPaymentPercent", type: "number", required: false, label: "Default Down Payment (%)", min: 0, max: 90 },
    { fieldName: "currencySymbol", type: "string", required: false, label: "Currency Symbol", maxLength: 4 },

    // ── Feature flags ─────────────────────────────────────────────────────────
    { fieldName: "showFinancingCalculator", type: "boolean", required: false, label: "Show Financing Calculator" },
    { fieldName: "showPromotions", type: "boolean", required: false, label: "Show Promotions" },
    { fieldName: "showFavorites", type: "boolean", required: false, label: "Show Favorites" },

    // ── Footer ──────────────────────────────────────────────────────────────
    { fieldName: "footerTagline", type: "string", required: false, label: "Footer Tagline", maxLength: 400 },
    {
      fieldName: "footerLinks",
      type: "array",
      required: false,
      label: "Footer Links",
      item: {
        type: "object",
        fields: [
          { fieldName: "label", type: "string", required: true, label: "Label" },
          { fieldName: "url", type: "string", required: true, label: "URL" },
        ],
      },
    },
    { fieldName: "contactEmail", type: "string", required: false, label: "Contact Email" },
    { fieldName: "contactPhone", type: "string", required: false, label: "Contact Phone" },
    { fieldName: "contactAddress", type: "string", required: false, label: "Contact Address" },
  ],
};