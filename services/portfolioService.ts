import { Asset, Transaction } from '../types';

// 簡單的 LocalStorage Key
const STORAGE_KEY_ASSETS = 'alpha_trade_assets';
const STORAGE_KEY_TRANSACTIONS = 'alpha_trade_transactions';

// Firebase Config String Check (如使用者要求)
const FIREBASE_CONFIG = process.env.VITE_FIREBASE_CONFIG_STRING;

// 注意：由於這是單一檔案輸出且無後端，我們主要使用 LocalStorage 模擬資料庫行為。
// 若 FIREBASE_CONFIG 存在，實務上會在此初始化 Firebase App。
// 為了確保預覽環境不崩潰，此處實作穩健的 LocalStorage 存取。

export const getAssets = (): Asset[] => {
  const stored = localStorage.getItem(STORAGE_KEY_ASSETS);
  return stored ? JSON.parse(stored) : [];
};

export const saveAsset = (asset: Asset) => {
  const assets = getAssets();
  const existingIndex = assets.findIndex(a => a.symbol === asset.symbol);
  
  if (existingIndex >= 0) {
    // 簡單平均成本法計算 (Weighted Average)
    const existing = assets[existingIndex];
    const totalCost = (existing.quantity * existing.averageCost) + (asset.quantity * asset.averageCost);
    const totalQty = existing.quantity + asset.quantity;
    
    if (totalQty <= 0) {
        assets.splice(existingIndex, 1);
    } else {
        assets[existingIndex] = {
            ...existing,
            quantity: totalQty,
            averageCost: totalCost / totalQty
        };
    }
  } else {
    assets.push(asset);
  }
  
  localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(assets));
  // 如果是真實模式，這裡會同步到 Firestore
  if (FIREBASE_CONFIG) {
      console.log("[System] Syncing to Firestore (Stub)...");
  }
};

export const getTransactions = (): Transaction[] => {
  const stored = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
  return stored ? JSON.parse(stored) : [];
};

export const addTransaction = (transaction: Transaction) => {
  const transactions = getTransactions();
  transactions.unshift(transaction); // 新的在前面
  localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
};
