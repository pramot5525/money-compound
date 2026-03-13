"use client";

import { useState, useMemo } from "react";

// ผลตอบแทนรายปีจริง (Annual Total Return %) ปี 2004–2024
// Source: Yahoo Finance / Bloomberg (approximate)
const START_YEAR = 2004;
const HISTORICAL: Record<string, number[]> = {
  sp500: [10.9, 4.9, 15.8, 5.5, -37.0, 26.5, 15.1, 2.1, 16.0, 32.4, 13.7, 1.4, 12.0, 21.8, -4.4, 31.5, 18.4, 28.7, -18.1, 26.3, 25.0, 17.9],
  qqq:   [10.4, 1.5, 6.8, 19.2, -41.7, 54.7, 20.0, 3.3, 18.1, 36.6, 19.1, 9.5, 6.9, 32.7, -0.1, 39.1, 48.6, 27.3, -32.6, 54.8, 25.6, 21.6],
  set50: [13.0, 5.0, 0.7, 28.0, -47.0, 64.0, 41.0, -1.0, 36.0, -7.0, 20.0, -13.0, 22.0, 13.0, -11.0, 1.0, -9.0, 14.0, -5.0, -15.0, -12.0, -2.8],
  aapl:  [25.5, 123.3, 18.1, 133.5, -56.9, 146.9, 53.1, 25.6, 32.6, 5.4, 40.6, -3.0, 12.5, 48.5, -5.4, 88.9, 82.3, 34.7, -26.4, 48.2, 30.1, 14.2],
  nvda:  [20.0, 10.0, 15.0, -30.0, -78.0, 50.0, 13.0, 5.0, 8.0, 24.0, 3.0, 64.0, 224.0, 81.0, -31.0, 76.0, 122.0, 125.0, -50.0, 239.0, 171.0, 52.4],
  gold:  [5.5, 9.0, 23.2, 31.4, 5.5, 24.0, 29.5, 10.3, 7.0, -28.3, -1.5, -10.4, 8.5, 13.1, -1.6, 18.3, 25.0, -3.6, -0.3, 13.1, 27.2, 11.5],
};

const PRESETS = [
  { id: "sp500", ticker: "S&P 500", name: "S&P 500 Index",  emoji: "🇺🇸", textColor: "text-blue-400",   bgColor: "bg-blue-500/10",   ringColor: "ring-blue-500",   desc: "US Large Cap" },
  { id: "qqq",   ticker: "QQQ",     name: "Nasdaq 100",     emoji: "💻", textColor: "text-violet-400", bgColor: "bg-violet-500/10", ringColor: "ring-violet-500", desc: "US Tech" },
  { id: "set50", ticker: "SET50",   name: "SET50 Index",    emoji: "🇹🇭", textColor: "text-amber-400",  bgColor: "bg-amber-500/10",  ringColor: "ring-amber-500",  desc: "Thai Large Cap" },
  { id: "aapl",  ticker: "AAPL",    name: "Apple Inc.",     emoji: "🍎", textColor: "text-slate-300",  bgColor: "bg-slate-500/10",  ringColor: "ring-slate-400",  desc: "US Stock" },
  { id: "nvda",  ticker: "NVDA",    name: "NVIDIA Corp.",   emoji: "🟢", textColor: "text-green-400",  bgColor: "bg-green-500/10",  ringColor: "ring-green-500",  desc: "US Stock" },
  { id: "gold",  ticker: "GOLD",    name: "ทองคำ",          emoji: "🥇", textColor: "text-yellow-400", bgColor: "bg-yellow-500/10", ringColor: "ring-yellow-500", desc: "Commodity" },
] as const;

type PresetId = (typeof PRESETS)[number]["id"] | "custom";

interface Scenario {
  id: string;
  presetId: PresetId;
  customReturn: string;
  monthly: string;
  initial: string;
}

interface YearRow {
  year: number;
  calYear: number;
  yearReturn: number;  // actual return % for that year
  isCycled: boolean;
  totalInvested: number;
  portfolioValue: number;
  profit: number;
  profitPct: number;
}

function calcRows(monthly: number, initial: number, presetId: PresetId, fixedRate: number, totalYears: number): YearRow[] {
  const returns = presetId !== "custom" ? HISTORICAL[presetId] : null;
  const rows: YearRow[] = [];
  let portfolio = initial;
  let totalInvested = initial;

  for (let y = 0; y < totalYears; y++) {
    const idx = returns ? y % returns.length : 0;
    const yearReturn = returns ? returns[idx] : fixedRate;
    const isCycled = returns ? y >= returns.length : false;

    // Apply this year's return monthly (geometric monthly rate)
    const monthlyRate = Math.pow(1 + yearReturn / 100, 1 / 12) - 1;
    for (let m = 0; m < 12; m++) {
      portfolio = portfolio * (1 + monthlyRate) + monthly;
      totalInvested += monthly;
    }

    const profit = portfolio - totalInvested;
    const profitPct = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;
    rows.push({
      year: y + 1,
      calYear: START_YEAR + (returns ? idx : y),
      yearReturn,
      isCycled,
      totalInvested,
      portfolioValue: portfolio,
      profit,
      profitPct,
    });
  }
  return rows;
}

function fmt(v: number) {
  if (Math.abs(v) >= 1_000_000_000) return (v / 1_000_000_000).toFixed(2) + "B";
  if (Math.abs(v) >= 1_000_000) return (v / 1_000_000).toFixed(2) + "M";
  return v.toLocaleString("th-TH", { maximumFractionDigits: 0 });
}

function fmtFull(v: number) {
  return v.toLocaleString("th-TH", { maximumFractionDigits: 0 });
}

let nextId = 1;
const genId = () => String(nextId++);

const SCENARIO_COLORS = [
  { text: "text-emerald-400", bg: "bg-emerald-500/10", ring: "ring-emerald-500" },
  { text: "text-sky-400",     bg: "bg-sky-500/10",     ring: "ring-sky-500" },
  { text: "text-rose-400",    bg: "bg-rose-500/10",    ring: "ring-rose-500" },
  { text: "text-orange-400",  bg: "bg-orange-500/10",  ring: "ring-orange-500" },
];

