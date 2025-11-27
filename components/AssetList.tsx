import React from 'react';
import { Asset, Transaction } from '../types';

interface AssetListProps {
  transactions: Transaction[];
  assets: Asset[];
}

const AssetList: React.FC<AssetListProps> = ({ transactions, assets }) => {
  const [activeTab, setActiveTab] = React.useState<'HOLDINGS' | 'HISTORY'>('HOLDINGS');

  return (
    <div className="bg-white rounded-3xl shadow-cute border-2 border-white overflow-hidden min-h-[400px]">
      <div className="flex border-b border-slate-100 px-6 pt-4 gap-4">
        <button
          onClick={() => setActiveTab('HOLDINGS')}
          className={`pb-4 px-4 text-sm font-bold text-center transition-all relative ${activeTab === 'HOLDINGS' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
        >
          當前持倉 (Holdings)
          {activeTab === 'HOLDINGS' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full"></div>}
        </button>
        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`pb-4 px-4 text-sm font-bold text-center transition-all relative ${activeTab === 'HISTORY' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
        >
          交易紀錄 (History)
          {activeTab === 'HISTORY' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full"></div>}
        </button>
      </div>

      <div className="p-4 overflow-x-auto">
        {activeTab === 'HOLDINGS' ? (
          <table className="w-full text-sm text-left border-separate border-spacing-y-2">
            <thead className="text-slate-400 text-xs font-bold uppercase">
              <tr>
                <th className="px-4 py-2">代號</th>
                <th className="px-4 py-2 text-right">股數</th>
                <th className="px-4 py-2 text-right">平均成本</th>
                <th className="px-4 py-2 text-right">總成本</th>
              </tr>
            </thead>
            <tbody>
              {assets.length > 0 ? assets.map((asset) => (
                <tr key={asset.symbol} className="bg-slate-50 hover:bg-pink-50 transition-colors rounded-2xl group">
                  <td className="px-4 py-4 font-bold text-slate-700 rounded-l-2xl border-l-4 border-transparent group-hover:border-primary">{asset.symbol}</td>
                  <td className="px-4 py-4 text-right text-slate-600">{asset.quantity}</td>
                  <td className="px-4 py-4 text-right text-slate-600">${asset.averageCost.toFixed(2)}</td>
                  <td className="px-4 py-4 text-right font-bold text-slate-800 rounded-r-2xl">
                    ${(asset.quantity * asset.averageCost).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">
                    📭 目前無持倉
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-sm text-left border-separate border-spacing-y-2">
            <thead className="text-slate-400 text-xs font-bold uppercase">
              <tr>
                <th className="px-4 py-2">時間</th>
                <th className="px-4 py-2">類別</th>
                <th className="px-4 py-2">代號</th>
                <th className="px-4 py-2 text-right">價格</th>
                <th className="px-4 py-2 text-right">股數</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? transactions.map((t) => (
                <tr key={t.id} className="bg-slate-50 hover:bg-blue-50 transition-colors rounded-2xl">
                  <td className="px-4 py-4 text-slate-500 rounded-l-2xl pl-6">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${t.type === 'BUY' ? 'bg-success/20 text-green-600' : 'bg-danger/20 text-rose-500'}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-bold text-slate-700">{t.symbol}</td>
                  <td className="px-4 py-4 text-right text-slate-600">${t.price.toFixed(2)}</td>
                  <td className="px-4 py-4 text-right text-slate-600 rounded-r-2xl">{t.quantity}</td>
                </tr>
              )) : (
                 <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                    🍃 無交易紀錄
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AssetList;