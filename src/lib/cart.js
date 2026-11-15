const STORAGE_KEY = "micelio.interest.v1";
const EMPTY = [];
const listeners = new Set();

let snapshot = EMPTY;
let hydrated = false;

const isItem = (value) => {
  if (!value || typeof value !== "object") return false;
  return (
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.price === "number"
  );
};

function read() {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isItem) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

export function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  snapshot = read();
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
      snapshot = read();
      emit();
    }
  });
}

const commit = (items) => {
  snapshot = items;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage can be unavailable in private mode; the list still works in memory.
    }
  }
  emit();
};

export const interestList = {
  subscribe(listener) {
    hydrate();
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    hydrate();
    return snapshot;
  },
  getServerSnapshot() {
    return EMPTY;
  },
  add(item) {
    hydrate();
    if (snapshot.some((entry) => entry.id === item.id)) return;
    commit([...snapshot, item]);
  },
  remove(id) {
    hydrate();
    commit(snapshot.filter((entry) => entry.id !== id));
  },
  clear() {
    hydrate();
    commit([]);
  },
};

export const cartCount = (items) => items.length;

export const cartTotal = (items) =>
  items.reduce((total, item) => total + item.price, 0);
