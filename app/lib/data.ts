export const START_YEAR = 2004;
export const END_YEAR = 2025;

export const HISTORICAL: Record<string, number[]> = {
  sp500: [10.9, 4.9, 15.8, 5.5, -37.0, 26.5, 15.1, 2.1, 16.0, 32.4, 13.7, 1.4, 12.0, 21.8, -4.4, 31.5, 18.4, 28.7, -18.1, 26.3, 25.0, 17.9],
  qqq:   [10.4, 1.5, 6.8, 19.2, -41.7, 54.7, 20.0, 3.3, 18.1, 36.6, 19.1, 9.5, 6.9, 32.7, -0.1, 39.1, 48.6, 27.3, -32.6, 54.8, 25.6, 21.6],
  set50: [13.0, 5.0, 0.7, 28.0, -47.0, 64.0, 41.0, -1.0, 36.0, -7.0, 20.0, -13.0, 22.0, 13.0, -11.0, 1.0, -9.0, 14.0, -5.0, -15.0, -12.0, -2.8],
  aapl:  [25.5, 123.3, 18.1, 133.5, -56.9, 146.9, 53.1, 25.6, 32.6, 5.4, 40.6, -3.0, 12.5, 48.5, -5.4, 88.9, 82.3, 34.7, -26.4, 48.2, 30.1, 14.2],
  nvda:  [20.0, 10.0, 15.0, -30.0, -78.0, 50.0, 13.0, 5.0, 8.0, 24.0, 3.0, 64.0, 224.0, 81.0, -31.0, 76.0, 122.0, 125.0, -50.0, 239.0, 171.0, 52.4],
  gold:  [5.5, 9.0, 23.2, 31.4, 5.5, 24.0, 29.5, 10.3, 7.0, -28.3, -1.5, -10.4, 8.5, 13.1, -1.6, 18.3, 25.0, -3.6, -0.3, 13.1, 27.2, 11.5],
};

export const PRESETS = [
  { id: "sp500", ticker: "S&P 500", name: "S&P 500 Index", emoji: "🇺🇸", textColor: "text-blue-400",   bgColor: "bg-blue-500/10",   ringColor: "ring-blue-500",   desc: "US Large Cap" },
  { id: "qqq",   ticker: "QQQ",     name: "Nasdaq 100",    emoji: "💻", textColor: "text-violet-400", bgColor: "bg-violet-500/10", ringColor: "ring-violet-500", desc: "US Tech" },
  { id: "set50", ticker: "SET50",   name: "SET50 Index",   emoji: "🇹🇭", textColor: "text-amber-400",  bgColor: "bg-amber-500/10",  ringColor: "ring-amber-500",  desc: "Thai Large Cap" },
  { id: "aapl",  ticker: "AAPL",    name: "Apple Inc.",    emoji: "🍎", textColor: "text-slate-300",  bgColor: "bg-slate-500/10",  ringColor: "ring-slate-400",  desc: "US Stock" },
  { id: "nvda",  ticker: "NVDA",    name: "NVIDIA Corp.",  emoji: "🟢", textColor: "text-green-400",  bgColor: "bg-green-500/10",  ringColor: "ring-green-500",  desc: "US Stock" },
  { id: "gold",  ticker: "GOLD",    name: "ทองคำ",         emoji: "🥇", textColor: "text-yellow-400", bgColor: "bg-yellow-500/10", ringColor: "ring-yellow-500", desc: "Commodity" },
] as const;

export const SCENARIO_COLORS = [
  { text: "text-emerald-400", bg: "bg-emerald-500/10", ring: "ring-emerald-500" },
  { text: "text-sky-400",     bg: "bg-sky-500/10",     ring: "ring-sky-500" },
  { text: "text-rose-400",    bg: "bg-rose-500/10",    ring: "ring-rose-500" },
  { text: "text-orange-400",  bg: "bg-orange-500/10",  ring: "ring-orange-500" },
];

export type PresetId = (typeof PRESETS)[number]["id"] | "custom";

export interface Scenario {
  id: string;
  presetId: PresetId;
  customReturn: string;
  monthly: string;
  initial: string;
}

export interface YearRow {
  year: number;
  calYear: number;
  yearReturn: number;
  isProjected: boolean; // true = no historical data, using avg return
  totalInvested: number;
  portfolioValue: number;
  yearGain: number;     // pure market gain this year (excl. new DCA deposits)
  profit: number;
  profitPct: number;
}

let nextId = 1;
export const genId = () => String(nextId++);
