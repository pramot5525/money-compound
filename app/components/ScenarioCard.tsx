import { PRESETS, SCENARIO_COLORS, type Scenario } from "../lib/data";
import { avgReturn } from "../lib/calc";

interface ScenarioCardProps {
  scenario: Scenario;
  index: number;
  showRemove: boolean;
  onRemove: () => void;
  onUpdate: (patch: Partial<Scenario>) => void;
}

export default function ScenarioCard({ scenario, index, showRemove, onRemove, onUpdate }: ScenarioCardProps) {
  const col = SCENARIO_COLORS[index];
  const preset = PRESETS.find((p) => p.id === scenario.presetId);

  return (
    <div className={`rounded-2xl bg-slate-800/50 p-4 ring-1 ${col.ring}`}>
      {/* Card header */}
      <div className="mb-3 flex items-center justify-between">
        <span className={`text-xs font-bold uppercase tracking-widest ${col.text}`}>พอร์ต {index + 1}</span>
        {showRemove && (
          <button onClick={onRemove} className="text-slate-500 hover:text-red-400">✕</button>
        )}
      </div>

      {/* Preset selector */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => onUpdate({ presetId: p.id })}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              scenario.presetId === p.id
                ? `${p.bgColor} ${p.textColor} ring-1 ${p.ringColor}`
                : "bg-slate-700/50 text-slate-400 hover:bg-slate-700"
            }`}
          >
            {p.emoji} {p.ticker}
          </button>
        ))}
        <button
          onClick={() => onUpdate({ presetId: "custom" })}
          className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
            scenario.presetId === "custom"
              ? "bg-slate-500/20 text-slate-200 ring-1 ring-slate-400"
              : "bg-slate-700/50 text-slate-400 hover:bg-slate-700"
          }`}
        >
          ✏️ Custom
        </button>
      </div>

      {/* Info bar */}
      <div className="mb-3 rounded-xl bg-slate-900/60 px-3 py-2">
        {scenario.presetId === "custom" ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">ผลตอบแทนคงที่/ปี</span>
            <input
              type="number" min="0" max="500" step="0.1"
              value={scenario.customReturn}
              onChange={(e) => onUpdate({ customReturn: e.target.value })}
              className="w-16 bg-transparent text-right text-sm font-bold text-white outline-none"
            />
            <span className="text-xs text-slate-400">%</span>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">{preset?.name} · {preset?.desc}</span>
            <span className={`text-xs font-semibold ${preset?.textColor}`}>
              avg {avgReturn(scenario.presetId).toFixed(1)}%/ปี · ข้อมูลจริง 2004–2025
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
            value={scenario.initial}
            onChange={(e) => onUpdate({ initial: e.target.value })}
            className="w-full rounded-lg bg-slate-700/50 px-3 py-2 text-sm font-semibold text-white outline-none focus:ring-1 focus:ring-slate-500"
            placeholder="0"
          />
        </div>
        <div>
          <label className="mb-1 block text-[10px] text-slate-500">DCA ต่อเดือน (฿)</label>
          <input
            type="number" min="0"
            value={scenario.monthly}
            onChange={(e) => onUpdate({ monthly: e.target.value })}
            className="w-full rounded-lg bg-slate-700/50 px-3 py-2 text-sm font-semibold text-white outline-none focus:ring-1 focus:ring-slate-500"
            placeholder="5000"
          />
        </div>
      </div>
    </div>
  );
}
