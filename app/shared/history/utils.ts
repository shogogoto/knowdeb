const timeUnits: { unit: Intl.RelativeTimeFormatUnit; ms: number }[] = [
  { unit: "year", ms: 31536000000 },
  { unit: "month", ms: 2592000000 },
  { unit: "day", ms: 86400000 },
  { unit: "hour", ms: 3600000 },
  { unit: "minute", ms: 60000 },
  { unit: "second", ms: 1000 },
];

const rtf = new Intl.RelativeTimeFormat("ja", { numeric: "auto" });

export function formatRelativeTime(from: number | Date): string {
  const fromTs = from instanceof Date ? from.getTime() : from;
  const elapsed = fromTs - Date.now();

  for (const { unit, ms } of timeUnits) {
    if (Math.abs(elapsed) > ms) {
      return rtf.format(Math.round(elapsed / ms), unit);
    }
  }
  return rtf.format(0, "second");
}
