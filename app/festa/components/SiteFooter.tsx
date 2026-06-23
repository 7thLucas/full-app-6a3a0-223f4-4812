import { Link } from "react-router";
import { Building2, Mail, Phone, MapPin } from "lucide-react";
import { useFestaConfig } from "../hooks/use-festa-config";

export function SiteFooter() {
  const { config } = useFestaConfig();

  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-foreground">
              {config.appName}
            </span>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {config.footerTagline}
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Explore
          </h4>
          <ul className="space-y-2.5">
            {(config.footerLinks || []).map((link) => (
              <li key={link.url}>
                <Link
                  to={link.url}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Get in touch
          </h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {config.contactEmail && (
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary" />
                {config.contactEmail}
              </li>
            )}
            {config.contactPhone && (
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary" />
                {config.contactPhone}
              </li>
            )}
            {config.contactAddress && (
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-primary" />
                {config.contactAddress}
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <span>
            © {new Date().getFullYear()} {config.appName}. {config.tagline}.
          </span>
          <Link to="/admin" className="transition-colors hover:text-foreground">
            Developer Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
