const formatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
});

export function formatDate(date: string) {
  return formatter.format(new Date(date));
}
