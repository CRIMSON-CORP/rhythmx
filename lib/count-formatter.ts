const formatter = new Intl.NumberFormat("en-US", {});

export function formatCount(count: number) {
  return formatter.format(count);
}
