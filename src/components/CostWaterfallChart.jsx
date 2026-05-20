import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Cell,
} from 'recharts';
import { formatCurrency } from '../utils/marketData';

const DIVING_COLOR = '#f59e0b';
const ROV_COLOR = '#3b82f6';

const CustomTooltip = ({ active, payload, label, market }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs shadow-lg">
      <p className="text-gray-700 font-semibold mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex justify-between gap-6 mb-1">
          <span style={{ color: p.fill }} className="font-medium">{p.name}</span>
          <span className="text-gray-800 font-mono">{formatCurrency(p.value, market)}</span>
        </div>
      ))}
      {payload.length === 2 && (
        <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between gap-6">
          <span className="text-gray-500">ROV saves</span>
          <span className="text-teal-500 font-mono font-semibold">
            {formatCurrency(payload[0].value - payload[1].value, market)}
          </span>
        </div>
      )}
    </div>
  );
};

export default function CostWaterfallChart({ data, market }) {
  const tickFormatter = (v) => {
    if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
    return v;
  };

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 5 }} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: '#6b7280', fontSize: 11 }}
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
        <Legend
          wrapperStyle={{ fontSize: 12, color: '#6b7280', paddingTop: 12 }}
          iconType="square"
          iconSize={10}
        />
        <Bar dataKey="diving" name="Commercial Diving" fill={DIVING_COLOR} radius={[3, 3, 0, 0]} />
        <Bar dataKey="rov" name="EyeROV" fill={ROV_COLOR} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
