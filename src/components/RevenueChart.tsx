'use client';

import type { MonthlyRevenue } from '@/types';

interface RevenueChartProps {
  data: MonthlyRevenue[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-medium text-gray-900">Revenue (Last 6 Months)</h3>
      <div className="flex items-end gap-4" style={{ height: '200px' }}>
        {data.map((item) => {
          const heightPercent = (item.revenue / maxRevenue) * 100;
          return (
            <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs font-medium text-gray-500">
                ${Math.round(item.revenue).toLocaleString()}
              </span>
              <div
                className="w-full rounded-t-md bg-primary-500 transition-all duration-500"
                style={{ height: `${Math.max(heightPercent, 2)}%` }}
              />
              <span className="text-xs text-gray-500">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
