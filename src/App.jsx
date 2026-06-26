import React, { useState, useEffect, useRef } from 'react';

// --- CSS STİLLERİ ---
const cssStyles = `
  @keyframes floatCloud { 0% { transform: translateX(-20vw); opacity: 0; } 10% { opacity: 0.6; } 90% { opacity: 0.6; } 100% { transform: translateX(110vw); opacity: 0; } }
  @keyframes firefly { 0% { opacity: 0; transform: translateY(0) scale(1); } 50% { opacity: 1; transform: translateY(-20px) scale(1.2); } 100% { opacity: 0; transform: translateY(-40px) scale(1); } }
  @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  @keyframes shake { 0% { transform: translateX(0); } 25% { transform: translateX(-5px); } 50% { transform: translateX(5px); } 75% { transform: translateX(-5px); } 100% { transform: translateX(0); } }
  @keyframes jumpOver { 0% { transform: translate(-90px, 0) rotate(-15deg); opacity: 0; } 20% { opacity: 1; } 50% { transform: translate(0, -65px) rotate(0deg); opacity: 1; } 80% { opacity: 1; } 100% { transform: translate(90px, 0) rotate(15deg); opacity: 0; } }
  @keyframes pulse { 0% { transform: scale(1); filter: drop-shadow(0 0 30px #f1c40f); } 50% { transform: scale(1.1); filter: drop-shadow(0 0 50px #f39c12); } 100% { transform: scale(1); filter: drop-shadow(0 0 30px #f1c40f); } }
  
  .glass-card { background: rgba(255, 255, 255, 0.35); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.4); box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15); transition: transform 0.3s ease; }
  .glass-card:hover { transform: translateY(-6px); }
  .rpg-box { background: #1a1a1a; border: 3px solid #4a3c31; border-radius: 12px; box-shadow: inset 0 0 15px rgba(0,0,0,0.8); color: #e0d6cc; font-family: monospace; }
  .item-slot { width: 40px; height: 40px; background: #2a221b; border: 2px solid #5a4a3e; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer; position: relative; }
  .rpg-btn { background: linear-gradient(to bottom, #7e3f20, #4e2310); border: 2px solid #a86540; color: #fff; padding: 7px 12px; border-radius: 6px; font-weight: bold; cursor: pointer; font-family: monospace; font-size: 0.8rem; transition: filter 0.2s; }
  .rpg-btn:hover:not(:disabled) { filter: brightness(1.2); }
  .rpg-btn:disabled { filter: grayscale(1); cursor: not-allowed; opacity: 0.5; }
  .stat-btn { background: #2ecc71; color: #000; border: none; border-radius: 4px; width: 20px; height: 20px; font-weight: bold; cursor: pointer; }
  .fridge-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; max-height: 230px; overflow-y: auto; padding: 6px; background: rgba(0,0,0,0.5); border-radius: 8px; border: 2px inset #555; }
  .fridge-item { background: #2c3e50; border: 1px solid #7f8c8d; border-radius: 6px; padding: 4px; text-align: center; cursor: grab; user-select: none; font-size: 1.3rem; transition: transform 0.1s; }
  .fridge-item:active { cursor: grabbing; transform: scale(0.90); }
  .cook-station { background: #222; border: 2px dashed #666; border-radius: 8px; padding: 6px; min-height: 65px; transition: background 0.2s; }
  .cook-station.drag-over { background: #34495e; border-color: #f1c40f; }
  .comment-input { width: 70%; padding: 6px; border-radius: 4px; border: 1px solid #555; background: #222; color: #fff; font-size: 0.8rem; }
  .tray-slot { background: #111; border: 2px inset #555; border-radius: 8px; padding: 8px; min-height: 60px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
  .sheep-animate { animation: jumpOver 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; font-size: 1.8rem; position: absolute; }
  .log-console { position: fixed; bottom: 10px; right: 10px; background: rgba(0,0,0,0.85); color: #2ecc71; padding: 10px; font-family: monospace; font-size: 0.7rem; border-radius: 6px; border: 1px solid #444; z-index: 999; max-width: 250px; pointer-events: none; }
  .welcome-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(10,10,10,0.96); color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 99999; backdrop-filter: blur(8px); }
  .bg-layer { position: fixed; inset: 0; z-index: -5; transition: opacity 1.5s ease-in-out; }
  .dish-item { font-size: 1.8rem; padding: 8px; background: rgba(0,0,0,0.4); border: 2px solid #555; border-radius: 50%; cursor: grab; display: inline-block; margin: 0 5px; }
  .dish-item:active { cursor: grabbing; }
  .wash-station { border: 2px dashed #666; border-radius: 8px; padding: 15px; min-height: 80px; display: flex; align-items: center; justify-content: center; font-size: 2rem; background: #222; }
`;

