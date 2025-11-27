import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 載入環境變數 (包含 .env 檔案與系統變數)
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    // Github Pages 的 Base URL 設定
    // 注意：部署時請將 '/REPO_NAME/' 改為您的 Github Repository 名稱，例如 '/my-stock-app/'
    // 如果是部署到 username.github.io (根目錄)，則使用 '/'
    base: process.env.GITHUB_PAGES_BASE_URL || '/', 
    
    define: {
      // 這裡做一個橋接，讓前端程式碼中使用的 process.env 能讀取到 VITE_ 開頭的環境變數
      // 這是為了讓您的 constants.ts 和 services 中的程式碼在瀏覽器中也能運作
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_GEMINI_API_KEY),
      'process.env.VITE_FINNHUB_API_KEY': JSON.stringify(env.VITE_FINNHUB_API_KEY),
      'process.env.VITE_FIREBASE_CONFIG_STRING': JSON.stringify(env.VITE_FIREBASE_CONFIG_STRING),
      // 防止某些套件存取 process.env 報錯
      'process.env': {} 
    }
  };
});