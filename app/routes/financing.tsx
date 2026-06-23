import { useEffect, useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { SiteLayout } from "~/festa/components/SiteLayout";
import { useFestaConfig } from "~/festa/hooks/use-festa-config";
import { festaApi } from "~/festa/lib/api";
import { formatFullPrice, monthlyPayment } from "~/festa/lib/format";
import type { Unit } from "~/festa/lib/types";

export function meta() {
  return [{ title: "Financing Calculator — Festa" }];
}

export default function FinancingPage() {
  const { config } = useFestaConfig();
  const [price, setPrice] = useState(500000);
  const [downPct, setDownPct] = useState(config.defaultDownPaymentPercent);
  const [rate, setRate] = useState(config.defaultInterestRate);
  const [years, setYears] = useState(config.defaultTenureYears);
  const [units, setUnits] = useState<Unit[]>([]);

  useEffect(() => {
    setDownPct(config.defaultDownPaymentPercent);
    setRate(config.defaultInterestRate);
    setYears(config.defaultTenureYears);
  }, [config.defaultDownPaymentPercent, config.defaultInterestRate, config.defaultTenureYears]);

  useEffect(() => {
    (async () => {
      const res = await festaApi.listUnits({ availability: "available" });
      if (res.success && res.data) {
        setUnits(res.data);
        if (res.data[0]) setPrice(res.data[0].price);
      }
    })();
  }, []);

  const down = useMemo(() => price * (downPct / 100), [price, downPct]);
  const principal = price - down;
  const monthly = useMemo(() => monthlyPayment(principal, rate, years), [principal, rate, years]);
  const totalPaid = monthly * years * 12 + down;
  const totalInterest = totalPaid - price;
  const cur = config.currencySymbol;

  return (
    <SiteLayout>
      <div className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Affordability</p>
          <h1 className="mt-1.5 inline-flex items-center gap-2.5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            <Calculator className="h-7 w-7 text-primary" />
            Financing Calculator
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Estimate your monthly payment. Figures are indicative — your advisor confirms final terms.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Inputs */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            {units.length > 0 && (
              <label className="mb-5 block">
                <span className="mb-1.5 block text-xs font-semibold text-foreground">Pick a unit</span>
                <select
                  className="festa-input"
                  onChange={(e) => {
                    const u = units.find((x) => x._id === e.target.value);
                    if (u) setPrice(u.price);
                  }}
                >
                  <option value="">Custom price</option>
                  {units.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} — {formatFullPrice(u.price, cur)}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <SliderField
              label="Property price"
              value={price}
              min={50000}
              max={2000000}
              step={5000}
              onChange={setPrice}
              display={formatFullPrice(price, cur)}
            />
            <SliderField
              label="Down payment"
              value={downPct}
              min={0}
              max={80}
              step={1}
              onChange={setDownPct}
              display={`${downPct}% · ${formatFullPrice(down, cur)}`}
            />
            <SliderField
              label="Interest rate"
              value={rate}
              min={1}
              max={20}
              step={0.1}
              onChange={setRate}
              display={`${rate.toFixed(1)}%`}
            />
            <SliderField
              label="Loan tenure"
              value={years}
              min={1}
              max={30}
              step={1}
              onChange={setYears}
              display={`${years} years`}
            />
          </div>

          {/* Result */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl bg-primary p-7 text-primary-foreground shadow-sm">
              <p className="text-sm font-medium uppercase tracking-wide text-primary-foreground/80">
                Estimated monthly payment
              </p>
              <p className="mt-2 text-4xl font-extrabold">
                {formatFullPrice(Math.round(monthly), cur)}
                <span className="text-lg font-medium opacity-80"> /mo</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ResultCard label="Down payment" value={formatFullPrice(Math.round(down), cur)} />
              <ResultCard label="Loan amount" value={formatFullPrice(Math.round(principal), cur)} />
              <ResultCard label="Total interest" value={formatFullPrice(Math.round(totalInterest), cur)} />
              <ResultCard label="Total payable" value={formatFullPrice(Math.round(totalPaid), cur)} />
            </div>

            <p className="text-xs text-muted-foreground">
              Estimates use standard amortization and your inputs above. They are not an offer of
              credit.
            </p>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
}) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="text-sm font-bold text-primary">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
      />
    </div>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-extrabold text-foreground">{value}</p>
    </div>
  );
}