const schedule = [
  { id: 1, time: '08:00 - 09:00', title: 'Güne Başlangıç', desc: 'Uyanış, yüz yıkama, hızlı bir kahvaltı ve diş fırçalama.', icon: '🌅', music: 'Sabah Enerjisi', img: 'https://images.unsplash.com/photo-1506844902170-5c37eb452626?w=400&q=80' },
  { id: 2, time: '09:45 - 12:00', title: 'Nümerik Analiz', desc: 'Günün ilk dersi. MATLAB ve teorik notlar.', icon: '📓', music: 'Akademik Odak', img: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&q=80', hasNumericNote: true },
  { id: 3, time: '12:00 - 13:25', title: 'Öğle Arası', desc: 'Yemekhaneye inip pratik bir şeyler alma.', icon: '🍽️', music: 'Mola Zamanı', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80' },
  { id: 4, time: '13:25 - 16:00', title: 'İnternet Programlama', desc: 'Web teknolojileri ve modern kodlama mimarileri üzerine çalışma.', icon: '🌐', music: 'Kodlama Modu', img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80' },
  { id: 5, time: '16:00 - 17:40', title: 'Eve Dönüş', desc: 'Kampüse veda, müzik eşliğinde yolculuk.', icon: '🚶‍♂️', music: 'Yol Müzikleri', img: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&q=80' },
  { id: 6, time: '17:40 - 19:00', title: 'Dinlenme Molası', desc: 'Günün yorgunluğunu atmak için sakin dinlenme saati.', icon: '🛋️', music: 'Sakinlik', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80' },
  { id: 7, time: '19:00 - 20:00', title: 'Mutfak Mesaisi', desc: 'Yemekleri yap ve Tepsiye diz. Yeme işlemi bir sonraki saatte!', icon: '🍳', music: 'Yemek Arka Planı', img: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&q=80', hasKitchenGame: true },
  { id: 8, time: '20:00 - 20:30', title: 'Akşam Yemeği & Temizlik', desc: 'Mutfakta hazırladığın tepsiyi burada yiyip bulaşıkları yıkayabilirsin.', icon: '🧽', music: 'Akşam Jazı', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80', hasDinnerGame: true },
  { id: 9, time: '20:30 - 22:00', title: 'Günün Tekrarı', desc: 'Okulda işlenen konuların verimli bir tekrarı.', icon: '📚', music: 'Odaklanma', img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80' },
  { id: 10, time: '22:00 - 00:00', title: 'Oyun & Kafa Dağıtma', desc: '15 Bölümlük Zindan! Öldüğünde sadece 1 dirilme hakkın var.', icon: '🎮', music: 'Game OST', img: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=400&q=80', hasMiniGame: true },
  { id: 11, time: '00:00 - 02:30', title: 'Gece Sineması', desc: 'Favori yapımlar ve kalıcı yorum sistemi:', icon: '🍿', music: 'Gece Modu', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80', hasShowsCarousel: true },
  { id: 12, time: '02:30 - 08:00', title: 'Derin Uyku & Rüyalar', desc: 'Çitten atlayan kuzular ve rüya simülatörü.', icon: '💤', music: 'Gece Sessizliği', img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80', hasSleepSection: true }
];

// --- SES MOTORU ---
const playAudio = (type) => {
  if (!window.AudioContext && !window.webkitAudioContext) return;
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator(); const gain = ctx.createGain();
  osc.connect(gain); gain.connect(ctx.destination); const now = ctx.currentTime;
  if (type === 'hit') { osc.type = 'square'; osc.frequency.setValueAtTime(180, now); osc.frequency.linearRampToValueAtTime(60, now + 0.1); gain.gain.setValueAtTime(0.08, now); gain.gain.linearRampToValueAtTime(0.001, now + 0.1); osc.start(now); osc.stop(now + 0.1); } 
  else if (type === 'heal') { osc.type = 'sine'; osc.frequency.setValueAtTime(300, now); osc.frequency.exponentialRampToValueAtTime(700, now + 0.2); gain.gain.setValueAtTime(0.06, now); gain.gain.linearRampToValueAtTime(0.001, now + 0.2); osc.start(now); osc.stop(now + 0.2); } 
  else if (type === 'coin') { osc.type = 'sine'; osc.frequency.setValueAtTime(987, now); osc.frequency.setValueAtTime(1318, now + 0.08); gain.gain.setValueAtTime(0.05, now); gain.gain.linearRampToValueAtTime(0.001, now + 0.25); osc.start(now); osc.stop(now + 0.25); } 
  else if (type === 'win') { osc.type = 'square'; osc.frequency.setValueAtTime(400, now); osc.frequency.setValueAtTime(600, now + 0.1); osc.frequency.setValueAtTime(800, now + 0.2); gain.gain.setValueAtTime(0.05, now); gain.gain.linearRampToValueAtTime(0.001, now + 0.4); osc.start(now); osc.stop(now + 0.4); } 
  else if (type === 'lose') { osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, now); osc.frequency.linearRampToValueAtTime(40, now + 0.5); gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0.001, now + 0.5); osc.start(now); osc.stop(now + 0.5); }
};

// --- NÜMERİK ANALİZ NOTU (BOGAZICILI) ---
const NumericNote = () => {
  const [show, setShow] = useState(false);
  return (
    <div style={{ marginTop: '15px' }}>
      <button onClick={() => setShow(!show)} className="rpg-btn" style={{ background: '#2980b9', padding: '10px 20px', fontSize: '1rem' }}>📸 Boğaziçili Notunu Aç</button>
      {show && (
        <div style={{ marginTop: '15px', animation: 'bounce 0.5s' }}>
          <img src="/bogazicili.jpg" alt="Nümerik Notu" style={{ width: '100%', borderRadius: '12px', border: '3px solid #f1c40f', boxShadow: '0 5px 20px rgba(0,0,0,0.5)' }} />
        </div>
      )}
    </div>
  );
};

// --- MİNİ OYUN 1: DEV SÜRÜKLEMELİ MUTFAK ---
const KitchenGame = ({ globalTray, setGlobalTray, setIsEaten, setWashResetKey }) => {
  const [showRecipes, setShowRecipes] = useState(false);
  const [stationContents, setStationContents] = useState({ pan: [], pot: [], oven: [], juicer: [],bowl: [] });
  const [cookingState, setCookingState] = useState('idle'); 
  const [activeStation, setActiveStation] = useState(null);
  const [cookTime, setCookTime] = useState(0); 
  const timerRef = useRef(null);
  const [currentResult, setCurrentResult] = useState(null);

  const ingList = [
    { id: 'kiyma', name: 'Kıyma', icon: '🥩' }, { id: 'tavuk', name: 'Tavuk', icon: '🍗' },
    { id: 'yumurta', name: 'Yumurta', icon: '🥚' }, { id: 'sucuk', name: 'Sucuk', icon: '🌭' },
    { id: 'peynir', name: 'Peynir', icon: '🧀' }, { id: 'tereyagi', name: 'Tereyağı', icon: '🧈' },
    { id: 'zeytinyagi', name: 'Zeytinyağı', icon: '🫒' }, { id: 'sut', name: 'Süt', icon: '🥛' },
    { id: 'su', name: 'Su', icon: '💧' }, { id: 'un', name: 'Un', icon: '🌾' },
    { id: 'seker', name: 'Şeker', icon: '🍬' }, { id: 'pirinc', name: 'Pirinç', icon: '🍚' },
    { id: 'makarna', name: 'Makarna', icon: '🍝' }, { id: 'mercimek', name: 'Mercimek', icon: '🧆' },
    { id: 'fasulye', name: 'Fasulye', icon: '🫘' }, { id: 'domates', name: 'Domates', icon: '🍅' },
    { id: 'biber', name: 'Biber', icon: '🌶️' }, { id: 'sogan', name: 'Soğan', icon: '🧅' },
    { id: 'patates', name: 'Patates', icon: '🥔' }, { id: 'marul', name: 'Marul', icon: '🥬' },
    { id: 'ekmek', name: 'Ekmek', icon: '🥖' }, { id: 'salca', name: 'Salça', icon: '🥫' },
    { id: 'elma', name: 'Elma', icon: '🍎' }, { id: 'portakal', name: 'Portakal', icon: '🍊' },
    { id: 'limon', name: 'Limon', icon: '🍋' }, { id: 'cilek', name: 'Çilek', icon: '🍓' },
    { id: 'kola', name: 'Kola', icon: '🥤' }, { id: 'ayran', name: 'Ayran', icon: '🧃' },
    { id: 'tuz', name: 'Tuz', icon: '🧂' }
  ];

  const recipesList = [
    { n: 'Kasap Köfte', s: 'pan', i: '🥩', req: ['kiyma', 'sogan'], salt: true, slot: 'main', win: 'Mangal lezzetini aratmayan harika bir köfte!', nosalt: 'Köfte güzel kızardı fakat tuzu eksik.' },
    { n: 'Sahanda Omlet', s: 'pan', i: '🍳', req: ['yumurta', 'peynir'], salt: true, slot: 'main', win: 'Peyniri kararında erimiş nefis omlet.', nosalt: 'Omlet pofuduk oldu ancak tuz eksik.' },
    { n: 'Öğrenci Menemeni', s: 'pan', i: '🥘', req: ['yumurta', 'domates', 'biber'], salt: true, slot: 'main', win: 'Pratik ve doyurucu klasiktir.', nosalt: 'Kıvamı harika fakat tuzu eksik.' },
    { n: 'Sucuklu Yumurta', s: 'pan', i: '🍳', req: ['sucuk', 'yumurta'], salt: true, slot: 'main', win: 'Sucuğun baharatı yumurtayla kusursuz birleşti.', nosalt: 'Sucuklar pişti fakat tuz eklenmemiş.' },
    { n: 'Tavuk Sote', s: 'pan', i: '🍗', req: ['tavuk', 'biber', 'domates'], salt: true, slot: 'main', win: 'Lokanta usulü sulu tavuk sote.', nosalt: 'Tavuk iyi pişti ancak tuzu yetersiz.' },
    { n: 'Patates Kızartması', s: 'pan', i: '🍟', req: ['patates', 'zeytinyagi'], salt: true, slot: 'salad', win: 'Çıtır çıtır altın sarısı kızartma!', nosalt: 'Patatesler güzel kızardı fakat tuzu eksik.' },
    { n: 'Balıkesir Burger', s: 'pan', i: '🍔', req: ['kiyma', 'domates', 'peynir', 'marul'], salt: true, slot: 'main', win: 'Gurme işi Balıkesir Burger!', nosalt: 'Burger harika pişti fakat tuzu az kalmış.' },
    { n: 'Kaşarlı Tost', s: 'pan', i: '🥪', req: ['ekmek', 'peynir', 'tereyagi'], salt: false, slot: 'salad', win: 'Dışı çıtır, içi sünen nefis tost.' },
    { n: 'Sade Makarna', s: 'pot', i: '🍝', req: ['makarna', 'su'], salt: true, slot: 'main', win: 'Hızlı ve pratik bir kurtarıcı.', nosalt: 'Makarna pişti fakat tuzsuz olduğu için yavan.' },
    { n: 'Salçalı Makarna', s: 'pot', i: '🍝', req: ['makarna', 'su', 'salca'], salt: true, slot: 'main', win: 'Salçası kavrulmuş çocukluk klasiği.', nosalt: 'Salça güzel renk verdi fakat su tuzsuz.' },
    { n: 'Mercimek Çorbası', s: 'pot', i: '🥣', req: ['mercimek', 'su', 'sogan'], salt: true, slot: 'soup', win: 'Tam lokanta usulü sapsarı şifa çorbası.', nosalt: 'Kıvamı iyi fakat tuzu az olduğu için hafif kalmış.' },
    { n: 'Domates Çorbası', s: 'pot', i: '🥣', req: ['domates', 'su', 'un'], salt: true, slot: 'soup', win: 'Kıvamı pürüzsüz harika domates çorbası.', nosalt: 'Rengi iyi fakat tuzu eksik.' },
    { n: 'Şehriyeli Pilav', s: 'pot', i: '🍚', req: ['pirinc', 'tereyagi', 'su'], salt: true, slot: 'main', win: 'Tane tane dökülen pilav!', nosalt: 'Pilav pişti ancak tuz eklemeyi unuttun.' },
    { n: 'Geleneksel Kuru Fasulye', s: 'pot', i: '🧆', req: ['fasulye', 'salca', 'sogan', 'su'], salt: true, slot: 'main', win: 'Helme dökmüş geleneksel kuru fasulye yemeği.', nosalt: 'Fasulyeler lokum gibi fakat tuzu yetersiz.' },
    { n: 'Haşlanmış Yumurta', s: 'pot', i: '🥚', req: ['yumurta', 'su'], salt: false, slot: 'salad', win: 'Kararında haşlanmış sporcu öğünü.' },
    { n: 'Fırın Sütlaç', s: 'oven', i: '🍮', req: ['sut', 'pirinc', 'seker'], salt: false, slot: 'salad', win: 'Üzeri kızarmış fırın sütlaç.' },
    { n: 'Karışık Pizza', s: 'oven', i: '🍕', req: ['un', 'domates', 'peynir', 'sucuk'], salt: true, slot: 'main', win: 'Harika bir gece kaçamağı pizzası!', nosalt: 'Malzemeler pişti fakat hamurun tuzu eksik.' },
    { n: 'Anne Keki', s: 'oven', i: '🧁', req: ['un', 'yumurta', 'seker', 'sut'], salt: false, slot: 'salad', win: 'Anne elinden çıkmış gibi kabarmış sıcacık kek.' },
    { n: 'Fırında Soslu Tavuk', s: 'oven', i: '🍗', req: ['tavuk', 'patates', 'salca'], salt: true, slot: 'main', win: 'Sosu patateslere işlemiş fırın tavuk yemeği.', nosalt: 'Tavuk kızardı fakat tuzu az kalmış.' },
    { n: 'Atom Meyve Suyu', s: 'juicer', i: '🥤', req: ['portakal', 'elma', 'limon'], salt: false, slot: 'drink', win: 'Üç meyvenin kusursuz karışımı, C vitamini atomu!' },
    { n: 'Taze Çilek Suyu', s: 'juicer', i: '🍓', req: ['cilek', 'seker'], salt: false, slot: 'drink', win: 'Tatlı ve serinletici çilek nektarı.' },
	{ n: 'Mevsim Salata', s: 'bowl', i: '🥗', req: ['marul', 'domates', 'zeytinyagi'], salt: true, slot: 'salad', win: 'Taptaze, zeytinyağlı enfes bir mevsim salatası!', nosalt: 'Salata çok taze ama tuzu eksik.' },
    { n: 'Ev Yapımı Limonata', s: 'juicer', i: '🍋', req: ['limon', 'su', 'seker'], salt: false, slot: 'drink', win: 'Buz gibi ev yapımı hakiki limonata.' }
  ];

  const handleDrop = (e, stKey) => {
    e.preventDefault();
    const ingId = e.dataTransfer.getData('text/plain');
    const item = ingList.find(i => i.id === ingId);
    if (!item || cookingState !== 'idle') return;
    setStationContents(prev => {
      const list = prev[stKey];
      if (list.some(x => x.id === item.id) || list.length >= 5) return prev;
      playAudio('coin'); return { ...prev, [stKey]: [...list, item] };
    });
  };

  const removeFromStation = (stKey, ingId) => {
    if (cookingState !== 'idle') return;
    playAudio('step');
    setStationContents(p => ({ ...p, [stKey]: p[stKey].filter(x => x.id !== ingId) }));
  };

  const startCooking = (stKey) => {
    if (stationContents[stKey].length === 0) return;
    setActiveStation(stKey); setCookingState('cooking'); setCookTime(0); playAudio('coin');
    timerRef.current = setInterval(() => {
      setCookTime(prev => {
        const next = prev + 0.1;
        if (next >= 30) { clearInterval(timerRef.current); setCookingState('burned'); playAudio('lose'); return 30; }
        return next;
      });
    }, 100);
  };

  const takeFood = () => { clearInterval(timerRef.current); evaluateMeal(activeStation); };

  const evaluateMeal = (stKey) => {
    setCookingState('result');
    const droppedIds = stationContents[stKey].map(i => i.id);
    const validRecipes = recipesList.filter(r => r.s === stKey);

    for (let r of validRecipes) {
      const hasSalt = droppedIds.includes('tuz');
      const droppedBase = droppedIds.filter(id => id !== 'tuz').sort().join(',');
      const reqBase = [...r.req].sort().join(',');

      if (droppedBase === reqBase) {
        let resObj = null;
        if (r.salt && !hasSalt) { playAudio('heal'); resObj = { title: `${r.i} ${r.n} (Tuzu Az)`, desc: r.nosalt, color: '#f39c12', slot: r.slot, icon: r.i }; } 
        else { playAudio('win'); resObj = { title: `✨ ${r.i} ${r.n}`, desc: r.win, color: '#2ecc71', slot: r.slot, icon: r.i }; }
        setCurrentResult(resObj);
        return;
      }
    }

    const sortedDropped = droppedIds.filter(id => id !== 'tuz').sort().join(',');
    const weirdMap = {
      'domates,sut': { title: '🍲 Kesilmiş Domatesli Süt', desc: 'Sütün asidi domatesle birleşince kesildi, pembe ve pürüzlü tuhaf bir sıvı.', color: '#e67e22', slot: 'soup', icon: '🍲' },
      'kiyma,tavuk': { title: '🥩 Çift Et Sote', desc: 'Hem kırmızı et hem beyaz et aynı tavada! Aşırı protein yüklü gövde gösterisi.', color: '#c0392b', slot: 'main', icon: '🥩' },
      'kola,sut': { title: '🧪 Asitli Süt Çürüğü', desc: 'Kolanın asidi sütü anında çürüttü. Kimya deneyi gibi, içilmesi tehlikeli.', color: '#8e44ad', slot: 'drink', icon: '🧪' }
    };

    if (weirdMap[sortedDropped]) { playAudio('heal'); setCurrentResult(weirdMap[sortedDropped]); return; }

    if (stKey === 'juicer') {
      const fruits = ['elma', 'portakal', 'limon', 'cilek'];
      const nonFruits = droppedIds.filter(id => !fruits.includes(id));
      if (nonFruits.length > 0) {
        playAudio('lose'); const badItem = ingList.find(i => i.id === nonFruits[0]);
        setCurrentResult({ title: `🩸 Sıkılmış Çiğ ${badItem.name} Suyu`, desc: `Meyve yerine ${badItem.name.toLowerCase()} attığınız için posası çıkmış korkunç bir sıvı elde ettiniz.`, color: '#c0392b', slot: 'drink', icon: '🧃' });
        return;
      } else {
        playAudio('win'); setCurrentResult({ title: '🥤 Karışık Taze Meyve Suyu', desc: 'Sıkacakta harmanlanan doğal meyve kürü.', color: '#f1c40f', slot: 'drink', icon: '🥤' }); return;
      }
    }

    const baseIngredients = droppedIds.filter(id => id !== 'tuz');
    const hasWater = droppedIds.includes('su');
    const hasLiquid = hasWater || droppedIds.includes('zeytinyagi') || droppedIds.includes('sut');
    const solids = baseIngredients.filter(id => !['su', 'zeytinyagi', 'sut'].includes(id));

    if (solids.length === 1) {
      const solidId = solids[0]; const item = ingList.find(i => i.id === solidId);
      const burnables = ['makarna', 'pirinc', 'mercimek', 'fasulye', 'un', 'seker', 'salca'];
      if (burnables.includes(solidId) && !hasLiquid) {
        playAudio('lose'); setCurrentResult({ title: `🔥 Kömür Olmuş ${item.name}`, desc: `Sıvı eklemeden sadece ${item.name.toLowerCase()} pişirmeye çalıştığınız için tamamen yanıp kömür oldu.`, color: '#e74c3c', slot: 'main', icon: '🔥' }); return;
      }

      let dynTitle = ''; let dynDesc = ''; let dynSlot = 'main';
      if (solidId === 'ekmek') {
        if (stKey === 'pot' && !hasWater) { dynTitle = '🔥 Kavrulmuş Kuru Ekmek'; dynDesc = 'Tencereye su koymadan boş metalde yaktın.'; }
        else if (stKey === 'pot' && hasWater) { dynTitle = '🍲 Suda Dağılmış Islak Ekmek'; dynDesc = 'Ekmek suyu çekip vıcık vıcık hamur oldu.'; dynSlot = 'soup'; }
        else { dynTitle = '✨ 🥖 Kızarmış Ekmek'; dynDesc = 'Çıtır ekmek dilimi.'; dynSlot = 'salad'; }
      } else if (['kola', 'ayran'].includes(solidId)) {
        dynTitle = `🔥 Ilıtılmış ${item.name}`; dynDesc = 'Hazır içeceği ateşe koyup gereksizce ısıttın ve tadını bozdun.'; dynSlot = 'drink';
      } else {
        dynTitle = `✨ ${item.icon} Sade Pişmiş ${item.name}`;
        dynDesc = stKey === 'pan' ? `Tavada sote ${item.name.toLowerCase()}.` : stKey === 'pot' ? `Haşlama ${item.name.toLowerCase()}.` : `Fırın ${item.name.toLowerCase()}.`;
      }
      playAudio('heal'); setCurrentResult({ title: dynTitle, desc: dynDesc, color: '#3498db', slot: dynSlot, icon: item.icon }); return;
    }
    playAudio('lose'); setCurrentResult({ title: '🍲 Özgün Bulamaç Denemesi', desc: 'Malzemelerin kombinasyonu mantıksız oldu. Tuhaf bir tat bıraktı.', color: '#e74c3c', slot: 'main', icon: '🍲' });
  };

  const handlePutToTray = () => {
    if (!currentResult) return; playAudio('coin');
    const targetSlot = currentResult.slot || 'main';
    setGlobalTray(prev => ({ ...prev, [targetSlot]: currentResult }));
    setIsEaten(false); // Yeni yemek konduğunda Akşam Yemeği kartı sıfırlanır
    setWashResetKey(k => k + 1); // Bulaşık oyunu sıfırlanır
    setStationContents({ pan: [], pot: [], oven: [], juicer: [] }); setCookingState('idle'); setCurrentResult(null);
  };

  const handleDirectDropToTray = (e) => {
    const ingId = e.dataTransfer.getData('text/plain');
    if (['kola', 'ayran'].includes(ingId)) {
        e.preventDefault();
        const item = ingList.find(i => i.id === ingId);
        playAudio('win');
        setGlobalTray(prev => ({ ...prev, drink: { title: `🧊 Buz Gibi ${item.name}`, desc: 'Dolaptan yeni çıkmış serinletici.', color: '#3498db', slot: 'drink', icon: item.icon } }));
        setIsEaten(false);
        setWashResetKey(k => k + 1);
    }
  };

  const getProgressColor = () => { if (cookTime < 20) return '#f1c40f'; if (cookTime <= 30) return '#2ecc71'; return '#e74c3c'; };

  return (
    <div className="rpg-box" style={{ marginTop: '15px', padding: '12px', maxWidth: '480px', margin: '15px auto 0', textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ color: '#f1c40f', fontWeight: 'bold' }}>🧑‍🍳 DEV YAŞAM & MUTFAK SİM</span>
        <button onClick={() => setShowRecipes(!showRecipes)} className="rpg-btn" style={{ background: '#2980b9' }}>📖 Tarif Kitabı</button>
      </div>

      {showRecipes && (
        <div style={{ background: '#000', padding: '8px', borderRadius: '6px', marginBottom: '10px', maxHeight: '110px', overflowY: 'auto', fontSize: '0.65rem', border: '1px solid #444' }}>
          <div style={{color:'#ffcc00', marginBottom:'3px'}}>* 20. ile 30. sn arası yemeği alın! <br/>* Kola ve Ayran'ı pişirmeden, <b>doğrudan Tepsiye</b> sürükleyebilirsiniz.</div>
          {recipesList.map((r, idx) => (<div key={idx} style={{color:'#bbb'}}>{r.i} <b>{r.n}</b> ({r.s}): {r.req.join(', ')}</div>))}
        </div>
      )}

      {cookingState === 'idle' ? (
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.7rem', color: '#aaa', marginBottom: '4px', textAlign: 'center' }}>❄️ BUZDOLABI</div>
            <div className="fridge-grid">
              {ingList.map(item => (
                <div key={item.id} draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', item.id)} className="fridge-item" title={item.name}>
                  <div>{item.icon}</div><div style={{fontSize:'0.5rem', overflow:'hidden'}}>{item.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: 1.3, display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {[['pan','🍳 Tava'], ['pot','🍲 Tencere'], ['oven','🎛️ Fırın'], ['juicer','🗜️ Sıkacak']].map(([stKey, label]) => (
              <div key={stKey} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, stKey)} className="cook-station">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: stKey==='juicer'?'#2ecc71':'#f1c40f', marginBottom: '2px' }}>
                  <span>{label}</span>
                  {stationContents[stKey].length > 0 && <button onClick={() => startCooking(stKey)} style={{ background: '#e67e22', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize:'0.7rem', padding:'2px 6px' }}>{stKey==='juicer'?'🗜️ Sık':'🔥 Pişir'}</button>}
                </div>
                <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                  {stationContents[stKey].length === 0 ? <span style={{fontSize:'0.6rem', color:'#555'}}>Sürükle...</span> : stationContents[stKey].map((i, idx) => (<div key={idx} onClick={() => removeFromStation(stKey, i.id)} style={{ background:'#000', padding:'1px 3px', borderRadius:'4px', cursor:'pointer', fontSize:'1rem' }}>{i.icon}</div>))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : cookingState === 'cooking' ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '3rem', animation: cookTime >= 20 ? 'shake 0.3s infinite' : 'bounce 0.5s infinite' }}>{activeStation === 'pan' ? '🍳' : activeStation === 'pot' ? '🍲' : activeStation === 'oven' ? '🎛️' : '🗜️'}</div>
          <div style={{ color: cookTime >= 20 ? '#2ecc71' : '#f1c40f', fontWeight: 'bold', margin: '8px 0' }}>{cookTime < 20 ? 'İşlem devam ediyor...' : '🔥 HAZIR! YANMADAN AL! 🔥'}</div>
          <div style={{ width: '100%', background: '#333', height: '16px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #555' }}><div style={{ width: `${(cookTime / 30) * 100}%`, background: getProgressColor(), height: '100%' }} /></div>
          <div style={{ fontSize: '0.75rem', color: '#ccc', marginTop: '4px' }}>{cookTime.toFixed(1)} / 30.0 Saniye</div>
          <button onClick={takeFood} disabled={cookTime < 20} className="rpg-btn" style={{ marginTop: '10px', width: '80%', padding: '10px', background: cookTime >= 20 ? '#27ae60' : '#555' }}>🍽️ {cookTime < 20 ? 'BEKLE...' : 'ATEŞTEN AL'}</button>
        </div>
      ) : cookingState === 'burned' ? (
        <div style={{ textAlign: 'center', padding: '15px 0' }}>
          <div style={{ fontSize: '3.5rem' }}>🔥</div><h3 style={{ color: '#e74c3c', margin: '5px 0' }}>KÖMÜR OLDU!</h3>
          <p style={{ fontSize: '0.8rem', color: '#ddd' }}>30 saniyeyi geçirdiniz.</p>
          <button onClick={() => { setStationContents({ pan: [], pot: [], oven: [], juicer: [] }); setCookingState('idle'); }} className="rpg-btn" style={{ background: '#c0392b' }}>🔄 Tezgâhı Temizle</button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '15px 0' }}>
          <div style={{ fontSize: '3rem' }}>{currentResult?.icon}</div>
          <h3 style={{ color: currentResult?.color, margin: '5px 0' }}>{currentResult?.title}</h3>
          <p style={{ fontSize: '0.85rem', color: '#ddd', margin: '0 0 12px 0' }}>{currentResult?.desc}</p>
          <div style={{ display:'flex', gap:'8px', justifyContent:'center' }}>
            <button onClick={handlePutToTray} className="rpg-btn" style={{ background: '#f39c12' }}>🍱 Tepsiye Yerleştir</button>
            <button onClick={() => { setStationContents({ pan: [], pot: [], oven: [], juicer: [] }); setCookingState('idle'); setCurrentResult(null); }} className="rpg-btn" style={{ background: '#555' }}>Çöpe At</button>
          </div>
        </div>
      )}

      {/* --- GLOBAL SERVİS TEPSİSİ GÖRÜNÜMÜ --- */}
      <div onDragOver={(e) => e.preventDefault()} onDrop={handleDirectDropToTray} style={{ marginTop: '18px', borderTop: '2px dashed #444', paddingTop: '12px', background: 'rgba(0,0,0,0.2)', borderRadius:'8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding:'0 5px' }}>
          <span style={{ color: '#ffcc00', fontWeight: 'bold', fontSize: '0.8rem' }}>🍱 HAZIRLANAN TEPSİ (Buradan Yemiyoruz!)</span>
        </div>
        <div style={{ fontSize: '0.7rem', color: '#aaa', padding: '0 5px 8px 5px' }}>Hazırladığın tepsiyi yemek ve bulaşıkları yıkamak için sayfayı aşağı, <b>Akşam Yemeği (20:00)</b> saatine kaydır.</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', padding:'0 5px 5px 5px' }}>
          <div className="tray-slot" style={{ borderColor: globalTray.soup ? '#2ecc71' : '#444' }}><span style={{fontSize:'0.6rem', color:'#777'}}>🥣 Çorba</span><div style={{fontSize:'1.8rem'}}>{globalTray.soup ? globalTray.soup.icon : '▫️'}</div></div>
          <div className="tray-slot" style={{ borderColor: globalTray.salad ? '#2ecc71' : '#444' }}><span style={{fontSize:'0.6rem', color:'#777'}}>🥗 Salata</span><div style={{fontSize:'1.8rem'}}>{globalTray.salad ? globalTray.salad.icon : '▫️'}</div></div>
          <div className="tray-slot" style={{ borderColor: globalTray.main ? '#2ecc71' : '#444' }}><span style={{fontSize:'0.6rem', color:'#777'}}>🍛 Ana Yemek</span><div style={{fontSize:'1.8rem'}}>{globalTray.main ? globalTray.main.icon : '▫️'}</div></div>
          <div className="tray-slot" style={{ borderColor: globalTray.drink ? '#2ecc71' : '#444' }}><span style={{fontSize:'0.6rem', color:'#777'}}>🥤 İçecek</span><div style={{fontSize:'1.8rem'}}>{globalTray.drink ? globalTray.drink.icon : '▫️'}</div></div>
        </div>
      </div>
    </div>
  );
};

// --- MİNİ OYUN 1.5: AKŞAM YEMEĞİ VE BULAŞIK SİMÜLATÖRÜ ---
const DinnerGame = ({ globalTray, isEaten, setIsEaten, washResetKey }) => {
  const hasFood = globalTray.soup || globalTray.salad || globalTray.main || globalTray.drink;
  const [dishes, setDishes] = useState([
    { id: 'd1', state: 'dirty', icon: '🍽️', name: 'Tabak' },
    { id: 'd2', state: 'dirty', icon: '🥣', name: 'Kase' },
    { id: 'd3', state: 'dirty', icon: '🥤', name: 'Bardak' }
  ]);
  const [machineStatus, setMachineStatus] = useState('idle'); // idle, running, done

  useEffect(() => {
    // Yeni yemek geldiğinde bulaşıkları kirlet
    setDishes([
      { id: 'd1', state: 'dirty', icon: '🍽️', name: 'Tabak' },
      { id: 'd2', state: 'dirty', icon: '🥣', name: 'Kase' },
      { id: 'd3', state: 'dirty', icon: '🥤', name: 'Bardak' }
    ]);
    setMachineStatus('idle');
  }, [washResetKey]);

  const handleEat = () => {
    playAudio('win');
    setIsEaten(true);
  };

  const handleWashDrop = (e, targetZone) => {
    e.preventDefault();
    const dishId = e.dataTransfer.getData('text/plain');
    
    if (targetZone === 'tap') {
      const dish = dishes.find(d => d.id === dishId);
      if (dish && dish.state === 'dirty') {
        playAudio('step'); // Su sesi alternatifi
        setDishes(prev => prev.map(d => d.id === dishId ? { ...d, state: 'rinsed' } : d));
      }
    } else if (targetZone === 'machine') {
      const dish = dishes.find(d => d.id === dishId);
      if (dish && dish.state === 'rinsed') {
        playAudio('coin'); // Tabak koyma sesi
        setDishes(prev => prev.map(d => d.id === dishId ? { ...d, state: 'loaded' } : d));
      } else if (dish && dish.state === 'dirty') {
        alert("Önce muslukta sudan geçirmelisin! Kirli bulaşık makineyi bozar.");
      }
    }
  };

  const startMachine = () => {
    playAudio('heal');
    setMachineStatus('running');
    setTimeout(() => {
      playAudio('win');
      setMachineStatus('done');
    }, 5000);
  };

  const allLoaded = dishes.every(d => d.state === 'loaded');

  if (!hasFood) {
    return <div className="rpg-box" style={{ padding: '20px', marginTop: '15px', textAlign: 'center', color: '#e74c3c' }}>Açsın! Önce saat 19:00'daki Mutfak Mesaisinde bir şeyler pişirip tepsiye koymalısın.</div>;
  }

  if (!isEaten) {
    return (
      <div className="rpg-box" style={{ padding: '15px', marginTop: '15px' }}>
        <h3 style={{ color: '#f1c40f', textAlign: 'center' }}>Mutfaktan Gelen Tepsi</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', margin: '15px 0' }}>
          <div className="tray-slot" style={{ borderColor: globalTray.soup ? '#2ecc71' : '#444' }}><div style={{fontSize:'2rem'}}>{globalTray.soup ? globalTray.soup.icon : '▫️'}</div></div>
          <div className="tray-slot" style={{ borderColor: globalTray.salad ? '#2ecc71' : '#444' }}><div style={{fontSize:'2rem'}}>{globalTray.salad ? globalTray.salad.icon : '▫️'}</div></div>
          <div className="tray-slot" style={{ borderColor: globalTray.main ? '#2ecc71' : '#444' }}><div style={{fontSize:'2rem'}}>{globalTray.main ? globalTray.main.icon : '▫️'}</div></div>
          <div className="tray-slot" style={{ borderColor: globalTray.drink ? '#2ecc71' : '#444' }}><div style={{fontSize:'2rem'}}>{globalTray.drink ? globalTray.drink.icon : '▫️'}</div></div>
        </div>
        <button onClick={handleEat} className="rpg-btn" style={{ width: '100%', padding: '15px', fontSize: '1.2rem', background: '#e67e22' }}>🍽️ ZİYAFETİ ÇEK (YE)</button>
      </div>
    );
  }

  // Bulaşık UI
  return (
    <div className="rpg-box" style={{ padding: '15px', marginTop: '15px' }}>
      <h3 style={{ color: '#3498db', textAlign: 'center', marginBottom: '5px' }}>🧽 Bulaşık Görevi</h3>
      <p style={{ fontSize: '0.75rem', color: '#ccc', textAlign: 'center', marginBottom: '15px' }}>Kirli bulaşıkları önce <b>Musluğa (🚰)</b> sürükle, sudan geçince <b>Makineye (🧼)</b> diz.</p>
      
      {machineStatus === 'idle' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px', minHeight: '60px' }}>
            {dishes.filter(d => d.state !== 'loaded').map(dish => (
              <div key={dish.id} draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', dish.id)} className="dish-item" style={{ filter: dish.state === 'dirty' ? 'sepia(1) hue-rotate(30deg) brightness(0.7)' : 'none', border: dish.state === 'rinsed' ? '2px solid #3498db' : '2px solid #8B4513' }} title={dish.state === 'dirty' ? `Kirli ${dish.name}` : `Sudan Geçmiş ${dish.name}`}>
                {dish.icon}
              </div>
            ))}
            {dishes.filter(d => d.state !== 'loaded').length === 0 && <div style={{ color: '#2ecc71', fontSize: '0.9rem', alignSelf: 'center' }}>Tezgahta bulaşık kalmadı!</div>}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div className="wash-station" onDragOver={e=>e.preventDefault()} onDrop={e=>handleWashDrop(e, 'tap')} style={{ flex: 1, borderColor: '#3498db' }}>
              🚰
            </div>
            <div className="wash-station" onDragOver={e=>e.preventDefault()} onDrop={e=>handleWashDrop(e, 'machine')} style={{ flex: 1, borderColor: '#95a5a6', position: 'relative' }}>
              🧼
              <div style={{ position: 'absolute', bottom: '5px', fontSize: '0.6rem', color: '#aaa' }}>{dishes.filter(d => d.state === 'loaded').length} / 3 Dolu</div>
            </div>
          </div>
          
          {allLoaded && (
            <button onClick={startMachine} className="rpg-btn" style={{ width: '100%', marginTop: '15px', background: '#2980b9', padding: '10px' }}>⚡ MAKİNEYİ ÇALIŞTIR</button>
          )}
        </>
      )}

      {machineStatus === 'running' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '4rem', animation: 'shake 0.2s infinite' }}>🧼</div>
          <div style={{ color: '#3498db', fontWeight: 'bold', marginTop: '15px' }}>Makine Yıkıyor... Su Sesleri... 🌊</div>
        </div>
      )}

      {machineStatus === 'done' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 20px #2ecc71)' }}>✨🍽️✨</div>
          <h3 style={{ color: '#2ecc71', marginTop: '15px' }}>Bulaşıklar Tertemiz!</h3>
          <p style={{ fontSize: '0.8rem', color: '#ccc' }}>Görev tamamlandı. Dinlenmeye geçebilirsin.</p>
        </div>
      )}
    </div>
  );
};

// --- MİNİ OYUN 2: EKSİKSİZ 15 BÖLÜMLÜK RPG ZİNDAN + GRUPLANMIŞ ENVANTER (STACKING) ---
const GameCenter = () => {
  const [tab, setTab] = useState('battle');
  const initP = { hp: 100, maxHp: 100, atk: 16, def: 5, lvl: 1, xp: 0, maxXp: 40, gold: 80, pot: 2, pts: 3, s: 0, v: 0, d: 0 };
  const [p, setP] = useState(initP);
  const [eq, setEq] = useState({ w: null, a: null });
  const [inv, setInv] = useState([{ id: 1, name: 'Paslı Hançer', t: 'w', v: 7, icon: '🗡️', color: '#aaa' }]);
  const [stg, setStg] = useState(1);
  const [en, setEn] = useState({ name: 'Mağara Yarasası', hp: 45, maxHp: 45, atk: 12, g: 25, xp: 20, i: '🦇' });
  const [log, setLog] = useState('15 Bölümlük macera başladı!');
  const [tState, setTState] = useState('player'); 
  const [revives, setRevives] = useState(1); 

  const totAtk = () => p.atk + (p.s * 3) + (eq.w?.v || 0);
  const totDef = () => p.def + (p.d * 2) + (eq.a?.v || 0);

  const addStat = (t) => {
    if (p.pts <= 0) return; playAudio('coin');
    setP(prev => {
      let n = { ...prev, pts: prev.pts - 1 };
      if (t === 's') n.s += 1; else if (t === 'v') { n.v += 1; n.maxHp += 15; n.hp += 15; } else if (t === 'd') n.d += 1;
      return n;
    });
  };

  const spawnEn = (sNum) => {
    const list = ['🦇 Yaban Yarasası', '🐺 Gölge Kurdu', '🕷️ Dev Örümcek', '🐗 Orman Domuzu', '💀 Kemik Asker', '🧟 Bataklık Zombisi', '🧙‍♂️ Kara Büyücü', '🪨 Taş Golem', '👻 Hayalet Şövalye', '👹 Cehennem İblisi', '🧛 Kan Emici Vampir', '🍄 Zehirli Mantar', '🤖 Mekano-Bekçi', '🧊 Buz Devi', '🐉🔥 KADİM EJDERHA'];
    const spl = (list[sNum - 1] || list[14]).split(' ');
    const eHp = 40 + (sNum * 35);
    setEn({ name: spl[1], hp: eHp, maxHp: eHp, atk: 10 + (sNum * 6), g: 20 + (sNum * 12), xp: 15 + (sNum * 15), i: spl[0] });
    setTState('player');
  };

  const enTurn = (curHp) => {
    setTState('enemy');
    setTimeout(() => {
      const dmg = Math.max(2, en.atk - totDef()); const nHp = curHp - dmg; playAudio('hit');
      if (nHp <= 0) { setP(x => ({ ...x, hp: 0 })); setTState('dead'); setLog(`💀 ${en.name} seni yenilgiye uğrattı!`); playAudio('lose'); } 
      else { setP(x => ({ ...x, hp: nHp })); setTState('player'); setLog(`Canavar ${dmg} hasar verdi.`); }
    }, 500);
  };

  const hit = () => {
    if (tState !== 'player') return; playAudio('hit');
    const dmg = totAtk() + Math.floor(Math.random()*5); const nextEnHp = en.hp - dmg;
    if (nextEnHp <= 0) {
      setEn(x => ({ ...x, hp: 0 })); setTState('won'); playAudio('win');
      let nXp = p.xp + en.xp; let nLvl = p.lvl; let nMaxXp = p.maxXp; let nMaxHp = p.maxHp; let nAtk = p.atk; let nPts = p.pts;
      let m = `${en.name} yenildi! +${en.g} Altın!`;
      if (nXp >= nMaxXp) { nLvl++; nXp -= nMaxXp; nMaxXp = Math.floor(nMaxXp * 1.5); nMaxHp += 20; nAtk += 4; nPts += 3; m += ' SEVİYE ATLADIN!'; }
      setP(x => ({ ...x, gold: x.gold + en.g, xp: nXp, lvl: nLvl, maxXp: nMaxXp, maxHp: nMaxHp, atk: nAtk, pts: nPts })); setLog(m);
    } else { setEn(x => ({ ...x, hp: nextEnHp })); setLog(`${dmg} hasar vurdun!`); enTurn(p.hp); }
  };

  const heal = () => {
    if (tState !== 'player' || p.pot <= 0 || p.hp >= p.maxHp) return; playAudio('heal');
    const hHp = Math.min(p.maxHp, p.hp + 50); setP(x => ({ ...x, hp: hHp, pot: x.pot - 1 })); setLog('İksir kullandın (+50 HP)'); enTurn(hHp);
  };

  const hardReset = () => { playAudio('lose'); setP(initP); setEq({ w: null, a: null }); setStg(1); setRevives(1); setLog('Her şey sıfırlandı. Bölüm 1.'); spawnEn(1); };
  const revive = () => { playAudio('heal'); setRevives(0); setP(x => ({ ...x, hp: x.maxHp })); setLog('Peri Gözyaşı seni hayata döndürdü.'); spawnEn(stg); };

  const buyBox = () => {
    if (p.gold < 50) return; playAudio('coin'); setP(x => ({ ...x, gold: x.gold - 50 }));
    
    const r = Math.random() * 100;
    let d;
    if (r <= 60) d = { name: 'Eski Hançer', t: 'w', v: 8, icon: '🗡️', color: '#95a5a6', rarity: 'Yaygın' }; // %60
    else if (r <= 80) d = { name: 'Deri Zırh', t: 'a', v: 12, icon: '🦺', color: '#2ecc71', rarity: 'Sıra Dışı' }; // %20
    else if (r <= 90) d = { name: 'Çelik Kılıç', t: 'w', v: 22, icon: '⚔️', color: '#3498db', rarity: 'Nadir' }; // %10
    else if (r <= 96) d = { name: 'Şövalye Zırhı', t: 'a', v: 35, icon: '🛡️', color: '#9b59b6', rarity: 'Destansı' }; // %6
    else if (r <= 98.5) d = { name: 'Excalibur', t: 'w', v: 60, icon: '⚡🗡️', color: '#e67e22', rarity: 'Efsanevi' }; // %2.5
    else if (r <= 99.5) d = { name: 'Ejderha Pulu Zırh', t: 'a', v: 90, icon: '🐉', color: '#e74c3c', rarity: 'Mitik' }; // %1.0
    else d = { name: 'Kozmik Yıkıcı', t: 'w', v: 200, icon: '🌌', color: '#00ffff', rarity: 'İlahi' }; // %0.5 Kalan Pay

    setInv(x => [{ ...d, id: Date.now() }, ...x]); setLog(`🎁 [${d.rarity}] ${d.name} kazanıldı!`);
    if (r > 96) playAudio('win');
  };

  // ENVANTER GRUPLAMA (STACKING LOGIC)
  const groupedInv = inv.reduce((acc, item) => {
    const existing = acc.find(i => i.name === item.name);
    if (existing) existing.count += 1; else acc.push({...item, count: 1});
    return acc;
  }, []);

  const equipGroup = (itemName) => {
    const actualItemIndex = inv.findIndex(i => i.name === itemName);
    if (actualItemIndex === -1) return;
    const actualItem = inv[actualItemIndex];
    playAudio('coin');
    setEq(prev => {
        const currentEquipped = prev[actualItem.t];
        let nextInv = [...inv];
        nextInv.splice(actualItemIndex, 1);
        if (currentEquipped) nextInv.push(currentEquipped);
        setInv(nextInv);
        return { ...prev, [actualItem.t]: actualItem };
    });
  };

  return (
    <div className="rpg-box" style={{ marginTop: '15px', padding: '12px', maxWidth: '460px', margin: '15px auto 0', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', background: '#111', padding: '6px 10px', borderRadius: '6px', marginBottom: '10px', fontSize: '0.8rem' }}>
        <span style={{ color: '#f1c40f' }}>🪙 {p.gold}</span><span>⭐ Lvl {p.lvl}</span><span style={{ color: '#e67e22' }}>🧪 x{p.pot}</span>
      </div>

      <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
        <button onClick={() => setTab('battle')} className="rpg-btn" style={{ flex: 1, background: tab==='battle'?'#8e44ad':'#333' }}>⚔️ Savaş (Blm {stg})</button>
        <button onClick={() => setTab('hero')} className="rpg-btn" style={{ flex: 1, background: tab==='hero'?'#27ae60':'#333' }}>🛡️ Stat {p.pts>0&&`(${p.pts})`}</button>
        <button onClick={() => setTab('shop')} className="rpg-btn" style={{ flex: 1, background: tab==='shop'?'#d35400':'#333' }}>🎁 Sandık</button>
      </div>

      {tab === 'battle' && (
        <div>
          <div style={{ background: '#222', padding: '10px', borderRadius: '8px', marginBottom: '8px' }}>
            <div style={{ fontSize: '3.5rem' }}>{en.i}</div><div style={{ color: '#f39c12', fontWeight: 'bold' }}>{en.name} ({en.hp} HP)</div>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#ccc', marginBottom: '8px' }}>{log}</div>
          <div style={{ fontSize: '0.8rem', color: '#2ecc71', marginBottom: '8px' }}>❤️ Canın: {p.hp}/{p.maxHp} | Atk: {totAtk()}</div>
          {tState === 'player' && <div style={{ display:'flex', gap:'6px' }}><button onClick={hit} className="rpg-btn" style={{flex:2, background:'#c0392b'}}>⚔️ SALDIR</button><button onClick={heal} className="rpg-btn" style={{flex:1, background:'#27ae60'}}>🧪 İKSİR ({p.pot})</button></div>}
          {tState === 'won' && stg < 15 && <button onClick={() => { setStg(s=>s+1); spawnEn(stg+1); }} className="rpg-btn" style={{width:'100%', background:'#f39c12'}}>SONRAKİ BÖLÜM ➡️</button>}
          {tState === 'won' && stg === 15 && <div style={{color:'#f1c40f', fontWeight:'bold'}}>🏆 15 BÖLÜM BİTTİ! TEBRİKLER! 🏆</div>}
          {tState === 'dead' && (revives > 0 ? <button onClick={revive} className="rpg-btn" style={{width:'100%', background:'#27ae60'}}>🧚‍♀️ DİRİL (Tek Hakkın)</button> : <button onClick={hardReset} className="rpg-btn" style={{width:'100%', background:'#c0392b'}}>💀 SIFIRLA VE BAŞTAN BAŞLA</button>)}
        </div>
      )}

      {tab === 'hero' && (
        <div style={{ fontSize: '0.75rem', textAlign:'left', padding:'0 5px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'5px', marginBottom:'12px' }}>
            {[['STR','s',p.s], ['VIT','v',p.v], ['DEF','d',p.d]].map(([lbl,key,val]) => (<div key={key} style={{background:'#222', padding:'6px', borderRadius:'4px', textAlign:'center'}}><b>{lbl}: {val}</b><br/><button onClick={()=>addStat(key)} disabled={p.pts<=0} className="stat-btn" style={{marginTop:'4px', marginLeft:'auto', marginRight:'auto'}}>+</button></div>))}
          </div>
          <div style={{color:'#f1c40f', marginBottom:'4px'}}>🛡️ Kuşanılmış Ekipmanlar:</div>
          <div style={{display:'flex', gap:'8px', marginBottom:'12px'}}>
            <div style={{background:'#222', padding:'6px', borderRadius:'4px', flex:1}}>Silah: {eq.w ? `${eq.w.icon} ${eq.w.name} (+${eq.w.v})` : 'Yok'}</div>
            <div style={{background:'#222', padding:'6px', borderRadius:'4px', flex:1}}>Zırh: {eq.a ? `${eq.a.icon} ${eq.a.name} (+${eq.a.v})` : 'Yok'}</div>
          </div>
          <div style={{color:'#bbb', marginBottom:'4px'}}>🎒 Çantadakiler (Gruplanmış - Tıkla ve Kuşan):</div>
          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', padding:'5px 0' }}>
            {groupedInv.map(g => (
              <div key={g.name} onClick={() => equipGroup(g.name)} className="item-slot" style={{borderColor: g.color}} title={`${g.name} (+${g.v})`}>
                {g.icon}
                {g.count > 1 && <span style={{position:'absolute', bottom:'-6px', right:'-6px', background:'#e74c3c', color:'#fff', fontSize:'0.55rem', padding:'2px 5px', borderRadius:'10px', fontWeight:'bold', border:'1px solid #111'}}>x{g.count}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'shop' && (
        <div style={{ textAlign: 'left', fontSize: '0.75rem', padding: '0 5px' }}>
          <div style={{ background: '#222', padding: '10px', borderRadius: '6px', marginBottom: '12px' }}>
            <div style={{ color: '#f1c40f', fontWeight: 'bold', marginBottom: '6px' }}>📊 Sandık Düşme Oranları</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', color: '#ccc' }}>
              <div>⚪ Yaygın: %60</div>
              <div>🟢 Sıra Dışı: %20</div>
              <div>🔵 Nadir: %10</div>
              <div>🟣 Destansı: %6</div>
              <div>🟠 Efsanevi: %2.5</div>
              <div>🔴 Mitik: %1.0</div>
              <div style={{ color: '#00ffff', fontWeight: 'bold', gridColumn: 'span 2' }}>🌌 İlahi (Kalan Pay): %0.5</div>
            </div>
          </div>
          <button onClick={buyBox} disabled={p.gold<50} className="rpg-btn" style={{width:'100%', padding:'15px', background:'#f39c12'}}>🎁 SANDIK AÇ (50🪙)</button>
        </div>
      )}
    </div>
  );
};

// --- MİNİ OYUN 3: DİZİ KESİTLERİ (YEREL KAPAKLARLA) + KALICI YORUMLAR ---
const ShowsCarousel = ({ page, setPage }) => {
  const [comments, setComments] = useState(() => {
    const saved = localStorage.getItem('cinema_comments_v1');
    return saved ? JSON.parse(saved) : [[], [], []];
  });
  const [inputVal, setInputVal] = useState('');

  const shows = [
    { t: 'Vikings', q: '"İktidar, yalnızca onu almak için eğilmeye hazır olanlara verilir." — Ragnar Lothbrok', s: 'Kattegat limanında kuzgunların uçuştuğu, Baltık rüzgarının estiği o efsanevi sabahtan bir kesit...', c: '#1f2e3d', b: '⚔️ Savaş & Liderlik' },
    { t: 'Frieren: Beyond Journey\'s End', q: '"İnsanların ömrü bizimki yanında bir göz açıp kapayıncaya kadar... Bu yüzden her an kıymetli." — Frieren', s: 'On yıllar süren serüvenin ardından eski dostun mezarı başında açan mavi çiçekler.', c: '#194a6e', b: '🪄 Huzur & Zaman' },
    { t: 'The Mentalist', q: '"Sıradan bir gözlemci her şeyi görür, ama hiçbir şey fark etmez. Çay alır mıydınız?" — Patrick Jane', s: 'CBI ofisindeki meşhur deri koltuk ve duvarda kanla çizilmiş Red John ikonu.', c: '#5e1818', b: '☕ Keskin Zekâ & Gizem' }
  ];
  const cur = shows[page];

  const handleAddComment = () => {
    if (!inputVal.trim()) return; const nextCom = [...comments];
    nextCom[page] = [...nextCom[page], { text: inputVal, date: new Date().toLocaleDateString('tr-TR') }];
    setComments(nextCom); localStorage.setItem('cinema_comments_v1', JSON.stringify(nextCom)); setInputVal('');
  };

  return (
    <div style={{ background: cur.c, padding: '15px', borderRadius: '12px', marginTop: '15px', color: '#fff', textAlign: 'left', border: '2px solid rgba(255,255,255,0.2)', transition: 'background 0.4s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontWeight: 'bold', color: '#ffcc00', fontSize: '1.1rem' }}>📺 {cur.t}</span>
        <span style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.4)', padding: '2px 8px', borderRadius: '10px' }}>{cur.b}</span>
      </div>
      <div style={{ fontStyle: 'italic', fontSize: '0.85rem', marginBottom: '8px', color: '#eee' }}>{cur.q}</div>
      <div style={{ fontSize: '0.8rem', color: '#bbb', lineHeight: '1.4', marginBottom: '12px' }}>🎞️ {cur.s}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
        <button onClick={() => setPage(p => p > 0 ? p - 1 : 2)} style={{ padding: '4px 10px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>⬅️ Önceki</button>
        <span style={{ fontSize: '0.8rem' }}>Yapım {page + 1} / 3</span>
        <button onClick={() => setPage(p => p < 2 ? p + 1 : 0)} style={{ padding: '4px 10px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sonraki ➡️</button>
      </div>
      <div style={{ fontSize: '0.75rem' }}>
        <div style={{ color: '#ffcc00', fontWeight: 'bold', marginBottom: '4px' }}>💬 İzleyici Yorumları ({comments[page].length})</div>
        <div style={{ maxHeight: '60px', overflowY: 'auto', marginBottom: '8px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '4px' }}>
          {comments[page].length === 0 ? <span style={{color:'#888'}}>İlk yorumu siz ekleyin.</span> : comments[page].map((c, i) => (
            <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '2px 0', color: '#ddd' }}><span style={{color:'#aaa', fontSize:'0.65rem'}}>({c.date}):</span> {c.text}</div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <input type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)} placeholder="Yorum bırakın..." className="comment-input" />
          <button onClick={handleAddComment} style={{ padding: '5px 10px', background: '#2ecc71', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Gönder</button>
        </div>
      </div>
    </div>
  );
};

// --- MİNİ OYUN 4 & 5: ÇİTTEN ATLAYAN KUZULAR + RÜYA MAKİNESİ ---
const SleepSimifiers = () => {
  const [sheepCount, setSheepCount] = useState(0);
  const [sheepArray, setSheepArray] = useState([]);
  const [activeDream, setActiveDream] = useState(null);

  const dreams = [
    { title: '🌌 Sonsuz MATLAB Matrisi', icon: '🔢', text: 'Kendini devasa bir yeşil ekranda sonsuz bir while döngüsünün içinde koşarken buluyorsun. Etrafında sayılar matris bükerek akıyor. Tam yorulup düşecekken gökyüzünden bir parantez } düşüyor ve seni özgürlüğe kavuşturuyor.' },
    { title: '🐉 Kampüste Ejderha ile Kahve', icon: '☕', text: 'Balıkesir kampüsünün ortasındasın. Karşında az önce zindanda kılıç çektiğin Kızıl Ejderha oturmuş, sana kantin pogaçası uzatıyor. "Savaşmak yorucu be dostum, gel bir ayran içelim" diyor.' },
    { title: '✨ Ateş Böceklerinin Senfonisi', icon: '🪄', text: 'Gece gökyüzündeki yıldızlar yavaşça yazdığın kod satırlarına dönüşüyor. Her bir yıldız kaydığında arkasında parıldayan bir return 0; bırakıyor. Bütün vize stresi siliniyor.' }
  ];

  const triggerSheep = () => {
    playAudio('step'); setSheepCount(s => s + 1);
    setSheepArray(p => [...p, Date.now()]);
    setTimeout(() => setSheepArray(p => p.slice(1)), 1000);
  };

  return (
    <div style={{marginTop:'15px'}}>
      <div className="rpg-box" style={{padding:'12px', textAlign:'center', marginBottom:'12px'}}>
        <span style={{color:'#87CEEB', fontWeight:'bold'}}>🐑 KUZU SAYMA SİMÜLATÖRÜ</span>
        <div style={{fontSize:'1.8rem', margin:'6px 0', color:'#f1c40f'}}>{sheepCount} Kuzu Sayıldı</div>
        
        <div style={{height:'70px', borderBottom:'4px solid #654321', display:'flex', justifyContent:'center', alignItems:'flex-end', overflow:'hidden', position: 'relative'}}>
          <div style={{ position: 'absolute', bottom: '-5px', fontSize: '2.5rem', zIndex: 2 }}>🚧</div>
          {sheepArray.map(id => <span key={id} className="sheep-animate" style={{ zIndex: 3 }}>🐑</span>)}
        </div>

        <button onClick={triggerSheep} className="rpg-btn" style={{marginTop:'10px', background:'#2980b9', width:'60%', padding:'10px'}}>Çitten Kuzu Atlat</button>
        {sheepCount >= 10 && <div style={{fontSize:'0.75rem', color:'#2ecc71', marginTop:'6px'}}>✨ Zihnin sakinleşti, uykuya hazırsın.</div>}
      </div>

      <div className="rpg-box" style={{padding:'12px', textAlign:'left'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <span style={{color:'#9b59b6', fontWeight:'bold'}}>💤 RÜYA MAKİNESİ</span>
          <button onClick={() => { playAudio('heal'); setActiveDream(dreams[Math.floor(Math.random()*dreams.length)]); }} className="rpg-btn" style={{background:'#8e44ad'}}>Rüya Başlat</button>
        </div>
        {activeDream && <div style={{marginTop:'10px', background:'#111', padding:'10px', borderRadius:'6px', borderLeft:'3px solid #9b59b6'}}><div style={{fontSize:'1.2rem', color:'#f1c40f'}}>{activeDream.icon} {activeDream.title}</div><p style={{fontSize:'0.8rem', color:'#ccc', margin:'6px 0 0', fontStyle:'italic'}}>"{activeDream.text}"</p></div>}
      </div>
    </div>
  );
};

// --- GÜNEŞ & AY SAATİ ---
const SmartClock = ({ timeString }) => {
  const [h, m] = timeString.split('-')[0].trim().split(':').map(Number);
  return (
    <div style={{ position: 'fixed', top: '20px', left: '20px', width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(255,255,255,0.85)', border: '4px solid #333', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
      <div style={{ position: 'absolute', width: '6px', height: '6px', background: '#333', borderRadius: '50%', zIndex: 10 }} />
      <div style={{ position: 'absolute', width: '4px', height: '20px', background: '#222', bottom: '50%', transformOrigin: 'bottom', transform: `rotate(${((h||0)%12)*30 + ((m||0)/2)}deg)`, transition: 'transform 1s cubic-bezier(0.4, 2.5, 0.3, 1)' }} />
      <div style={{ position: 'absolute', width: '2px', height: '28px', background: '#e74c3c', bottom: '50%', transformOrigin: 'bottom', transform: `rotate(${(m||0)*6}deg)`, transition: 'transform 0.8s cubic-bezier(0.4, 2.5, 0.3, 1)' }} />
    </div>
  );
};

const FadeInSection = ({ children }) => {
  const [vis, setVis] = useState(false); const ref = useRef();
  useEffect(() => { const obs = new IntersectionObserver(e => { if (e[0].isIntersecting) setVis(true); }); if (ref.current) obs.observe(ref.current); return () => obs.disconnect(); }, []);
  return <div ref={ref} style={{ opacity: vis?1:0, transform: vis?'translateY(0)':'translateY(80px)', transition: 'all 0.8s ease-out', width: '100%', display: 'flex', justifyContent: 'center' }}>{children}</div>;
};

// --- ANA UYGULAMA ---
const App = () => {
  const [scr, setScr] = useState(0);
  const [cinemaPage, setCinemaPage] = useState(0); 
  const [showWelcome, setShowWelcome] = useState(true);

  // Global Tepsi ve Bulaşık Durumu
  const [globalTray, setGlobalTray] = useState({ soup: null, salad: null, main: null, drink: null });
  const [isEaten, setIsEaten] = useState(false);
  const [washResetKey, setWashResetKey] = useState(0);

  // Yerel Dizi Fotoğrafları
  const cinemaCovers = [
    '/Vikings.jpg', 
    '/Frieren.jpg', 
    '/Mentalist.jpg'  
  ];

  useEffect(() => { const h = () => setScr((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100); window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, []);

  // Pürüzsüz Renk Geçişleri için Opacity Fonksiyonu
  const getOp = (zone) => {
    if (zone === 1) return scr < 30 ? 1 : Math.max(0, 1 - (scr - 30)/10);
    if (zone === 2) return scr >= 20 && scr < 60 ? (scr < 30 ? (scr - 20)/10 : 1) : scr >= 60 ? Math.max(0, 1 - (scr - 60)/10) : 0;
    if (zone === 3) return scr >= 50 && scr < 85 ? (scr < 60 ? (scr - 50)/10 : 1) : scr >= 85 ? Math.max(0, 1 - (scr - 85)/10) : 0;
    if (zone === 4) return scr >= 75 ? Math.min(1, (scr - 75)/10) : 0;
  };

  let act = Math.floor((scr / 100) * schedule.length); act = Math.max(0, Math.min(schedule.length - 1, act));

  return (
    <div style={{ minHeight: '550vh', fontFamily: 'sans-serif', position: 'relative', overflow: 'hidden' }}>
      <style>{cssStyles}</style>

      {/* SİNEMATİK PÜRÜZSÜZ ARKAPLAN KATMANLARI */}
      <div className="bg-layer" style={{ background: 'linear-gradient(to bottom, #FF9A8B, #FFC3A0)', opacity: getOp(1) }} />
      <div className="bg-layer" style={{ background: 'linear-gradient(to bottom, #87CEEB, #E0F6FF)', opacity: getOp(2) }} />
      <div className="bg-layer" style={{ background: 'linear-gradient(to bottom, #FF8C00, #4B0082)', opacity: getOp(3) }} />
      <div className="bg-layer" style={{ background: 'linear-gradient(to bottom, #191970, #000000)', opacity: getOp(4) }} />

      {/* GÖKYÜZÜ EFEKTLERİ (GÜNEŞ, BULUT, AY, YILDIZLAR) */}
      {scr < 30 && <div style={{ position: 'fixed', top: '15%', right: '15%', fontSize: '6rem', zIndex: -1, animation: 'pulse 4s infinite', filter: 'drop-shadow(0 0 30px #f1c40f)' }}>☀️</div>}
      {scr > 10 && scr < 65 && <div style={{ position: 'fixed', top: '25%', left: '-20%', fontSize: '5rem', zIndex: -1, animation: 'floatCloud 40s linear infinite', opacity: 0.7 }}>☁️</div>}
      {scr > 65 && (
        <>
          <div style={{ position: 'fixed', top: '15%', right: '10%', fontSize: '5rem', zIndex: -1, filter: 'drop-shadow(0 0 20px #f1c40f)', transition: 'opacity 2s', opacity: getOp(4) }}>🌙</div>
          <div style={{ position: 'fixed', bottom: '25%', left: '20%', fontSize: '1.5rem', animation: 'firefly 5s ease-in-out infinite', zIndex: -1 }}>✨</div>
          <div style={{ position: 'fixed', top: '35%', left: '75%', fontSize: '1rem', animation: 'firefly 7s ease-in-out infinite 1s', zIndex: -1 }}>⭐</div>
          <div style={{ position: 'fixed', top: '45%', left: '30%', fontSize: '1.2rem', animation: 'firefly 6s ease-in-out infinite 2s', zIndex: -1 }}>✨</div>
        </>
      )}

      {/* KARŞILAMA EKRANI */}
      {showWelcome && (
        <div className="welcome-overlay">
          <h1 style={{fontSize:'3.2rem', margin:'0 0 10px 0', color:'#2ecc71', textShadow:'0 0 20px rgba(46,204,113,0.5)'}}>BEDİRHAN PORSUK</h1>
          <h2 style={{fontWeight:'normal', color:'#ddd', textAlign:'center'}}>Gelişmiş Yaşam & Etkileşim Simülasyonu</h2>
          <p style={{color:'#aaa', marginBottom:'30px', textAlign:'center'}}>Balıkesir Üniversitesi - Bilgisayar Mühendisliği Dönem Projesi</p>
          <button onClick={() => setShowWelcome(false)} style={{padding:'14px 40px', fontSize:'1.3rem', fontWeight:'bold', cursor:'pointer', background:'#27ae60', color:'#fff', border:'2px solid #2ecc71', borderRadius:'8px', boxShadow:'0 0 15px #27ae60'}}>⚡ SİSTEMİ BAŞLAT</button>
        </div>
      )}

      {/* TERMINAL LOGLARI */}
      <div className="log-console">
        <div>➜ [SYS]: Vite v5.4 Active</div>
        <div>➜ [MEM]: Storage Mounted</div>
        <div>➜ [ENG]: Kitchen Engine OK</div>
        <div>➜ [RPG]: Dungeon Stage {Math.floor((scr/100)*15)+1}/15</div>
      </div>

      <div style={{ position: 'fixed', top: 0, left: 0, width: `${scr}%`, height: '6px', background: '#fff', zIndex: 100 }} />
      <SmartClock timeString={schedule[act].time} />

      <div style={{ paddingTop: '20vh', paddingBottom: '20vh', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '35vh', zIndex: 10, position: 'relative' }}>
        {schedule.map((item, index) => (
          <FadeInSection key={item.id}>
            <div style={{ display: 'flex', flexDirection: index % 2 === 0 ? 'row' : 'row-reverse', alignItems: 'center', gap: '40px', maxWidth: '950px', padding: '0 20px' }}>
              <div className="glass-card" style={{ padding: '30px', borderRadius: '20px', width: '460px', textAlign: 'center', color: '#111' }}>
                <div style={{ fontSize: '3.5rem' }}>{item.icon}</div><h2 style={{ fontSize: '2.2rem', margin: '5px 0' }}>{item.time}</h2><h3 style={{ margin: '0 0 10px 0' }}>{item.title}</h3>
                <p style={{ margin: '0 0 15px 0', lineHeight: '1.5', fontSize: '1rem' }}>{item.desc}</p>
                <div style={{ background: '#1db954', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', display: 'inline-block', fontSize: '0.9rem' }}>🎵 Spotify: {item.music}</div>
                
                {item.hasNumericNote && <NumericNote />}
                {item.hasKitchenGame && <KitchenGame globalTray={globalTray} setGlobalTray={setGlobalTray} setIsEaten={setIsEaten} setWashResetKey={setWashResetKey} />}
                {item.hasDinnerGame && <DinnerGame globalTray={globalTray} isEaten={isEaten} setIsEaten={setIsEaten} washResetKey={washResetKey} />}
                {item.hasMiniGame && <GameCenter />}
                {item.hasShowsCarousel && <ShowsCarousel page={cinemaPage} setPage={setCinemaPage} />}
                {item.hasSleepSection && <SleepSimifiers />}
              </div>
              
              {item.img && (
                <img 
                  src={item.hasShowsCarousel ? cinemaCovers[cinemaPage] : item.img} 
                  alt={item.title} 
                  className="glass-card" 
                  style={{ width: '300px', height: '300px', objectFit: 'cover', borderRadius: '20px', border: '3px solid rgba(255,255,255,0.4)', transition: 'all 0.5s ease' }} 
                />
              )}
            </div>
          </FadeInSection>
        ))}
      </div>
    </div>
  );
};

export default App; 