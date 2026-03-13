import { HISTORICAL, START_YEAR, type PresetId, type YearRow } from "./data";

export function avgReturn(presetId: PresetId): number {
  const returns = presetId !== "custom" ? HISTORICAL[presetId] : null;
  if (!returns) return 0;
  return returns.reduce((a, b) => a + b, 0) / returns.length;
}

export function calcRows(
  monthly: number,
  initial: number,
  presetId: PresetId,
  fixedRate: number,
  totalYears: number,
  startYear: number,
): YearRow[] {
  const returns = presetId !== "custom" ? HISTORICAL[presetId] : null;
  // average of all historical years — used for projected years beyond END_YEAR
  const avg = returns ? returns.reduce((a, b) => a + b, 0) / returns.length : fixedRate;

  const rows: YearRow[] = [];
  let portfolio = initial;
  let totalInvested = initial;

  for (let y = 0; y < totalYears; y++) {
    const calYear = startYear + y;
    const historicalIdx = calYear - START_YEAR; // e.g., 2026 - 2004 = 22 (out of range)
    const hasHistorical = returns !== null && historicalIdx >= 0 && historicalIdx < returns.length;
    const yearReturn = hasHistorical
      ? returns![historicalIdx]
      : returns !== null
        ? avg          // preset but beyond historical → use avg
        : fixedRate;   // custom → use fixed rate

    const prevPortfolio = portfolio;
    const monthlyRate = Math.pow(1 + yearReturn / 100, 1 / 12) - 1;
    for (let m = 0; m < 12; m++) {
      portfolio = portfolio * (1 + monthlyRate) + monthly;
      totalInvested += monthly;
    }

    const yearGain = portfolio - prevPortfolio - monthly * 12; // market return only
    const profit = portfolio - totalInvested;
    const profitPct = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;
    rows.push({
      year: y + 1,
      calYear,
      yearReturn,
      isProjected: !hasHistorical && returns !== null,
      totalInvested,
      portfolioValue: portfolio,
      yearGain,
      profit,
      profitPct,
    });
  }
  return rows;
}

export function fmt(v: number) {
  if (Math.abs(v) >= 1_000_000_000) return (v / 1_000_000_000).toFixed(2) + "B";
  if (Math.abs(v) >= 1_000_000) return (v / 1_000_000).toFixed(2) + "M";
  return v.toLocaleString("th-TH", { maximumFractionDigits: 0 });
}

export function fmtFull(v: number) {
  return v.toLocaleString("th-TH", { maximumFractionDigits: 0 });
}
