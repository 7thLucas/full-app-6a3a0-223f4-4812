import { useState } from "react";
import { cn } from "~/lib/utils";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const pics = images.filter(Boolean);
  const [active, setActive] = useState(0);
  if (pics.length === 0) {
    return <div className="aspect-[16/10] w-full rounded-2xl bg-secondary" />;
  }
  return (
    <div>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-secondary">
        <img src={pics[active]} alt={alt} className="h-full w-full object-cover" />
      </div>
      {pics.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {pics.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors",
                active === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
