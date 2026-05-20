import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine, Area, AreaChart,
} from 'recharts';
import { formatCurrency } from '../utils/marketData';

const CustomTooltip = ({ active, payload, label, market }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs shadow-lg">
      <p className="text-gray-500 mb-2">Inspection #{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex justify-between gap-6 mb-1">
          <span style={{ color: p.stroke || p.fill }} className="font-medium">{p.name}</span>
          <span className="text-gray-800 font-mono">{formatCurrency(p.value, market)}</span>
        </div>
      ))}
    </div>
  );
};

export default function BreakevenChart({ data, breakEvenAt, market, isRaaS }) {
  const tickFormatter = (v) => {
    if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
    return v;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
        <defs>
          <linearGradient id="divingGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="rovGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="inspection"
          label={{ value: 'Cumulative Inspections', position: 'insideBottom', offset: -3, fill: '#6b7280', fontSize: 10 }}
          tick={{ fill: '#6b7280', fontSize: 10 }}
          axisLine={{ stroke: '#e5e7eb' }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={tickFormatter}
          tick={{ fill: '#9ca3af', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
          width={55}
        />
        <Tooltip content={<CustomTooltip market={market} />} />
        <Legend wrapperStyle={{ fontSize: 12, color: '#6b7280', paddingTop: 16 }} iconType="plainline" />

        {breakEvenAt && breakEvenAt <= 20 && (
          <ReferenceLine
            x={breakEvenAt}
            stroke="#2563eb"
            strokeDasharray="4 3"
            label={{
              value: isRaaS ? 'Break-even: 1st inspection' : `Break-even #${breakEvenAt}`,
              position: 'top',
              fill: '#2563eb',
              fontSize: 10,
            }}
          />
        )}

        <Area
          type="monotone"
          dataKey="diving"
          name="Diving (most likely)"
          stroke="#f59e0b"
          strokeWidth={2}
          fill="url(#divingGrad)"
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="rov"
          name="EyeROV (most likely)"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#rovGrad)"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="divingWorst"
          name="Diving worst case"
          stroke="#f59e0b"
          strokeWidth={1}
          strokeDasharray="3 3"
          dot={false}
          legendType="none"
        />
        <Line
          type="monotone"
          dataKey="rovWorst"
          name="ROV worst case"
          stroke="#3b82f6"
          strokeWidth={1}
          strokeDasharray="3 3"
          dot={false}
          legendType="none"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
