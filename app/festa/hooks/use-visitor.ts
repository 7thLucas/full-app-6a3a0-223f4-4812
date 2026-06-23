import { useEffect, useState } from "react";

const KEY = "festa_visitor_id";

function generateId(): string {
  return "v_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * Returns a stable, client-generated visitor id stored in localStorage so
 * buyers can shortlist favorites without a full account. Returns "" during SSR.
 */
export function useVisitorId(): string {
  const [visitorId, setVisitorId] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    let id = window.localStorage.getItem(KEY);
    if (!id) {
      id = generateId();
      window.localStorage.setItem(KEY, id);
    }
    setVisitorId(id);
  }, []);

  return visitorId;
}
