import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { CandleData } from '../types';

interface StockChartProps {
  data: CandleData[];
  symbol: string;
}

const StockChart: React.FC<StockChartProps> = ({ data, symbol }) => {
  // 計算 Y 軸範圍，避免圖表看起來太平
  const minPrice = Math.min(...data.map(d => d.low));
  const maxPrice = Math.max(...data.map(d => d.high));
  const padding = (maxPrice - minPrice) * 0.1;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-cute border-2 border-white h-[450px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-700 flex items-center gap-2">
            <div className="w-2 h-6 bg-primary rounded-full"></div>
            {symbol} 走勢圖
        </h3>
        <div className="flex items-center gap-3 text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full">
            <span className="flex items-center"><div className="w-3 h-3 bg-primary rounded-full mr-2"></div> 收盤價</span>
            <span className="flex items-center"><div className="w-3 h-3 bg-purple-200 mr-2"></div> 成交量</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f472b6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#f472b6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f9ff" />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12, fill: '#94a3b8', fontFamily: 'Quicksand' }} 
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            domain={[minPrice - padding, maxPrice + padding]}
            tick={{ fontSize: 12, fill: '#94a3b8', fontFamily: 'Quicksand' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => value.toFixed(1)}
          />
          <YAxis 
            yAxisId="left"
            orientation="left"
            tick={false}
            axisLine={false}
            width={0} // 隱藏左側 Y 軸 (成交量用)
          />
          <Tooltip 
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(244, 114, 182, 0.1)', padding: '12px' }}
            cursor={{ stroke: '#fbcfe8', strokeWidth: 2 }}
            formatter={(value: number, name: string) => [
                name === 'close' ? `$${value.toFixed(2)}` : value.toLocaleString(),
                name === 'close' ? '價格' : '成交量'
            ]}
            labelStyle={{ color: '#64748b', marginBottom: '0.5rem', fontWeight: 'bold' }}
          />
          
          {/* 成交量 Bar - Soft Purple */}
          <Bar dataKey="volume" yAxisId="left" barSize={12} radius={[4, 4, 0, 0]}>
             {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.close > entry.open ? '#d8b4fe' : '#fbcfe8'} fillOpacity={0.6} />
             ))}
          </Bar>

          {/* 收盤價 Line - Cute Pink */}
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="close" 
            stroke="#f472b6" 
            strokeWidth={3} 
            dot={false} 
            activeDot={{ r: 8, fill: '#f472b6', stroke: '#fff', strokeWidth: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;