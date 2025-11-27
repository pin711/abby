// 定義系統核心型別

// 時間區間列舉
export enum Timeframe {
  DAY = 'D',
  WEEK = 'W',
  MONTH = 'M'
}

// 股票 K 線資料格式
export interface CandleData {
  time: string;   // 顯示用時間字串
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// 資產物件
export interface Asset {
  symbol: string;
  quantity: number;
  averageCost: number;
  currentPrice?: number;
}

// 交易紀錄
export interface Transaction {
  id: string;
  date: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  total: number;
}

// 應用程式全域狀態 Context
export interface AppState {
  currentSymbol: string;
  marketData: CandleData[];
  assets: Asset[];
  transactions: Transaction[];
  isLoading: boolean;
  isMockMode: boolean; // 是否為模擬模式
}

// Gemini 回傳格式預期
export interface AIAnalysisResult {
  summary: string;
  recommendation: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}
