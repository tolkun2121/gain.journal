"use client";
import React, { useState, useEffect } from 'react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login'); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // MODAL & DATA STATE'LERİ
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<string | null>('%1.0');
  const [fixedRiskAmount, setFixedRiskAmount] = useState('20');
  
  // Yeni Hesap Form State'leri
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountBalance, setNewAccountBalance] = useState('');

  // SS Yükleme Ekranı için Modal İçi Tarih Seçimi (Gün ve Ay)
  const [tradeDay, setTradeDay] = useState(1);
  const [tradeMonth, setTradeMonth] = useState('Ağustos');

  // Sabit risk hafızası (localStorage)
  useEffect(() => {
    const savedRisk = localStorage.getItem('fixedRiskAmount');
    if (savedRisk) setFixedRiskAmount(savedRisk);
  }, []);

  const handleRiskChange = (val: string) => {
    setSelectedRisk(val);
    if (val === 'sabit') {
      localStorage.setItem('fixedRiskAmount', fixedRiskAmount);
    }
  };

  const [profiles, setProfiles] = useState([
    { id: 1, name: "$100 -> $1000 Challenge", initialBalance: 100, currentBalance: 100, riskAmount: 1, trades: [] },
    { id: 2, name: "Ana Fon Hesabı (Prop)", initialBalance: 10000, currentBalance: 10000, riskAmount: 100, trades: [] } 
  ]);
  const [activeProfile, setActiveProfile] = useState(profiles[0]);

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAccountName.trim() && newAccountBalance) {
      const balanceNum = Number(newAccountBalance);
      const newProfile = {
        id: profiles.length + 1,
        name: newAccountName,
        initialBalance: balanceNum,
        currentBalance: balanceNum,
        riskAmount: balanceNum * 0.01,
        trades: []
      };
      setProfiles([...profiles, newProfile]);
      setActiveProfile(newProfile);
      setNewAccountName('');
      setNewAccountBalance('');
      setShowAccountModal(false);
    }
  };
  
  const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  
  // Yıl otomatik olarak güncelleniyor (Şu anki yıl: 2026) ve 2030'a kadar devam ediyor
  const currentAutoYear = new Date().getFullYear();
  const years = [currentAutoYear, currentAutoYear + 1, currentAutoYear + 2, currentAutoYear + 3, currentAutoYear + 4];
  
  const [selectedMonth, setSelectedMonth] = useState("Ağustos");
  const [selectedYear, setSelectedYear] = useState(currentAutoYear);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const riskPercentage = ((activeProfile.riskAmount / activeProfile.initialBalance) * 100).toFixed(1);

  const accountTrades = activeProfile.trades || [];
  const totalWin = accountTrades.filter(t => t > 0).reduce((a, b) => a + b, 0);
  const totalLoss = Math.abs(accountTrades.filter(t => t < 0).reduce((a, b) => a + b, 0));
  const netResult = totalWin - totalLoss;
  const winCount = accountTrades.filter(t => t > 0).length;
  const winRateNum = accountTrades.length > 0 ? ((winCount / accountTrades.length) * 100).toFixed(1) : "0";

  const yearlyStats = { 
    totalWin: totalWin.toFixed(2), 
    totalLoss: totalLoss.toFixed(2), 
    net: netResult.toFixed(2), 
    avgRR: accountTrades.length > 0 ? "1 : 2.1" : "0", 
    totalRR: accountTrades.length > 0 ? "+0.0R" : "0R", 
    winRate: `%${winRateNum}` 
  };

  // Seçilen aya ve yıla göre o ayın gün sayısını dinamik hesaplama (Artık yıl kontrolü dahil)
  const getDaysInMonth = (monthName: string, year: number) => {
    const monthIndex = months.indexOf(monthName);
    // JavaScript'te monthIndex + 1 ve gün 0 verilerek ilgili ayın son günü alınır
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  const daysInSelectedMonth = getDaysInMonth(selectedMonth, selectedYear);

  // Dinamik takvim günleri (Seçilen aya ve yıla göre tam gün sayısı)
  const calendarData = Array.from({ length: daysInSelectedMonth }, (_, index) => {
    const dayNum = index + 1;
    return { id: dayNum, date: `${dayNum} ${selectedMonth.slice(0, 3)}`, pnl: 0, trades: 0 };
  });

  const avgPerformanceData = [
    { id: 1, label: "Averaj Kayıp", amount: "-$0.00", height: "0%", color: "bg-[#de5259]" },
    { id: 2, label: "Averaj Kazanç", amount: "+$0.00", height: "0%", color: "bg-[#69b76c]" }
  ];

  const tradedPairs: { name: string; count: number; color: string; }[] = [];
  const totalTrades = tradedPairs.reduce((acc, curr) => acc + curr.count, 0);
  const [hoveredPair, setHoveredPair] = useState<{name: string, count: number, color: string} | null>(null);

  const themeBg = isDarkMode ? "bg-[#090E17]" : "bg-gray-50";
  const textColor = isDarkMode ? "text-gray-100" : "text-gray-900";
  const cardBg = isDarkMode ? "bg-[#111827] border-[#1F2937]" : "bg-white border-gray-100";
  const subTextColor = isDarkMode ? "text-gray-400" : "text-gray-500";
  const headingColor = isDarkMode ? "text-white" : "text-[#0B132B]";
  const modalBg = isDarkMode ? "bg-[#111827] border-[#1F2937]" : "bg-white border-gray-200";

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() !== '' && password.trim() !== '') setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B132B] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#1C2541] rounded-full mix-blend-screen filter blur-[100px] opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#69b76c] rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>
        
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10 relative">
          <div className="p-8 text-center bg-gray-50 border-b border-gray-100">
            <h1 className="text-3xl font-bold text-[#0B132B] tracking-tight" style={{ fontFamily: 'SF Pro' }}>Gain. Trading Journal</h1>
            <p className="text-sm text-gray-500 mt-2">
              {authMode === 'login' ? 'Trading günlüğünüze geri dönün.' : 'Yeni bir hesap oluşturarak başlayın.'}
            </p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleAuthSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Kullanıcı Adı</label>
                <input 
                  type="text" 
                  required 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-black focus:outline-none focus:border-[#0B132B]" 
                  placeholder="Kullanıcı adınız" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Şifre</label>
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-black focus:outline-none focus:border-[#0B132B]" 
                  placeholder="••••••••" 
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-[#0B132B] hover:bg-[#1C2541] text-white font-bold py-3 rounded-lg transition-colors shadow-md mt-2"
              >
                {authMode === 'login' ? 'Giriş Yap' : 'Yeni Hesap Oluştur'}
              </button>
            </form>

            <div className="mt-6 text-center border-t border-gray-100 pt-4">
              <button 
                type="button"
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-sm text-gray-600 hover:text-[#0B132B] font-medium transition-colors"
              >
                {authMode === 'login' ? "Hesabınız yok mu? Yeni hesap oluşturun" : "Zaten hesabınız var mı? Giriş yapın"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeBg} ${textColor} font-sans flex flex-col transition-colors duration-300`}>
      <header className="w-full bg-gradient-to-l from-[#0B132B] to-[#1C2541] p-4 flex justify-between items-center shadow-md border-b border-white/5">
        <div className="flex items-center gap-4">
          <h1 className="text-white text-2xl font-bold tracking-tight" style={{ fontFamily: 'SF Pro' }}>Gain. Trading Journal</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => {setIsAuthenticated(false); setUsername(''); setPassword('');}} className="text-xs font-semibold text-gray-300 hover:text-white px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors">Çıkış Yap</button>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white flex items-center justify-center">
            {isDarkMode ? '🌞' : '🌙'}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-gray-300 text-sm hidden sm:inline">Aktif Hesap:</span>
            <select className="bg-white/10 text-white border border-white/20 rounded-md p-1.5 text-sm focus:outline-none cursor-pointer" value={activeProfile.id} onChange={(e) => setActiveProfile(profiles.find(p => p.id === Number(e.target.value)) || profiles[0])}>
              {profiles.map(profile => <option key={profile.id} value={profile.id} className="text-black">{profile.name}</option>)}
            </select>
            <button onClick={() => setShowAccountModal(true)} className="bg-white/20 hover:bg-white/30 text-white w-8 h-8 rounded-md flex items-center justify-center font-bold transition-colors" title="Yeni Hesap Ekle">+</button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
            <div>
              <h2 className={`text-3xl font-semibold ${headingColor}`} style={{ fontFamily: 'SF Pro' }}>{activeProfile.name}</h2>
              <p className={`${subTextColor} mt-1`}>Hoş geldin, <span className="font-semibold">{username}</span> | {selectedMonth} {selectedYear}</p>
            </div>
            <button onClick={() => setShowTradeModal(true)} className="bg-[#69b76c] hover:bg-[#5da660] text-white font-bold py-2.5 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
              + Yeni İşlem
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className={`${cardBg} p-5 rounded-xl shadow-sm border flex flex-col justify-center`}>
              <span className={`text-sm font-medium ${subTextColor} mb-1`}>Başlangıç Bakiyesi</span>
              <span className={`text-2xl font-bold ${headingColor}`}>${activeProfile.initialBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className={`${cardBg} p-5 rounded-xl shadow-sm border flex flex-col justify-center`}>
              <span className={`text-sm font-medium ${subTextColor} mb-1`}>Güncel Bakiye</span>
              <span className={`text-2xl font-bold ${activeProfile.currentBalance >= activeProfile.initialBalance ? 'text-[#69b76c]' : 'text-[#de5259]'}`}>${activeProfile.currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="bg-[#0B132B] p-5 rounded-xl shadow-sm border border-[#1C2541] flex flex-col justify-center relative overflow-hidden">
              <span className="text-sm font-medium text-gray-300 mb-1">1R Risk Miktarı</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">${activeProfile.riskAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                <span className="text-md font-semibold text-gray-400 bg-white/10 px-2 py-0.5 rounded">% {riskPercentage}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className={`lg:col-span-2 ${cardBg} p-6 rounded-xl shadow-sm border`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
                <h3 className={`text-lg font-semibold ${headingColor}`}>Aylık Takvim ({daysInSelectedMonth} Gün)</h3>
                <div className="flex items-center gap-2">
                  <select className={`${isDarkMode ? 'bg-[#1F2937] border-[#374151] text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-700'} text-sm rounded-md px-3 py-1.5 cursor-pointer`} value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select className={`${isDarkMode ? 'bg-[#1F2937] border-[#374151] text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-700'} text-sm rounded-md px-3 py-1.5 cursor-pointer`} value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              
              {/* Dinamik Takvim Izgarası (Ayın gün sayısına göre tam adaptasyon) */}
              <div className="grid grid-cols-7 gap-2 max-h-[380px] overflow-y-auto pr-1">
                {calendarData.map((day) => {
                  let boxBg = isDarkMode ? "bg-[#1F2937] border-[#374151]" : "bg-gray-50 border-gray-200"; 
                  let boxText = isDarkMode ? "text-gray-400" : "text-gray-500";
                  return (
                    <div key={day.id} className={`flex flex-col p-2.5 rounded-lg border ${boxBg} min-h-[75px] justify-between`}>
                      <span className={`text-[11px] font-semibold ${boxText}`}>{day.date}</span>
                    </div>
                  );
                })}
              </div>

              {/* YILLIK SONUÇLAR */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <h4 className={`text-md font-bold ${headingColor} mb-4`}>Yıllık Sonuçlar ({selectedYear})</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {[
                    { label: 'TOTAL KAZANÇ', val: `$${yearlyStats.totalWin}`, color: 'text-[#69b76c]' },
                    { label: 'TOTAL KAYIP', val: `$${yearlyStats.totalLoss}`, color: 'text-[#de5259]' },
                    { label: 'NET SONUÇ', val: `$${yearlyStats.net}`, color: headingColor },
                    { label: 'AVG R:R', val: yearlyStats.avgRR, color: 'text-blue-400' },
                    { label: 'TOTAL R:R', val: yearlyStats.totalRR, color: 'text-purple-400' },
                    { label: 'WIN RATE', val: yearlyStats.winRate, color: 'text-[#69b76c]' }
                  ].map((item, i) => (
                    <div key={i} className="text-center bg-black/20 p-3 rounded-lg border border-white/5">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                      <p className={`text-sm md:text-base font-bold ${item.color}`}>{item.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="bg-[#1C1C1E] p-6 rounded-xl shadow-sm border border-[#2C2C2E] flex flex-col">
                <h3 className="text-lg font-semibold text-white mb-2">Averaj PnL</h3>
                <div className="flex items-end justify-center gap-12 h-36 mt-2">
                  {avgPerformanceData.map((data) => (
                    <div key={data.id} className="flex flex-col items-center h-full justify-end w-20 group">
                      <span className="text-white font-bold text-[15px] mb-2">{data.amount}</span>
                      <div className={`w-full rounded-t-md opacity-90 ${data.color}`} style={{ height: data.height }}></div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-12 w-full mt-3 border-t border-gray-700 pt-3">
                  {avgPerformanceData.map((data) => (
                    <div key={data.id} className="w-20 text-center">
                      <span className="text-xs font-medium text-gray-400 whitespace-nowrap">{data.label}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-[#2C2C2E]">
                  <div className="flex flex-col items-center text-center">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Pozisyon</span>
                    <span className="text-lg font-bold text-white">0</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Win Rate</span>
                    <span className="text-lg font-bold text-[#69b76c]">%0</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">R:R Ratio</span>
                    <span className="text-lg font-bold text-[#69b76c]">0</span>
                  </div>
                </div>
              </div>

              {/* MOST TRADED */}
              <div className="bg-[#1C1C1E] p-6 rounded-xl shadow-sm border border-[#2C2C2E] flex flex-col items-start justify-center relative">
                <h3 className="text-lg font-semibold text-gray-400 mb-6 tracking-wide">Most Traded</h3>
                <div className="flex items-center justify-between w-full pr-4">
                  <span className="text-xl font-bold text-white tracking-widest">{hoveredPair ? hoveredPair.name : 'Veri Yok'}</span>
                  <div className="relative w-24 h-24">
                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                      <circle cx="18" cy="18" r="15.9155" fill="transparent" stroke="#2C2C2E" strokeWidth="4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* YENİ İŞLEM MODALI */}
      {showTradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`${modalBg} p-6 rounded-2xl w-full max-w-lg shadow-2xl`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-bold ${headingColor}`}>AI ile Yeni İşlem Ekle</h2>
              <button onClick={() => setShowTradeModal(false)} className={`${subTextColor} hover:text-[#de5259]`}>✕</button>
            </div>
            
            {/* TRADINGVIEW EKRAN GÖRÜNTÜSÜ YÜKLEME ALANI */}
            <div className={`border-2 border-dashed ${isDarkMode ? 'border-gray-600 hover:border-[#69b76c]' : 'border-gray-300 hover:border-[#69b76c]'} rounded-xl p-6 text-center mb-5 transition-colors cursor-pointer flex flex-col items-center justify-center bg-black/5`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${subTextColor} mb-2`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              <p className={`font-semibold ${textColor} text-sm mb-1`}>TradingView Görselini Sürükle</p>
              <p className={`text-xs ${subTextColor}`}>Yapay zeka parite, yön ve R oranını otomatik analiz eder.</p>
            </div>

            {/* SS YÜKLEME EKRANI İÇİN GÜN VE AY SEÇME BAREMİ */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className={`block text-xs font-semibold ${subTextColor} mb-1`}>İşlem Günü</label>
                <select 
                  className={`w-full ${isDarkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-gray-50 border-gray-300 text-black'} border rounded-lg px-3 py-2 text-sm focus:outline-none`}
                  value={tradeDay}
                  onChange={(e) => setTradeDay(Number(e.target.value))}
                >
                  {Array.from({ length: getDaysInMonth(tradeMonth, selectedYear) }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d} className="text-black">{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block text-xs font-semibold ${subTextColor} mb-1`}>İşlem Ayı</label>
                <select 
                  className={`w-full ${isDarkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-gray-50 border-gray-300 text-black'} border rounded-lg px-3 py-2 text-sm focus:outline-none`}
                  value={tradeMonth}
                  onChange={(e) => setTradeMonth(e.target.value)}
                >
                  {months.map(m => (
                    <option key={m} value={m} className="text-black">{m}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* FON YÖNETİMİ / RİSK BAREMİ */}
            <div className="mb-6">
              <label className={`block text-sm font-semibold ${subTextColor} mb-2`}>Fon Yönetimi - Risk Baremi</label>
              <div className="flex gap-2 mb-3">
                {['%0.5', '%1.0', 'sabit'].map(r => (
                  <button 
                    key={r} 
                    onClick={() => handleRiskChange(r)} 
                    className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${selectedRisk === r ? 'bg-[#0B132B] text-white border-[#0B132B]' : isDarkMode ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10' : 'bg-gray-100 border-gray-200 text-gray-700'}`}
                  >
                    {r === 'sabit' ? 'Sabit $' : r}
                  </button>
                ))}
              </div>
              
              {selectedRisk === 'sabit' && (
                <div className="mt-2">
                  <label className={`block text-xs text-gray-400 mb-1`}>Sabit Tutar ($) - Otomatik Kaydedilir</label>
                  <input 
                    type="number" 
                    value={fixedRiskAmount} 
                    onChange={(e) => { 
                      setFixedRiskAmount(e.target.value); 
                      localStorage.setItem('fixedRiskAmount', e.target.value); 
                    }} 
                    className={`w-full ${isDarkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-gray-50 border-gray-300 text-black'} border rounded-lg px-4 py-2 focus:outline-none focus:border-[#0B132B]`} 
                    placeholder="Örn: 20" 
                  />
                </div>
              )}
            </div>

            <button onClick={() => setShowTradeModal(false)} className="w-full bg-[#69b76c] hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors shadow-md">İşlemi Kaydet</button>
          </div>
        </div>
      )}

      {/* YENİ HESAP EKLE MODALI */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`${modalBg} p-6 rounded-2xl w-full max-w-sm shadow-2xl`}>
            <h2 className={`text-xl font-bold ${headingColor} mb-5`}>Yeni Hesap Oluştur</h2>
            
            <form onSubmit={handleCreateAccount}>
              <div className="mb-4">
                <label className={`block text-sm font-semibold ${subTextColor} mb-1`}>Hesap İsmi</label>
                <input 
                  type="text" 
                  required
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  className={`w-full ${isDarkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-gray-50 border-gray-300 text-black'} border rounded-lg px-4 py-2.5 focus:outline-none`} 
                  placeholder="Örn: $100 -> $1000" 
                />
              </div>
              <div className="mb-6">
                <label className={`block text-sm font-semibold ${subTextColor} mb-1`}>Başlangıç Bakiyesi ($)</label>
                <input 
                  type="number" 
                  required
                  value={newAccountBalance}
                  onChange={(e) => setNewAccountBalance(e.target.value)}
                  className={`w-full ${isDarkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-gray-50 border-gray-300 text-black'} border rounded-lg px-4 py-2.5 focus:outline-none`} 
                  placeholder="Örn: 10000" 
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowAccountModal(false)} className={`px-5 py-2.5 rounded-lg font-medium ${subTextColor}`}>İptal</button>
                <button type="submit" className="px-5 py-2.5 rounded-lg bg-[#0B132B] text-white font-bold hover:bg-[#1C2541]">Oluştur</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
