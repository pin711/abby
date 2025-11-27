import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { fetchCurrentPrice } from '../services/api';

interface TradePanelProps {
  symbol: string;
  onTrade: (transaction: Transaction) => void;
  isLoading: boolean;
}

const TradePanel: React.FC<TradePanelProps> = ({ symbol, onTrade, isLoading }) => {
  const [price, setPrice] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<string>('1');
  const [isQuoting, setIsQuoting] = useState(false);
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');

  // 切換股票時重置報價
  useEffect(() => {
    setPrice(null);
  }, [symbol]);

  const handleQuote = async () => {
    setIsQuoting(true);
    const currentPrice = await fetchCurrentPrice(symbol);
    setPrice(currentPrice);
    setIsQuoting(false);
  };

  const handleSubmit = () => {
    if (!price || !quantity) return;
    
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      symbol: symbol,
      type: orderType,
      price: price,
      quantity: qty,
      total: price * qty
    };

    onTrade(transaction);
    alert(`✨ 交易成功！\n${orderType === 'BUY' ? '買入' : '賣出'} ${symbol} ${qty} 股，成交價 $${price.toFixed(2)}`);
  };

  return (
    <div className="bg-white rounded-3xl shadow-cute border-2 border-white overflow-hidden">
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-8 py-5 border-b border-pink-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-700 flex items-center gap-2">
            <span className="text-2xl">🛍️</span> 模擬交易
        </h3>
        <span className="text-xs bg-white text-pink-500 border border-pink-200 px-3 py-1 rounded-full font-bold shadow-sm">SIMULATION</span>
      </div>
      
      <div className="p-8">
        {/* 股票代碼顯示 */}
        <div className="mb-8 flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Target Asset</span>
                <span className="text-3xl font-extrabold text-slate-700">{symbol}</span>
            </div>
            <div className="text-right">
                <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Live Quote</span>
                {price ? (
                    <span className={`text-3xl font-extrabold ${price > 100 ? 'text-success' : 'text-danger'} animate-pulse`}>
                        ${price.toFixed(2)}
                    </span>
                ) : (
                    <span className="text-3xl font-bold text-slate-300">---</span>
                )}
            </div>
        </div>

        {/* 交易表單 */}
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-full">
                <button 
                    onClick={() => setOrderType('BUY')}
                    className={`py-3 rounded-full font-bold transition-all ${orderType === 'BUY' ? 'bg-white text-success shadow-md scale-100' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    買進 (Buy)
                </button>
                <button 
                    onClick={() => setOrderType('SELL')}
                    className={`py-3 rounded-full font-bold transition-all ${orderType === 'SELL' ? 'bg-white text-danger shadow-md scale-100' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    賣出 (Sell)
                </button>
            </div>

            <div>
                <label className="block text-sm text-slate-500 font-bold mb-2 ml-2">數量 (Shares)</label>
                <div className="relative">
                    <input 
                        type="number" 
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-right font-mono text-lg font-bold focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all text-slate-700"
                    />
                    <div className="absolute left-4 top-4 text-slate-400 font-bold text-sm pointer-events-none">QTY</div>
                </div>
            </div>

            <div className="py-4 border-t border-dashed border-slate-200 flex justify-between items-center">
                <span className="text-slate-500 font-bold">預估總額</span>
                <span className="text-2xl font-extrabold text-slate-800">
                    ${price ? (price * parseInt(quantity || '0')).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0.00'}
                </span>
            </div>

            <div className="flex gap-3 pt-2">
                <button 
                    onClick={handleQuote}
                    disabled={isQuoting || isLoading}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 disabled:opacity-50 transition-colors"
                >
                    {isQuoting ? '...' : '詢價'}
                </button>
                <button 
                    onClick={handleSubmit}
                    disabled={!price}
                    className="flex-[2] py-4 bg-primary hover:bg-primaryDark text-white font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-200 transition-all transform active:scale-95"
                >
                    {orderType === 'BUY' ? '確認買入' : '確認賣出'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TradePanel;