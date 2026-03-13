"use client";

import { useState, useMemo } from "react";
import { PRESETS, genId, type Scenario } from "./lib/data";
import { calcRows } from "./lib/calc";
import Header from "./components/Header";
import Controls from "./components/Controls";
import ScenarioCard from "./components/ScenarioCard";
import SummaryCards from "./components/SummaryCards";
import ResultTable from "./components/ResultTable";

export default function Home() {
  const [years, setYears] = useState("20");
  const [startYear, setStartYear] = useState(2026);
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
      const rows = calcRows(monthly, initial, s.presetId, fixedRate, totalYears, startYear);
      return { scenario: s, rows, summary: rows[rows.length - 1], preset };
    }),
    [scenarios, totalYears, startYear],
  );

  const addScenario = () => {
    if (scenarios.length >= 4) return;
    setScenarios((p) => [...p, { id: genId(), presetId: "sp500", customReturn: "10", monthly: "5000", initial: "0" }]);
  };

  const removeScenario = (id: string) => setScenarios((p) => p.filter((s) => s.id !== id));

  const updateScenario = (id: string, patch: Partial<Scenario>) =>
    setScenarios((p) => p.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Header />

        <Controls
          years={years}
          totalYears={totalYears}
          startYear={startYear}
          scenarioCount={scenarios.length}
          onYearsChange={setYears}
          onStartYearChange={setStartYear}
          onAddScenario={addScenario}
        />

        <div className={`mb-8 grid gap-4 ${scenarios.length > 1 ? "sm:grid-cols-2" : "sm:grid-cols-1 max-w-xl"}`}>
          {scenarios.map((s, idx) => (
            <ScenarioCard
              key={s.id}
              scenario={s}
              index={idx}
              showRemove={scenarios.length > 1}
              onRemove={() => removeScenario(s.id)}
              onUpdate={(patch) => updateScenario(s.id, patch)}
            />
          ))}
        </div>

        <SummaryCards computed={computed} />

        <ResultTable computed={computed} totalYears={totalYears} />

        <p className="mt-4 text-center text-xs text-slate-600">
          ข้อมูลจริงปี 2004–2025 · ปีที่ไม่มีข้อมูล (avg) ใช้ค่าเฉลี่ย 22 ปีย้อนหลัง · ไม่ใช่คำแนะนำการลงทุน
        </p>
      </div>
    </div>
  );
}
