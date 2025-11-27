import React, { useState, useEffect } from 'react';
import { analyzeStockWithGemini } from '../services/geminiService';
import { HAS_GEMINI_KEY } from '../constants';

interface AIAnalysisProps {
  symbol: string;
  currentPrice: number;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ symbol, currentPrice }) => {
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // 當股票代號改變時清空舊分析
  useEffect(() => {
    setAnalysis("");
  }, [symbol]);

  const handleAnalyze = async () => {
    setLoading(true);
    // 簡單判斷趨勢用於傳給 AI (隨機或是根據 Mock)
    const trend = Math.random() > 0.5 ? 'UP' : 'DOWN';
    const result = await analyzeStockWithGemini(symbol, currentPrice, trend);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow-cute border-2 border-white p-8 relative overflow-hidden">
       {/* 裝飾背景 */}
       <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-100 rounded-full blur-2xl opacity-60"></div>
       <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-pink-100 rounded-full blur-2xl opacity-60"></div>

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                AI 智能投顧
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-bold ml-9">Powered by Gemini</p>
        </div>
        {!HAS_GEMINI_KEY && (
            <span className="text-[10px] bg-slate-100 text-slate-400 px-3 py-1 rounded-full border border-slate-200 font-bold">
                Preview Mode
            </span>
        )}
      </div>

      <div className="min-h-[120px] relative z-10">
        {analysis ? (
          <div className="bg-purple-50/50 rounded-2xl p-5 text-slate-600 text-sm leading-relaxed border border-purple-100 animate-fadeIn">
            {analysis}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm py-4">
            <p className="mb-6 font-medium text-slate-500">點擊按鈕，讓 AI 為您分析 {symbol} 的走勢！</p>
            <button 
                onClick={handleAnalyze}
                disabled={loading}
                className="bg-secondary hover:bg-purple-500 text-white px-8 py-3 rounded-full font-bold transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-wait flex items-center gap-2 shadow-md shadow-purple-200"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        思考中...
                    </>
                ) : (
                    "✨ 開始分析"
                )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalysis;