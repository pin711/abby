import { GoogleGenAI } from "@google/genai";
import { HAS_GEMINI_KEY } from "../constants";

/**
 * 呼叫 Gemini 進行股票分析
 */
export const analyzeStockWithGemini = async (symbol: string, currentPrice: number, trend: 'UP' | 'DOWN'): Promise<string> => {
  
  // --- 模式 1: 真實 AI 模式 ---
  if (HAS_GEMINI_KEY) {
    try {
      // 根據官方指引初始化
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        請扮演一位專業的資產管理顧問。
        目標股票代號：${symbol}
        目前價格：${currentPrice}
        近期趨勢：${trend}
        
        請給出一段約 150 字的繁體中文分析，內容必須包含：
        1. 市場情緒總結。
        2. 短期投資建議 (買入/持有/賣出)。
        3. 風險提示。
        
        請直接給出純文字內容，不要使用 Markdown 格式，不要有標題。
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text || "AI 暫時無法分析此股票。";

    } catch (error) {
      console.error("Gemini API Error:", error);
      return "連線真實 AI 發生錯誤，請檢查 API Key 設定。";
    }
  }

  // --- 模式 2: 模擬樣品屋模式 (Mock AI) ---
  // 隨機回傳一些看起來很專業的建議
  const mockAnalysis = [
    `針對 ${symbol} 目前的表現，市場情緒呈現${trend === 'UP' ? '樂觀' : '謹慎'}態度。技術指標顯示短期內波動可能加劇。建議投資人採取分批佈局策略，若持有部位較大可適度獲利了結。需密切關注下季財報與聯準會利率決策，這將是影響後續走勢的關鍵因素。`,
    `${symbol} 近期走勢${trend === 'UP' ? '強勁，突破關鍵壓力位' : '疲軟，測試下方支撐'}。基本面顯示公司營運狀況穩健，但宏觀經濟逆風仍存。對於長期投資者而言，目前價格區間具備一定吸引力，但建議設置嚴格止損點以控制風險。`,
    `綜合分析 ${symbol}，目前股價已反映大部分市場預期。${trend === 'UP' ? '雖然多頭排列延續，但' : '雖然空方力道減弱，但'}追價風險略高。建議觀望等待回調後再行進場。特別留意產業鏈供應鏈變化可能帶來的短期衝擊。`
  ];
  
  // 模擬網路延遲
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return mockAnalysis[Math.floor(Math.random() * mockAnalysis.length)] + " (此為模擬分析)";
};
