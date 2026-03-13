import { SCENARIO_COLORS, type Scenario, type YearRow } from "../lib/data";
import { fmt } from "../lib/calc";

interface ComputedScenario {
  scenario: Scenario;
  rows: YearRow[];
  preset: { ticker: string } | undefined;
}

interface ResultTableProps {
  computed: ComputedScenario[];
  totalYears: number;
}

function ReturnBadge({ value, projected }: { value: number; projected: boolean }) {
  const isPos = value >= 0;
  if (projected) {
    return (
      <span className="inline-flex items-center gap-0.5 rounded-md px-2 py-0.5 text-xs font-bold bg-slate-700/60 text-slate-400">
        ~ {Math.abs(value).toFixed(1)}%
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-md px-2 py-0.5 text-xs font-bold ${
      isPos ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
    }`}>
      {isPos ? "▲" : "▼"} {Math.abs(value).toFixed(1)}%
    </span>
  );
}

function GainBadge({ value }: { value: number }) {
  const isPos = value >= 0;
  return (
    <span className={`text-xs font-medium ${isPos ? "text-emerald-400" : "text-red-400"}`}>
      {isPos ? "+" : ""}฿{fmt(value)}
    </span>
  );
}

export default function ResultTable({ computed, totalYears }: ResultTableProps) {
  const isSingle = computed.length === 1;
  const n = computed.length;

  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-slate-700">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800 text-xs text-slate-400">
              <th className="px-3 py-3 text-left font-medium">ปี</th>
              <th className="px-3 py-3 text-left font-medium">ค.ศ.</th>
              {isSingle ? (
                <>
                  <th className="px-3 py-3 text-right font-medium">ผลตอบแทน%</th>
                  <th className="px-3 py-3 text-right font-medium">กำไรปีนั้น</th>
                  <th className="px-3 py-3 text-right font-medium">ลงทุนสะสม</th>
                  <th className="px-3 py-3 text-right font-medium">มูลค่าพอร์ต</th>
                  <th className="px-3 py-3 text-right font-medium">กำไรรวม %</th>
                </>
              ) : (
                <>
                  <th className="px-3 py-3 text-left font-medium">กองทุน</th>
                  <th className="px-3 py-3 text-right font-medium">%</th>
                  <th className="px-3 py-3 text-right font-medium">กำไรปีนั้น</th>
                  <th className="px-3 py-3 text-right font-medium">เงินลงทุน</th>
                  <th className="px-3 py-3 text-right font-medium">มูลค่าพอร์ต</th>
                  <th className="px-3 py-3 text-right font-medium text-white">รวมทุกพอร์ต</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: totalYears }, (_, yi) => {
              const firstRow = computed[0].rows[yi];
              const isProjectedRow = firstRow.isProjected;
              const rowBg = isProjectedRow
                ? "bg-slate-900/60 opacity-80"
                : yi % 2 === 0 ? "bg-slate-900/40" : "bg-slate-900/10";

              if (isSingle) {
                const row = computed[0].rows[yi];
                return (
                  <tr key={yi} className={`border-t border-slate-800 transition-colors hover:bg-slate-800/50 ${rowBg}`}>
                    <td className="px-3 py-2 text-slate-400">{yi + 1}</td>
                    <td className="px-3 py-2 text-xs text-slate-500">
                      {row.calYear}
                      {isProjectedRow && (
                        <span className="ml-1 rounded bg-slate-700 px-1 py-0.5 text-[9px] text-slate-400">avg</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <ReturnBadge value={row.yearReturn} projected={row.isProjected} />
                    </td>
                    <td className="px-3 py-2 text-right"><GainBadge value={row.yearGain} /></td>
                    <td className="px-3 py-2 text-right text-slate-400">฿{fmt(row.totalInvested)}</td>
                    <td className="px-3 py-2 text-right font-semibold text-emerald-400">฿{fmt(row.portfolioValue)}</td>
                    <td className="px-3 py-2 text-right">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        row.profitPct >= 0 ? "bg-sky-500/10 text-sky-400" : "bg-red-500/10 text-red-400"
                      }`}>
                        {row.profitPct >= 0 ? "+" : ""}{row.profitPct.toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                );
              }

              // Multi-scenario: N sub-rows per year, total column spans all sub-rows
              const totalPortfolio = computed.reduce((s, { rows }) => s + rows[yi].portfolioValue, 0);

              return computed.map(({ scenario, rows, preset }, si) => {
                const col = SCENARIO_COLORS[si];
                const row = rows[yi];
                const label = scenario.presetId === "custom" ? "Custom" : (preset?.ticker ?? "");
                const isFirst = si === 0;
                return (
                  <tr
                    key={`${yi}-${scenario.id}`}
                    className={`transition-colors hover:bg-slate-800/50 ${isFirst ? `border-t border-slate-800 ${rowBg}` : rowBg}`}
                  >
                    {isFirst && (
                      <>
                        <td rowSpan={n} className="px-3 py-2 align-middle text-slate-400 border-r border-slate-800">
                          {yi + 1}
                        </td>
                        <td rowSpan={n} className="px-3 py-2 text-xs align-middle text-slate-500 border-r border-slate-800">
                          {firstRow.calYear}
                          {isProjectedRow && (
                            <span className="ml-1 rounded bg-slate-700 px-1 py-0.5 text-[9px] text-slate-400">avg</span>
                          )}
                        </td>
                      </>
                    )}
                    <td className="px-3 py-1.5">
                      <span className={`text-xs font-bold ${col.text}`}>{label}</span>
                    </td>
                    <td className="px-3 py-1.5 text-right">
                      <ReturnBadge value={row.yearReturn} projected={row.isProjected} />
                    </td>
                    <td className="px-3 py-1.5 text-right">
                      <GainBadge value={row.yearGain} />
                    </td>
                    <td className="px-3 py-1.5 text-right text-slate-400">
                      ฿{fmt(row.totalInvested)}
                    </td>
                    <td className={`px-3 py-1.5 text-right font-semibold ${col.text}`}>
                      ฿{fmt(row.portfolioValue)}
                    </td>
                    {isFirst && (
                      <td rowSpan={n} className="px-3 py-2 align-middle text-right font-bold text-white border-l border-slate-800">
                        ฿{fmt(totalPortfolio)}
                      </td>
                    )}
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
