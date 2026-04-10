export const toSearchParams = (obj: Record<string, any>) =>
  new URLSearchParams(
    Object.entries(obj)
      .filter(([_, v]) => v != null) // filters undefined and null
      .map(([k, v]) => [k, String(v)])
  );