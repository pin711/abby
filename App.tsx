import React, { useState, useEffect } from 'react';
import { 
  CandleData, 
  Timeframe, 
  Transaction, 
  Asset 
} from './types';
import { 
  DEFAULT_SYMBOL, 
  HAS_GEMINI_KEY, 
  HAS_FINNHUB_KEY,
  APP_NAME 
} from './constants';
import { fetchMarketData, fetchCurrentPrice } from './services/api';
import { getAssets, saveAsset, getTransactions, addTransaction } from './services/portfolioService';

// Components
import StockChart from './components/StockChart';
import TradePanel from './components/TradePanel';
import Dashboard from './components/Dashboard';
import AssetList from './components/AssetList';
import AIAnalysis from './components/AIAnalysis';
import Education from './components/Education';

const App: React.FC = () => {
  // --- State Management ---
  const [symbol, setSymbol] = useState<string>(DEFAULT_SYMBOL);
  const [inputValue, setInputValue] = useState<string>(DEFAULT_SYMBOL);
  const [timeframe, setTimeframe] = useState<Timeframe>(Timeframe.DAY);
  const [marketData, setMarketData] = useState<CandleData[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(150);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 初始化載入
  useEffect(() => {
    setAssets(getAssets());
    setTransactions(getTransactions());
    loadMarketData(symbol, timeframe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 當股票或時間區間改變時載入數據
  const loadMarketData = async (sym: string, tf: Timeframe) => {
    setIsLoading(true);
    try {
      const data = await fetchMarketData(sym, tf);
      const price = await fetchCurrentPrice(sym);
      setMarketData(data);
      setCurrentPrice(price);
    } catch (error) {
      console.error("Data load error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newSymbol = inputValue.toUpperCase();
      setSymbol(newSymbol);
      loadMarketData(newSymbol, timeframe);
    }
  };

  const handleTimeframeChange = (tf: Timeframe) => {
    setTimeframe(tf);
    loadMarketData(symbol, tf);
  };

  const handleTrade = (transaction: Transaction) => {
    // 更新交易紀錄
    addTransaction(transaction);
    setTransactions(prev => [transaction, ...prev]);

    // 更新資產
    const asset: Asset = {
      symbol: transaction.symbol,
      quantity: transaction.type === 'BUY' ? transaction.quantity : -transaction.quantity,
      averageCost: transaction.price // 簡化處理：賣出時這裡僅用於查找
    };
    saveAsset(asset);
    setAssets(getAssets()); // 重新讀取計算後的資產
  };

  // 建立當前價格 Map 給 Dashboard 計算市值用
  const priceMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    // 當前顯示的股票
    map[symbol] = currentPrice;
    // (進階功能：實際應用應該要即時抓取所有持倉的股價，這裡為了效能僅 Mock 當前這支)
    return map;
  }, [symbol, currentPrice]);

  return (
    <div className="min-h-screen pb-12">
      {/* --- Header --- */}
      <div className="pt-6 px-4 sm:px-6 lg:px-8 mb-6">
        <header className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-cute px-6 h-20 flex items-center justify-between border-2 border-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-pink-400 to-purple-400 rounded-2xl rotate-3 flex items-center justify-center font-bold text-xl text-white shadow-md animate-float">
              A
            </div>
            <h1 className="font-bold text-2xl text-slate-700 tracking-tight">{APP_NAME} <span className="text-pink-400">♥</span></h1>
          </div>
          
          {/* 模式指示燈 (Cute Badges) */}
          <div className="flex items-center gap-3">
             <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-all shadow-sm ${HAS_FINNHUB_KEY ? 'bg-green-100 border-green-200 text-green-600' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                <div className={`w-2.5 h-2.5 rounded-full ${HAS_FINNHUB_KEY ? 'bg-green-400 animate-bounce' : 'bg-slate-300'}`}></div>
                {HAS_FINNHUB_KEY ? 'Live' : 'Mock'}
             </div>
             <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-all shadow-sm ${HAS_GEMINI_KEY ? 'bg-purple-100 border-purple-200 text-purple-600' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                <div className={`w-2.5 h-2.5 rounded-full ${HAS_GEMINI_KEY ? 'bg-purple-400 animate-pulse' : 'bg-slate-300'}`}></div>
                Gemini AI
             </div>
          </div>
        </header>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        
        {/* --- Dashboard Overview --- */}
        <Dashboard assets={assets} transactions={transactions} currentMarketPrices={priceMap} />
        
        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Charts & Analysis (8/12) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. Controls */}
            <div className="bg-white p-2 rounded-3xl shadow-cute border-2 border-white flex flex-wrap gap-4 justify-between items-center pl-6 pr-2">
              <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="輸入股票代號 (e.g. AAPL)"
                  className="bg-pink-50 border-2 border-pink-100 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 w-full sm:w-48 font-bold text-slate-600 placeholder-pink-200"
                />
                <button type="submit" className="bg-primary hover:bg-primaryDark text-white px-6 py-2.5 rounded-full text-sm font-bold transition-transform active:scale-95 shadow-md shadow-pink-200">
                  搜尋
                </button>
              </form>

              <div className="flex bg-slate-50 p-1.5 rounded-full border border-slate-100">
                {[Timeframe.DAY, Timeframe.WEEK, Timeframe.MONTH].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => handleTimeframeChange(tf)}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${timeframe === tf ? 'bg-white text-primary shadow-sm ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    1{tf}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Chart */}
            <div className="relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-3xl">
                        <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-col items-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-pink-200 border-t-primary mb-2"></div>
                            <span className="text-primary font-bold text-sm">載入中...</span>
                        </div>
                    </div>
                )}
                <StockChart data={marketData} symbol={symbol} />
            </div>

            {/* 3. AI Analysis */}
            <AIAnalysis symbol={symbol} currentPrice={currentPrice} />
            
            {/* 4. Education */}
            <Education />
            
             {/* 5. Asset List Table */}
             <div>
                <h3 className="text-xl font-bold text-slate-700 mb-4 ml-2 flex items-center gap-2">
                    <span className="bg-yellow-200 text-yellow-600 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm">💰</span>
                    投資組合明細
                </h3>
                <AssetList assets={assets} transactions={transactions} />
             </div>

          </div>

          {/* Right Column: Trading & Utility (4/12) */}
          <div className="lg:col-span-4 space-y-8">
            <TradePanel 
                symbol={symbol} 
                onTrade={handleTrade} 
                isLoading={isLoading} 
            />
            
            {/* 簡單的公告欄 (Mock) */}
            <div className="bg-white rounded-3xl shadow-cute border-2 border-white p-6 relative overflow-hidden">
                <div className="absolute -right-6 -top-6 bg-blue-50 w-24 h-24 rounded-full"></div>
                <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2 relative z-10">
                    <span className="text-xl">📢</span> 系統公告
                </h4>
                <ul className="space-y-3 text-sm text-slate-500 relative z-10">
                    <li className="flex gap-3 items-start bg-slate-50 p-3 rounded-2xl">
                        <span className="text-primary font-bold text-lg leading-none mt-0.5">•</span>
                        <span>歡迎使用 <strong className="text-primary">AlphaTrade Pro</strong> 樣品屋。</span>
                    </li>
                    <li className="flex gap-3 items-start bg-slate-50 p-3 rounded-2xl">
                        <span className="text-primary font-bold text-lg leading-none mt-0.5">•</span>
                        <span>目前 {HAS_FINNHUB_KEY ? '已連線至真實' : '使用模擬'} 市場數據源。</span>
                    </li>
                    <li className="flex gap-3 items-start bg-slate-50 p-3 rounded-2xl">
                        <span className="text-primary font-bold text-lg leading-none mt-0.5">•</span>
                        <span>下單功能已開啟，請盡情體驗！</span>
                    </li>
                </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;