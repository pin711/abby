import React from 'react';

const Education: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-accent to-sky-400 rounded-3xl p-6 shadow-cute mb-6 text-white relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -mr-5 -mt-5"></div>
      
      <h3 className="text-white font-bold mb-4 flex items-center text-lg relative z-10">
        <span className="text-2xl mr-2">🎓</span>
        新手交易指南
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-sky-900 relative z-10">
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-sm hover:transform hover:-translate-y-1 transition-transform duration-300">
          <span className="font-bold block mb-2 text-sky-600 text-base">📊 K 線 (Candles)</span>
          <p className="leading-relaxed opacity-80">記錄股價變化。紅色代表跌，綠色代表漲。長長的線叫做影線，代表最高最低價喔！</p>
        </div>
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-sm hover:transform hover:-translate-y-1 transition-transform duration-300">
          <span className="font-bold block mb-2 text-sky-600 text-base">📢 成交量 (Volume)</span>
          <p className="leading-relaxed opacity-80">代表這段時間有多少股票在交換。量越大，代表大家對這個價格越有興趣！</p>
        </div>
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-sm hover:transform hover:-translate-y-1 transition-transform duration-300">
          <span className="font-bold block mb-2 text-sky-600 text-base">🛡️ 分散風險 (Mix)</span>
          <p className="leading-relaxed opacity-80">不要把雞蛋放在同一個籃子裡。買不同類型的股票，比較不會受傷喔！</p>
        </div>
      </div>
    </div>
  );
};

export default Education;