export default function Home() {
  const [years, setYears] = useState("20");
  const [scenarios, setScenarios] = useState<Scenario[]>([
    { id: genId(), presetId: "sp500", customReturn: "10", monthly: "5000", initial: "0" },
  ]);

  const totalYears = Math.min(99, Math.max(1, Number(years) || 1));

  const computed = useMemo(() =>
    scenarios.map((s) => {
      const preset = PRESETS.find((p) => p.id === s.presetId);
      const fixedRate = Math.max(0, Number(s.customReturn) || 0);
      const monthly = Math.max(0, Number(s.monthly) || 0);
      const initial = Math.max(0, Number(s.initial) || 0);
      const rows = calcRows(monthly, initial, s.presetId, fixedRate, totalYears);
      return { scenario: s, rows, summary: rows[rows.length - 1], preset };
    }),
    [scenarios, totalYears]
  );

  const addScenario = () => {
    if (scenarios.length >= 4) return;
    setScenarios((p) => [...p, { id: genId(), presetId: "sp500", customReturn: "10", monthly: "5000", initial: "0" }]);
  };

  const removeScenario = (id: string) => setScenarios((p) => p.filter((s) => s.id !== id));

  const updateScenario = (id: string, patch: Partial<Scenario>) =>
    setScenarios((p) => p.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const isSingle = scenarios.length === 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">DCA Calculator</h1>
          <p className="mt-1 text-sm text-slate-400">
            อิงข้อมูลผลตอบแทนรายปีจริง 2004–2024 · Dollar Cost Averaging
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">ระยะเวลา</span>
            <div className="flex items-center gap-2 rounded-xl bg-slate-800/60 px-4 py-2 ring-1 ring-slate-700">
              <input
                type="number" min="1" max="99"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="w-14 bg-transparent text-center text-xl font-bold text-white outline-none"
              />
              <span className="text-slate-400">ปี</span>
            </div>
            {totalYears > 20 && (
              <span className="text-xs text-amber-500/80">* เกิน 20 ปี ใช้ข้อมูลซ้ำตั้งแต่ปี 2004</span>
            )}
          </div>
          <button
            onClick={addScenario}
            disabled={scenarios.length >= 4}
            className="flex items-center gap-1.5 rounded-xl bg-slate-700 px-4 py-2 text-sm font-medium transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            + เพิ่มพอร์ต
          </button>
        </div>

        {/* Scenario Cards */}
        <div className={`mb-8 grid gap-4 ${scenarios.length > 1 ? "sm:grid-cols-2" : "sm:grid-cols-1 max-w-xl"}`}>
          {scenarios.map((s, idx) => {
            const col = SCENARIO_COLORS[idx];
            const preset = PRESETS.find((p) => p.id === s.presetId);
            return (
              <div key={s.id} className={`rounded-2xl bg-slate-800/50 p-4 ring-1 ${col.ring}`}>
                <div className="mb-3 flex items-center justify-between">
                  <span className={`text-xs font-bold uppercase tracking-widest ${col.text}`}>พอร์ต {idx + 1}</span>
                  {scenarios.length > 1 && (
                    <button onClick={() => removeScenario(s.id)} className="text-slate-500 hover:text-red-400">✕</button>
                  )}
                </div>

                {/* Preset Buttons */}
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => updateScenario(s.id, { presetId: p.id })}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                        s.presetId === p.id
                          ? `${p.bgColor} ${p.textColor} ring-1 ${p.ringColor}`
                          : "bg-slate-700/50 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      {p.emoji} {p.ticker}
                    </button>
                  ))}
                  <button
                    onClick={() => updateScenario(s.id, { presetId: "custom" })}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      s.presetId === "custom"
                        ? "bg-slate-500/20 text-slate-200 ring-1 ring-slate-400"
                        : "bg-slate-700/50 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    ✏️ Custom
                  </button>
                </div>

                {/* Info bar */}
                <div className="mb-3 rounded-xl bg-slate-900/60 px-3 py-2">
                  {s.presetId === "custom" ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">ผลตอบแทนคงที่/ปี</span>
                      <input
                        type="number" min="0" max="500" step="0.1"
                        value={s.customReturn}
                        onChange={(e) => updateScenario(s.id, { customReturn: e.target.value })}
                        className="w-16 bg-transparent text-right text-sm font-bold text-white outline-none"
                      />
                      <span className="text-xs text-slate-400">%</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{preset?.name} · {preset?.desc}</span>
                      <span className={`text-xs font-semibold ${preset?.textColor}`}>
                        ผลตอบแทนจริงรายปี 2004–2024
                      </span>
                    </div>
                  )}
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-[10px] text-slate-500">เงินก้อนเริ่มต้น (฿)</label>
                    <input
                      type="number" min="0"
                      value={s.initial}
                      onChange={(e) => updateScenario(s.id, { initial: e.target.value })}
                      className="w-full rounded-lg bg-slate-700/50 px-3 py-2 text-sm font-semibold text-white outline-none focus:ring-1 focus:ring-slate-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] text-slate-500">DCA ต่อเดือน (฿)</label>
                    <input
                      type="number" min="0"
                      value={s.monthly}
                      onChange={(e) => updateScenario(s.id, { monthly: e.target.value })}
                      className="w-full rounded-lg bg-slate-700/50 px-3 py-2 text-sm font-semibold text-white outline-none focus:ring-1 focus:ring-slate-500"
                      placeholder="5000"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className={`mb-6 grid gap-3`} style={{ gridTemplateColumns: `repeat(${computed.length}, 1fr)` }}>
          {computed.map(({ scenario, summary, preset }, idx) => {
            const col = SCENARIO_COLORS[idx];
            const label = scenario.presetId === "custom" ? `Custom` : (preset?.ticker ?? "");
            return (
              <div key={scenario.id} className={`rounded-2xl bg-slate-800/50 p-4 ring-1 ${col.ring}`}>
                <p className={`mb-2 text-xs font-bold uppercase tracking-widest ${col.text}`}>{label}</p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">ลงทุนรวม</span><span className="text-slate-300">฿{fmtFull(summary.totalInvested)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">มูลค่าพอร์ต</span><span className={`font-bold ${col.text}`}>฿{fmtFull(summary.portfolioValue)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">กำไรสุทธิ</span><span className="text-white">฿{fmtFull(summary.profit)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">ผลตอบแทนรวม</span><span className={`font-bold ${col.text}`}>{summary.profitPct.toFixed(0)}%</span></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl ring-1 ring-slate-700">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800 text-xs text-slate-400">
                  <th className="px-3 py-3 text-left font-medium">ปี</th>
                  <th className="px-3 py-3 text-left font-medium">ค.ศ.</th>
                  {isSingle ? (
                    <>
                      <th className="px-3 py-3 text-right font-medium">ผลตอบแทนปีนั้น</th>
                      <th className="px-3 py-3 text-right font-medium">ลงทุนสะสม</th>
                      <th className="px-3 py-3 text-right font-medium">มูลค่าพอร์ต</th>
                      <th className="px-3 py-3 text-right font-medium">กำไรรวม %</th>
                    </>
                  ) : (
                    computed.map(({ scenario, preset }, idx) => {
                      const col = SCENARIO_COLORS[idx];
                      const label = scenario.presetId === "custom" ? "Custom" : (preset?.ticker ?? "");
                      return (
                        <th key={scenario.id} colSpan={2} className={`px-3 py-3 text-right font-medium ${col.text}`}>
                          {label}
                        </th>
                      );
                    })
                  )}
                </tr>
                {!isSingle && (
                  <tr className="border-t border-slate-700/50 bg-slate-800/60 text-[10px] text-slate-500">
                    <td className="px-3 py-1.5" colSpan={2}></td>
                    {computed.map(({ scenario }) => (
                      <>
                        <td key={`${scenario.id}-r`} className="px-3 py-1.5 text-right">ผลตอบแทนปีนั้น</td>
                        <td key={`${scenario.id}-v`} className="px-3 py-1.5 text-right">มูลค่าพอร์ต</td>
                      </>
                    ))}
                  </tr>
                )}
              </thead>
              <tbody>
                {Array.from({ length: totalYears }, (_, yi) => (
                  <tr
                    key={yi}
                    className={`border-t border-slate-800 transition-colors hover:bg-slate-800/50 ${yi % 2 === 0 ? "bg-slate-900/40" : "bg-slate-900/10"}`}
                  >
                    <td className="px-3 py-2 text-slate-400">{yi + 1}</td>
                    <td className="px-3 py-2 text-slate-500 text-xs">
                      {computed[0].rows[yi].calYear}
                      {computed[0].rows[yi].isCycled && <span className="ml-0.5 text-amber-600">*</span>}
                    </td>

                    {isSingle ? (() => {
                      const row = computed[0].rows[yi];
                      const isPos = row.yearReturn >= 0;
                      return (
                        <>
                          <td className="px-3 py-2 text-right">
                            <span className={`inline-flex items-center gap-0.5 rounded-md px-2 py-0.5 text-xs font-bold ${
                              isPos ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
                            }`}>
                              {isPos ? "▲" : "▼"} {Math.abs(row.yearReturn).toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-3 py-2 text-right text-slate-400">฿{fmt(row.totalInvested)}</td>
                          <td className="px-3 py-2 text-right font-semibold text-emerald-400">฿{fmt(row.portfolioValue)}</td>
                          <td className="px-3 py-2 text-right">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${row.profitPct >= 0 ? "bg-sky-500/10 text-sky-400" : "bg-red-500/10 text-red-400"}`}>
                              {row.profitPct >= 0 ? "+" : ""}{row.profitPct.toFixed(0)}%
                            </span>
                          </td>
                        </>
                      );
                    })() : (
                      computed.map(({ scenario, rows }, idx) => {
                        const col = SCENARIO_COLORS[idx];
                        const row = rows[yi];
                        const isPos = row.yearReturn >= 0;
                        return (
                          <>
                            <td key={`${scenario.id}-r`} className="px-3 py-2 text-right">
                              <span className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-bold ${
                                isPos ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
                              }`}>
                                {isPos ? "▲" : "▼"} {Math.abs(row.yearReturn).toFixed(1)}%
                              </span>
                            </td>
                            <td key={`${scenario.id}-v`} className={`px-3 py-2 text-right font-semibold ${col.text}`}>
                              ฿{fmt(row.portfolioValue)}
                            </td>
                          </>
                        );
                      })
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-600">
          * ผลตอบแทนอ้างอิงข้อมูลจริงปี 2004–2024 · หากลงทุนเกิน 20 ปี ข้อมูลจะวนซ้ำตั้งแต่ปี 2004 (เครื่องหมาย *)
          · ไม่ใช่คำแนะนำการลงทุน
        </p>
      </div>
    </div>
  );
}
