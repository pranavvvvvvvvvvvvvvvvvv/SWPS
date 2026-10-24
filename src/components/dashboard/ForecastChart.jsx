import { useMemo } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";

export default function ForecastChart({
  history = [],
  forecast = [],
  unit = "",
  label = "Value",
  color = "hsl(var(--chart-1))",
  limit,
  height = 280,
}) {
  const rows = useMemo(() => {
    const span = history.length > 1 ? history[history.length - 1].ts - history[0].ts : 0;
    const tick = span > 36 * 3600000 ? "d MMM HH:mm" : "HH:mm";

    const observed = history.map((p) => ({ ts: p.ts, label: format(new Date(p.ts), tick), observed: p.value }));
    const predicted = forecast.map((p) => ({ ts: p.ts, label: format(new Date(p.ts), tick), predicted: p.value }));
    const combined = [...observed, ...predicted];

    // anchor the dashed forecast at the last real sample so the lines join
    if (observed.length && predicted.length) {
      combined[observed.length - 1] = { ...combined[observed.length - 1], predicted: observed[observed.length - 1].observed };
    }
    return combined;
  }, [history, forecast]);

  if (!rows.length) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border text-center"
        style={{ height }}
      >
        <p className="text-[12.5px] font-medium text-muted-foreground">Not enough history to project</p>
        <p className="mt-1 text-[11px] text-muted-foreground/70">Three or more samples are needed.</p>
      </div>
    );
  }

  return (
    <div style={{ height }} className="-ml-2 w-full min-w-0 overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={rows} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="forecast-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.22} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 4" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="ts"
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(ts) => format(new Date(ts), "HH:mm")}
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            minTickGap={30}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            width={44}
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
            labelFormatter={(ts) => format(new Date(ts), "d MMM · HH:mm")}
            formatter={(value, name) => [`${value} ${unit}`, name === "predicted" ? "Predicted" : label]}
          />
          {limit !== undefined && limit !== null && (
            <ReferenceLine
              y={limit}
              stroke="hsl(var(--destructive))"
              strokeDasharray="4 4"
              strokeOpacity={0.55}
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
            dataKey="observed"
            stroke={color}
            strokeWidth={1.8}
            fill="url(#forecast-fill)"
            dot={false}
            activeDot={{ r: 3, strokeWidth: 0 }}
            isAnimationActive={false}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={1.8}
            strokeDasharray="5 4"
            dot={false}
            activeDot={{ r: 3, strokeWidth: 0 }}
            isAnimationActive={false}
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
