// 全域常數與模擬資料產生器

export const APP_NAME = "AlphaTrade Pro";

// 預設股票
export const DEFAULT_SYMBOL = "AAPL";

// 檢查 API 金鑰是否存在 (用於判斷是否進入真實模式)
// 注意：在 Vite 環境中通常是 import.meta.env，但在通用 React 樣板中我們檢查 process.env
export const HAS_GEMINI_KEY = !!process.env.API_KEY;
export const HAS_FINNHUB_KEY = !!process.env.VITE_FINNHUB_API_KEY;

// 模擬 K 線資料產生器 (幾何布朗運動簡化版)
export const generateMockCandles = (days: number, startPrice: number = 150): any[] => {
  let currentPrice = startPrice;
  const data = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const volatility = 0.02; // 2% 波動
    const change = currentPrice * volatility * (Math.random() - 0.5);
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * (currentPrice * 0.01);
    const low = Math.min(open, close) - Math.random() * (currentPrice * 0.01);
    const volume = Math.floor(Math.random() * 1000000) + 500000;

    data.push({
      time: date.toISOString().split('T')[0],
      timestamp: date.getTime(),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: volume
    });

    currentPrice = close;
  }
  return data;
};
