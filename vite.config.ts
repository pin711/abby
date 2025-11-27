import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 載入環境變數，並確保 process.cwd() 可用 (防止在某些極端環境下報錯)
  // 使用 (process as any) 來避免 TypeScript 報錯 Property 'cwd' does not exist on type 'Process'
  const cwd = typeof process !== 'undefined' && typeof (process as any).cwd === 'function' ? (process as any).cwd() : '.';
  const env = loadEnv(mode, cwd, '');

  return {
    plugins: [react()],
    // Github Pages 的 Base URL 設定
    // 優先使用環境變數 GITHUB_PAGES_BASE_URL (由 deploy.yml 注入)
    // 本地開發或預覽時預設為 '/'
    base: process.env.GITHUB_PAGES_BASE_URL || '/', 
    
    define: {
      // 橋接環境變數：讓前端程式碼中的 process.env.API_KEY 等變數能正常運作
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_GEMINI_API_KEY),
      'process.env.VITE_FINNHUB_API_KEY': JSON.stringify(env.VITE_FINNHUB_API_KEY),
      'process.env.VITE_FIREBASE_CONFIG_STRING': JSON.stringify(env.VITE_FIREBASE_CONFIG_STRING),
      // 定義一個空的 process.env 物件以防止第三方庫報錯
      'process.env': {} 
    }
  };
});