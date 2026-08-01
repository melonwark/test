export default function isTruthy(value: unknown): boolean {
  if (!value) return false;

  if (Array.isArray(value)) return value.length > 0;

  if (typeof value === 'object') return Object.keys(value).length > 0;

  return true;
}
