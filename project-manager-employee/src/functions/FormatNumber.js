export function FormatNumber(number) {
  return new Intl.NumberFormat("en-DE").format(number);
}
