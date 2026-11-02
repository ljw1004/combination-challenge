export interface Distribution {
  n: number;
  min: number | null;
  max: number | null;
  avg: number | null;
  median: number | null;
}

export function summarize(values: readonly number[]): Distribution {
  if (values.some(value => !Number.isFinite(value))) throw new Error('Statistics require finite values.');
  const sorted = [...values].sort((a, b) => a - b), n = sorted.length;
  if (!n) return {n, min: null, max: null, avg: null, median: null};
  return {
    n, min: sorted[0], max: sorted[n - 1],
    avg: sorted.reduce((sum, value) => sum + value / n, 0),
    median: n % 2 ? sorted[(n - 1) / 2] : sorted[n / 2 - 1] / 2 + sorted[n / 2] / 2,
  };
}
