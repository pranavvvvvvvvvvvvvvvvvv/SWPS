import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";


const PARAMS = {
  tds: { label: "TDS", unit: "ppm", color: "hsl(var(--chart-1))", fill: "hsl(var(--chart-1) / 0.16)" },
  turbidity: { label: "Turbidity", unit: "NTU", color: "hsl(var(--chart-2))", fill: "hsl(var(--chart-2) / 0.16)" },
  temperature: { label: "Temperature", unit: "°C", color: "hsl(var(--chart-3))", fill: "hsl(var(--chart-3) / 0.16)" },
  level: { label: "Water level", unit: "%", color: "hsl(var(--chart-5))", fill: "hsl(var(--chart-5) / 0.16)" },
};

export const CHART_PARAMS = PARAMS;

export default function ReadingsChart({ data = [], parameter = "tds", limit, rangeKey = "24h", height = 260 }) {
  const config = PARAMS[parameter] || PARAMS.tds;

  // animate the first render only; live refreshes then update instantly
  const [introAnim, setIntroAnim] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setIntroAnim(false), 1800);
    return () => clearTimeout(t);
  }, []);

  const series = useMemo(
    () =>
      [...data]
        .filter((r) => r[parameter] !== null && r[parameter] !== undefined)
        .sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at))
        .map((r) => ({
          ts: new Date(r.recorded_at).getTime(),
          label:
            rangeKey === "1h" || rangeKey === "24h"
              ? format(new Date(r.recorded_at), "HH:mm")
              : format(new Date(r.recorded_at), "d MMM"),
          value: Number(r[parameter]),
          unsafe: r.decision === "unsafe",
        })),
    [data, parameter, rangeKey]
  );

  if (!series.length) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border text-center"
        style={{ height }}
      >
        <p className="text-[12.5px] font-medium text-muted-foreground">No readings in this range</p>
        <p className="mt-1 text-[11px] text-muted-foreground/70">
          Run the device simulator to generate fresh data.
        </p>
      </div>
    );
  }

  return (
    <div style={{ height }} className="-ml-2 w-full min-w-0 overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 8, right: 10, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`fill-${parameter}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={config.color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={config.color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            minTickGap={28}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            width={42}
            domain={["auto", "auto"]}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid hsl(var(--border))",
              background: "hsl(var(--card))",
              fontSize: 11.5,
              color: "hsl(var(--card-foreground))",
              boxShadow: "0 8px 30px -12px rgba(4,32,40,0.35)",
            }}
            formatter={(value) => [`${value} ${config.unit}`, config.label]}
            labelFormatter={(label, payload) =>
              payload?.[0]?.payload?.unsafe ? `${label} · unsafe` : label
            }
          />
          {limit !== undefined && limit !== null && (
            <ReferenceLine
              y={limit}
              stroke="hsl(var(--destructive))"
              strokeDasharray="4 4"
              strokeOpacity={0.6}
              label={{
                value: `limit ${limit}`,
                position: "insideTopRight",
                fontSize: 9.5,
                fill: "hsl(var(--destructive))",
              }}
            />
          )}
          <Area
            type="monotone"
            dataKey="value"
            stroke={config.color}
            strokeWidth={1.8}
            fill={`url(#fill-${parameter})`}
            dot={false}
            activeDot={{ r: 3, strokeWidth: 0 }}
            isAnimationActive={introAnim}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
