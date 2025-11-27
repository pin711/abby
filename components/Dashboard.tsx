import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Asset, Transaction } from '../types';

interface DashboardProps {
  assets: Asset[];
  transactions: Transaction[];
  currentMarketPrices: Record<string, number>; // 對應 Symbol 的現價
}

// Pastel Colors for Pie Chart
const COLORS = ['#f472b6', '#c084fc', '#38bdf8', '#4ade80', '#fbbf24', '#f87171'];

const Dashboard: React.FC<DashboardProps> = ({ assets, currentMarketPrices }) => {
  
  // 計算總資產價值
  const totalValue = useMemo(() => {
    return assets.reduce((sum, asset) => {
      const price = currentMarketPrices[asset.symbol] || asset.averageCost; // 如果沒有現價，先用成本算
      return sum + (asset.quantity * price);
    }, 0);
  }, [assets, currentMarketPrices]);

  // 準備圓餅圖資料
  const pieData = useMemo(() => {
    return assets.map(asset => ({
      name: asset.symbol,
      value: asset.quantity * (currentMarketPrices[asset.symbol] || asset.averageCost)
    })).filter(d => d.value > 0);
  }, [assets, currentMarketPrices]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      {/* 總資產卡片 - Cotton Candy Gradient */}
      <div className="bg-gradient-to-br from-pink-400 via-pink-500 to-purple-500 rounded-3xl p-8 text-white shadow-cute relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-600/20 rounded-full blur-xl -ml-5 -mb-5"></div>
        
        <div className="relative z-10">
            <h3 className="text-pink-100 text-sm font-bold mb-1 tracking-wide uppercase">總資產估值</h3>
            <div className="text-5xl font-extrabold mb-6 tracking-tight drop-shadow-sm">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex gap-4">
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30">
                    <span className="text-xs text-pink-50 block mb-0.5">持有標的</span>
                    <span className="font-bold text-lg">{assets.length} <span className="text-sm font-normal">支</span></span>
                </div>
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30">
                    <span className="text-xs text-pink-50 block mb-0.5">現金水位 (Mock)</span>
                    <span className="font-bold text-lg">$10,000</span>
                </div>
            </div>
        </div>
      </div>

      {/* 資產配置圓餅圖 */}
      <div className="bg-white rounded-3xl p-6 shadow-cute border-2 border-white flex flex-col items-center justify-center relative">
        <h3 className="text-slate-700 font-bold text-lg self-start mb-2 ml-2">資產配置</h3>
        {assets.length > 0 ? (
          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  cornerRadius={8}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => `$${value.toLocaleString()}`} 
                />
                <Legend iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
            <div className="text-slate-300 text-sm h-[200px] flex flex-col items-center justify-center gap-2">
                <div className="text-4xl">🍦</div>
                <p>尚未建立投資組合</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;