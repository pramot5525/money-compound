import { SCENARIO_COLORS, type Scenario, type YearRow } from "../lib/data";
import { fmtFull } from "../lib/calc";

interface ComputedScenario {
  scenario: Scenario;
  rows: YearRow[];
  summary: YearRow;
  preset: { ticker: string } | undefined;
}

interface SummaryCardsProps {
  computed: ComputedScenario[];
}

export default function SummaryCards({ computed }: SummaryCardsProps) {
  return (
    <div
      className="mb-6 grid gap-3"
      style={{ gridTemplateColumns: `repeat(${computed.length}, 1fr)` }}
    >
      {computed.map(({ scenario, summary, preset }, idx) => {
        const col = SCENARIO_COLORS[idx];
        const label = scenario.presetId === "custom" ? "Custom" : (preset?.ticker ?? "");
        return (
          <div key={scenario.id} className={`rounded-2xl bg-slate-800/50 p-4 ring-1 ${col.ring}`}>
            <p className={`mb-2 text-xs font-bold uppercase tracking-widest ${col.text}`}>{label}</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">ลงทุนรวม</span>
                <span className="text-slate-300">฿{fmtFull(summary.totalInvested)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">มูลค่าพอร์ต</span>
                <span className={`font-bold ${col.text}`}>฿{fmtFull(summary.portfolioValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">กำไรสุทธิ</span>
                <span className="text-white">฿{fmtFull(summary.profit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ผลตอบแทนรวม</span>
                <span className={`font-bold ${col.text}`}>{summary.profitPct.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
