interface ControlsProps {
  years: string;
  totalYears: number;
  startYear: number;
  scenarioCount: number;
  onYearsChange: (v: string) => void;
  onStartYearChange: (v: number) => void;
  onAddScenario: () => void;
}

export default function Controls({
  years,
  totalYears,
  startYear,
  scenarioCount,
  onYearsChange,
  onStartYearChange,
  onAddScenario,
}: ControlsProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Start year */}
        <div className="flex items-center gap-2 rounded-xl bg-slate-800/60 px-4 py-2 ring-1 ring-slate-700">
          <span className="text-sm text-slate-400">เริ่มปี</span>
          <input
            type="number"
            min="2004"
            max="2100"
            value={startYear}
            onChange={(e) => onStartYearChange(Number(e.target.value) || 2026)}
            className="w-16 bg-transparent text-center text-xl font-bold text-white outline-none"
          />
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2 rounded-xl bg-slate-800/60 px-4 py-2 ring-1 ring-slate-700">
          <span className="text-sm text-slate-400">นาน</span>
          <input
            type="number"
            min="1"
            max="99"
            value={years}
            onChange={(e) => onYearsChange(e.target.value)}
            className="w-14 bg-transparent text-center text-xl font-bold text-white outline-none"
          />
          <span className="text-slate-400">ปี</span>
        </div>

        <span className="text-xs text-slate-500">
          ถึงปี {startYear + totalYears - 1}
        </span>
      </div>

      <button
        onClick={onAddScenario}
        disabled={scenarioCount >= 4}
        className="flex items-center gap-1.5 rounded-xl bg-slate-700 px-4 py-2 text-sm font-medium transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        + เพิ่มพอร์ต
      </button>
    </div>
  );
}
