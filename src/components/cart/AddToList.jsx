import { useSyncExternalStore } from "react";
import { Check, Plus } from "lucide-react";

import { interestList } from "@/lib/cart";

export default function AddToList({
  item,
  variant = "default",
  className = "",
}) {
  const items = useSyncExternalStore(
    interestList.subscribe,
    interestList.getSnapshot,
    interestList.getServerSnapshot,
  );
  const inList = items.some((entry) => entry.id === item.id);

  const toggle = () => {
    if (inList) interestList.remove(item.id);
    else interestList.add(item);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={inList}
      className={
        variant === "compact"
          ? `inline-flex size-10 items-center justify-center rounded-full border border-line bg-paper/90 text-forest-800 transition-all hover:border-forest-700 hover:bg-apple ${className}`
          : `btn ${inList ? "btn--apple" : "btn--outline"} ${className}`
      }
      aria-label={
        inList
          ? `Quitar ${item.title} de la lista`
          : `Guardar ${item.title} en la lista`
      }
      title={inList ? "En tu lista" : "Guardar en lista"}
    >
      {inList ? (
        <Check className="size-4" strokeWidth={1.8} aria-hidden="true" />
      ) : (
        <Plus className="size-4" strokeWidth={1.8} aria-hidden="true" />
      )}
      {variant === "default" && (
        <span>{inList ? "En tu lista" : "Guardar en lista"}</span>
      )}
    </button>
  );
}
