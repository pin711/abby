import { CandleData, Timeframe } from '../types';
import { generateMockCandles, HAS_FINNHUB_KEY } from '../constants';

// Finnhub API 回傳格式介面
interface FinnhubCandleResponse {
  c: number[]; // Close
  h: number[]; // High
  l: number[]; // Low
  o: number[]; // Open
  s: string;   // Status
  t: number[]; // Timestamp
  v: number[]; // Volume
}

/**
 * 取得市場 K 線資料
 * 雙模組邏輯：
 * 1. 如果有 FINNHUB_API_KEY，嘗試呼叫真實 API。
 * 2. 如果沒有 Key 或呼叫失敗，回傳模擬資料。
 */
export const fetchMarketData = async (symbol: string, timeframe: Timeframe): Promise<CandleData[]> => {
  // --- 模式 1: 真實 API 模式 ---
  if (HAS_FINNHUB_KEY) {
    try {
      const apiKey = process.env.VITE_FINNHUB_API_KEY;
      const to = Math.floor(Date.now() / 1000);
      // 簡單的時間轉換：D=30天, W=52週, M=5年
      let from = to - (30 * 24 * 60 * 60); 
      let resolution = 'D';

      if (timeframe === Timeframe.WEEK) {
        from = to - (365 * 24 * 60 * 60);
        resolution = 'W';
      } else if (timeframe === Timeframe.MONTH) {
        from = to - (365 * 2 * 24 * 60 * 60);
        resolution = 'M';
      }

      const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${apiKey}`;
      
      const response = await fetch(url);
      const data: FinnhubCandleResponse = await response.json();

      if (data.s === 'ok') {
        return data.t.map((timestamp, index) => ({
          time: new Date(timestamp * 1000).toISOString().split('T')[0],
          timestamp: timestamp * 1000,
          open: data.o[index],
          high: data.h[index],
          low: data.l[index],
          close: data.c[index],
          volume: data.v[index],
        }));
      }
      console.warn('Finnhub API returned no data or error, falling back to mock.');
    } catch (error) {
      console.error('Failed to fetch real data:', error);
    }
  }

  // --- 模式 2: 模擬樣品屋模式 (Mock Mode) ---
  console.log(`[系統提示] 使用模擬數據生成 (${symbol})`);
  
  // 為了讓模擬數據看起來像真的，我們根據 Symbol 字串產生一個隨機種子，讓同一支股票每次重新整理走勢一致
  const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const startPrice = (seed % 500) + 50; // 價格落在 50 ~ 550 之間
  
  const days = timeframe === Timeframe.DAY ? 30 : timeframe === Timeframe.WEEK ? 52 : 24;
  return generateMockCandles(days, startPrice);
};

/**
 * 取得當前股價 (模擬或真實)
 */
export const fetchCurrentPrice = async (symbol: string): Promise<number> => {
  if (HAS_FINNHUB_KEY) {
    try {
      const apiKey = process.env.VITE_FINNHUB_API_KEY;
      const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.c) return data.c;
    } catch (e) {
      console.error("Quote fetch failed", e);
    }
  }

  // Mock
  const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (seed % 500) + 50 + (Math.random() * 5); // 稍微加上一點隨機跳動
};
