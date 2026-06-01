const formatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export function formatCurrency(amount: number) {
  return formatter.format(amount);
}
