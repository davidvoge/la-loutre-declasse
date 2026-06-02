export function calculateExposantPrice(meters) {
  const m = Number(meters);
  if (!Number.isInteger(m) || m < 1 || m > 6) {
    return null;
  }
  const blocks3 = Math.floor(m / 3);
  const remainder = m % 3;
  return blocks3 * 20 + remainder * 7;
}
