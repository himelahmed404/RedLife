"use client";

import React from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

const BRAND_RED = "#C1121F";

// Bucket keys are YYYY-MM-DD (Dhaka dates); format them without timezone drift
const formatKey = (key, range, long = false) => {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const opts = range === "monthly"
    ? { month: long ? "long" : "short", ...(long && { year: "numeric" }), timeZone: "UTC" }
    : { month: "short", day: "numeric", ...(long && { year: "numeric" }), timeZone: "UTC" };
  const text = date.toLocaleDateString("en-US", opts);
  return range === "weekly" && long ? `Week of ${text}` : text;
};

function ChartTooltip({ active, payload, range }) {
  if (!active || !payload?.length) return null;
  const { key, count } = payload[0].payload;
  return (
    <div className="bg-white border border-[#E4E8ED] rounded-[10px] shadow-[0_8px_24px_rgba(16,20,28,0.12)] px-[12px] py-[8px]">
      <p className="font-mono text-[11px] text-[#5C6675]">{formatKey(key, range, true)}</p>
      <p className="text-[14px] font-[600] text-[#10141C] mt-[2px] flex items-center gap-[6px]">
        <span className="w-[8px] h-[8px] rounded-full" style={{ background: BRAND_RED }}></span>
        {count} {count === 1 ? "request" : "requests"}
      </p>
    </div>
  );
}

// Single series (requests per bucket), so no legend: the card title names it
export default function RequestsChart({ series, range }) {
  if (!series) {
    return (
      <div className="h-[260px] flex items-center justify-center font-mono text-[12px] text-[#5C6675]">
        Loading chart...
      </div>
    );
  }

  return (
    <>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={series} margin={{ top: 8, right: 4, bottom: 0, left: -12 }}>
            <CartesianGrid vertical={false} stroke="#E4E8ED" />
            <XAxis
              dataKey="key"
              tickFormatter={(key) => formatKey(key, range)}
              tick={{ fill: "#5C6675", fontSize: 12 }}
              axisLine={{ stroke: "#E4E8ED" }}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={12}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "#5C6675", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              content={<ChartTooltip range={range} />}
              cursor={{ fill: "#F5F7F9" }}
            />
            <Bar dataKey="count" fill={BRAND_RED} radius={[4, 4, 0, 0]} maxBarSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table view: the same numbers without needing hover or colour */}
      <details className="mt-[12px] group">
        <summary className="cursor-pointer font-mono text-[12px] text-[#5C6675] hover:text-[#10141C] select-none">
          Show data table
        </summary>
        <div className="mt-[10px] max-h-[220px] overflow-y-auto border border-[#E4E8ED] rounded-[10px]">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#F5F7F9] font-mono text-[10.5px] uppercase tracking-[0.1em] text-[#5C6675]">
              <tr>
                <th className="py-[8px] px-[12px] font-[500]">Period</th>
                <th className="py-[8px] px-[12px] font-[500] text-right">Requests</th>
              </tr>
            </thead>
            <tbody>
              {series.map(({ key, count }) => (
                <tr key={key} className="border-t border-[#E4E8ED]">
                  <td className="py-[7px] px-[12px] text-[#10141C]">{formatKey(key, range, true)}</td>
                  <td className="py-[7px] px-[12px] text-right text-[#10141C]">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </>
  );
}
