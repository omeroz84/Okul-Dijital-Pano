import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStoredData, updateAnnouncements, updateTeachers, updatePhotos, updateWeather, updateAiContent, updateDutyStudents, updateTheme, updateSchoolName } from '../services/storage';
import { AppData, Announcement, Teacher, SlidePhoto, Student, ThemeType } from '../types';
import { generateDailyContent, suggestAnnouncement } from '../services/geminiService';
import { Plus, Trash2, Save, Sparkles, LayoutDashboard, Monitor, Cloud, Users, Image as ImageIcon, Megaphone, GraduationCap, RefreshCw, Settings, Key, Eye, EyeOff, Palette, Building2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const TURKISH_CITIES = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
];

const DISTRICTS_BY_CITY: Record<string, string[]> = {
  "İstanbul": ["Adalar", "Arnavutköy", "Ataşehir", "Avcılar", "Bağcılar", "Bahçelievler", "Bakırköy", "Başakşehir", "Bayrampaşa", "Beşiktaş", "Beykoz", "Beylikdüzü", "Beyoğlu", "Büyükçekmece", "Çatalca", "Çekmeköy", "Esenler", "Esenyurt", "Eyüpsultan", "Fatih", "Gaziosmanpaşa", "Güngören", "Kadıköy", "Kağıthane", "Kartal", "Küçükçekmece", "Maltepe", "Pendik", "Sancaktepe", "Sarıyer", "Silivri", "Sultanbeyli", "Sultangazi", "Şile", "Şişli", "Tuzla", "Ümraniye", "Üsküdar", "Zeytinburnu"],
  "Ankara": ["Akyurt", "Altındağ", "Ayaş", "Bala", "Beypazarı", "Çamlıdere", "Çankaya", "Çubuk", "Elmadağ", "Etimesgut", "Evren", "Gölbaşı", "Güdül", "Haymana", "Kahramankazan", "Kalecik", "Keçiören", "Kızılcahamam", "Mamak", "Nallıhan", "Polatlı", "Pursaklar", "Sincan", "Şereflikoçhisar", "Yenimahalle"],
  "İzmir": ["Aliağa", "Balçova", "Bayındır", "Bayraklı", "Bergama", "Beydağ", "Bornova", "Buca", "Çeşme", "Çiğli", "Dikili", "Foça", "Gaziemir", "Güzelbahçe", "Karabağlar", "Karaburun", "Karşıyaka", "Kemalpaşa", "Kınık", "Kiraz", "Konak", "Menderes", "Menemen", "Narlıdere", "Ödemiş", "Seferihisar", "Selçuk", "Tire", "Torbalı", "Urla"],
  "Bursa": ["Büyükorhan", "Gemlik", "Gürsu", "Harmancık", "İnegöl", "İznik", "Karacabey", "Keles", "Kestel", "Mudanya", "Mustafakemalpaşa", "Nilüfer", "Orhaneli", "Orhangazi", "Osmangazi", "Yenişehir", "Yıldırım"],
  "Antalya": ["Akseki", "Aksu", "Alanya", "Demre", "Döşemealtı", "Elmalı", "Finike", "Gazipaşa", "Gündoğmuş", "İbradı", "Kaş", "Kemer", "Kepez", "Konyaaltı", "Korkuteli", "Kumluca", "Manavgat", "Muratpaşa", "Serik"],
  "Adana": ["Aladağ", "Ceyhan", "Çukurova", "Feke", "İmamoğlu", "Karaisalı", "Karataş", "Kozan", "Pozantı", "Saimbeyli", "Sarıçam", "Seyhan", "Tufanbeyli", "Yumurtalık", "Yüreğir"]
};

const THEMES: { id: ThemeType, name: string, color: string }[] = [
    { id: 'slate', name: 'Varsayılan (Gri)', color: 'bg-slate-900' },
    { id: 'blue', name: 'Okyanus', color: 'bg-blue-900' },
    { id: 'red', name: 'Okul Ruhu', color: 'bg-red-900' },
    { id: 'green', name: 'Doğa', color: 'bg-green-900' },
    { id: 'black', name: 'Gece Modu', color: 'bg-zinc-950' },
];

const AdminPanel: React.FC = () => {
  const [data, setData] = useState<AppData>(getStoredData());
  const [activeTab, setActiveTab] = useState<'announcements' | 'teachers' | 'students' | 'weather' | 'photos' | 'ai' | 'settings'>('announcements');
  
  // AI States
  const [aiTopic, setAiTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuccess, setAiSuccess] = useState(false);
  const [announceKeywords, setAnnounceKeywords] = useState('');
  const [announceGeneratingId, setAnnounceGeneratingId] = useState<string | null>(null);

  // Settings
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveKeyStatus, setSaveKeyStatus] = useState<'idle' | 'saved'>('idle');
  const [saveSchoolStatus, setSaveSchoolStatus] = useState<'idle' | 'saved'>('idle');
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>(data.theme || 'slate');
  const [schoolNameInput, setSchoolNameInput] = useState(data.schoolName);

  // Weather inputs
  const [cityInput, setCityInput] = useState(data.weather.city);
  const [districtInput, setDistrictInput] = useState(data.weather.district || '');
  const [tempInput, setTempInput] = useState(data.weather.temp);
  const [condInput, setCondInput] = useState(data.weather.condition);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [weatherSaveStatus, setWeatherSaveStatus] = useState<'idle' | 'saved'>('idle');

  useEffect(() => {
    const storedKey = localStorage.getItem('GEMINI_API_KEY');
    if (storedKey) setApiKey(storedKey);
  }, []);

  // Auto-clear status messages after 3 seconds
  useEffect(() => {
      if (aiSuccess) { const t = setTimeout(() => setAiSuccess(false), 3000); return () => clearTimeout(t); }
  }, [aiSuccess]);
  
  useEffect(() => { if (saveKeyStatus === 'saved') { const t = setTimeout(() => setSaveKeyStatus('idle'), 3000); return () => clearTimeout(t); } }, [saveKeyStatus]);
  useEffect(() => { if (saveSchoolStatus === 'saved') { const t = setTimeout(() => setSaveSchoolStatus('idle'), 3000); return () => clearTimeout(t); } }, [saveSchoolStatus]);
  useEffect(() => { if (weatherSaveStatus === 'saved') { const t = setTimeout(() => setWeatherSaveStatus('idle'), 3000); return () => clearTimeout(t); } }, [weatherSaveStatus]);


  const refreshData = () => {
    setData(getStoredData());
  };

  // --- ANNOUNCEMENTS ---
  const handleAddAnnouncement = () => {
    const newAnn: Announcement = {
      id: Date.now().toString(),
      title: 'Yeni Duyuru',
      content: 'Duyuru içeriğini düzenleyiniz.',
      priority: 'normal'
    };
    updateAnnouncements([...data.announcements, newAnn]);
    refreshData();
  };

  const handleRemoveAnnouncement = (id: string) => {
    updateAnnouncements(data.announcements.filter(a => a.id !== id));
    refreshData();
  };

  const handleUpdateAnnouncement = (id: string, field: keyof Announcement, value: string) => {
    const updated = data.announcements.map(a => a.id === id ? { ...a, [field]: value } : a);
    updateAnnouncements(updated);
    refreshData();
  };

  const handleGenerateAnnouncement = async (id: string) => {
      if(!announceKeywords) return;
      setAnnounceGeneratingId(id);
      const text = await suggestAnnouncement(announceKeywords);
      handleUpdateAnnouncement(id, 'content', text);
      setAnnounceGeneratingId(null);
      setAnnounceKeywords('');
  }

  // --- TEACHERS ---
  const handleAddTeacher = () => {
    const newT: Teacher = { id: Date.now().toString(), name: '', role: '' };
    updateTeachers([...data.teachers, newT]);
    refreshData();
  };
  
  const handleRemoveTeacher = (id: string) => {
    updateTeachers(data.teachers.filter(t => t.id !== id));
    refreshData();
  };

  const handleUpdateTeacher = (id: string, field: keyof Teacher, value: string) => {
    const updated = data.teachers.map(t => t.id === id ? { ...t, [field]: value } : t);
    updateTeachers(updated);
    refreshData();
  };

   // --- STUDENTS ---
   const handleAddStudent = () => {
    const newS: Student = { id: Date.now().toString(), name: '', class: '', role: '' };
    updateDutyStudents([...data.dutyStudents, newS]);
    refreshData();
  };
  
  const handleRemoveStudent = (id: string) => {
    updateDutyStudents(data.dutyStudents.filter(s => s.id !== id));
    refreshData();
  };

  const handleUpdateStudent = (id: string, field: keyof Student, value: string) => {
    const updated = data.dutyStudents.map(s => s.id === id ? { ...s, [field]: value } : s);
    updateDutyStudents(updated);
    refreshData();
  };

  // --- PHOTOS ---
  const handleAddPhoto = () => {
      const newP: SlidePhoto = { id: Date.now().toString(), url: `https://picsum.photos/1920/1080?random=${Date.now()}`, caption: '' };
      updatePhotos([...data.photos, newP]);
      refreshData();
  };

  const handleRemovePhoto = (id: string) => {
      updatePhotos(data.photos.filter(p => p.id !== id));
      refreshData();
  };

  const handleUpdatePhoto = (id: string, field: keyof SlidePhoto, value: string) => {
      const updated = data.photos.map(p => p.id === id ? { ...p, [field]: value } : p);
      updatePhotos(updated);
      refreshData();
  }

  // --- WEATHER ---
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCityInput(e.target.value);
    setDistrictInput(''); // Reset district when city changes
  };

  const fetchWeather = async () => {
    if (!cityInput) return;
    setIsWeatherLoading(true);
    try {
        // 1. Geocoding to get lat/long
        // Prioritize District in search query if it exists
        const searchQuery = districtInput ? `${districtInput}, ${cityInput}, Turkey` : `${cityInput}, Turkey`;
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=5&language=tr&format=json`);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            // Fallback to just city if district search fails
            if (districtInput) {
                const cityRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityInput)}&count=5&language=tr&format=json`);
                const cityData = await cityRes.json();
                if (!cityData.results) {
                     alert("Konum bulunamadı.");
                     setIsWeatherLoading(false);
                     return;
                }
                const location = cityData.results[0];
                await fetchWeatherForLocation(location);
            } else {
                alert("Konum bulunamadı. Lütfen il ismini kontrol edin.");
                setIsWeatherLoading(false);
            }
            return;
        }

        const location = geoData.results[0];
        await fetchWeatherForLocation(location);

    } catch (e) {
        console.error(e);
        alert("Hava durumu alınırken hata oluştu.");
        setIsWeatherLoading(false);
    }
  };

  const fetchWeatherForLocation = async (location: any) => {
        // 2. Get Weather
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true&timezone=auto`);
        const weatherData = await weatherRes.json();
        
        if (weatherData.current_weather) {
            const w = weatherData.current_weather;
            setTempInput(w.temperature);
            
            // Map WMO code to string
            const code = w.weathercode;
            let condition = "Açık";
            if (code > 0 && code <= 3) condition = "Bulutlu";
            if (code > 3 && code < 50) condition = "Sisli";
            if (code >= 50 && code < 70) condition = "Yağmurlu";
            if (code >= 70 && code < 80) condition = "Karlı";
            if (code >= 80) condition = "Sağanak Yağış";
            
            setCondInput(condition);
        }
        setIsWeatherLoading(false);
  }

  const handleSaveWeather = () => {
    updateWeather({ 
        city: cityInput, 
        district: districtInput,
        temp: Number(tempInput), 
        condition: condInput 
    });
    refreshData();
    setWeatherSaveStatus('saved');
  };

  // --- AI ---
  const handleGenerateAiContent = async () => {
    if (!aiTopic) return;
    
    setIsGenerating(true);
    setAiError(null);
    setAiSuccess(false);

    try {
        const content = await generateDailyContent(aiTopic);
        updateAiContent(content);
        refreshData();
        setAiSuccess(true);
        setAiTopic('');
    } catch (err: any) {
        setAiError(err.message || "Bilinmeyen bir hata oluştu.");
    } finally {
        setIsGenerating(false);
    }
  };

  // --- SETTINGS ---
  const handleSaveApiKey = () => {
    localStorage.setItem('GEMINI_API_KEY', apiKey.trim());
    setSaveKeyStatus('saved');
  };

  const handleThemeChange = (theme: ThemeType) => {
    setSelectedTheme(theme);
    updateTheme(theme);
  };

  const handleSaveSchoolName = () => {
    updateSchoolName(schoolNameInput);
    refreshData();
    setSaveSchoolStatus('saved');
  };

  const availableDistricts = DISTRICTS_BY_CITY[cityInput] || [];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-20 shrink-0">
        <div className="p-6 border-b border-slate-800">
            <h1 className="text-xl font-bold flex items-center gap-2">
                <LayoutDashboard className="text-blue-400" />
                Okul Pano
            </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
            <button onClick={() => setActiveTab('announcements')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'announcements' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
                <Megaphone size={20} /> Duyurular
            </button>
            <button onClick={() => setActiveTab('teachers')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'teachers' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
                <Users size={20} /> Nöbetçi Öğretmen
            </button>
            <button onClick={() => setActiveTab('students')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'students' ? 'bg-green-600 text-white' : 'hover:bg-slate-800 text-green-300'}`}>
                <GraduationCap size={20} /> Nöbetçi Öğrenci
            </button>
            <button onClick={() => setActiveTab('photos')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'photos' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
                <ImageIcon size={20} /> Fotoğraflar
            </button>
            <button onClick={() => setActiveTab('weather')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'weather' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
                <Cloud size={20} /> Hava Durumu
            </button>
            <button onClick={() => setActiveTab('ai')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'ai' ? 'bg-purple-600 text-white' : 'hover:bg-slate-800 text-purple-300'}`}>
                <Sparkles size={20} /> AI Asistanı
            </button>
            <div className="border-t border-slate-700 my-2 pt-2"></div>
            <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-slate-700 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
                <Settings size={20} /> Ayarlar
            </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
            <Link to="/" className="block w-full text-center bg-slate-800 hover:bg-slate-700 p-3 rounded-lg text-sm text-slate-300 transition-colors flex items-center justify-center gap-2">
                <Monitor size={16} /> Panoyu Görüntüle
            </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto h-screen">
        
        {/* Header */}
        <header className="mb-8 flex justify-between items-center border-b pb-4">
            <h2 className="text-3xl font-bold text-gray-800">
                {activeTab === 'announcements' && 'Duyuru Yönetimi'}
                {activeTab === 'teachers' && 'Nöbetçi Öğretmen Listesi'}
                {activeTab === 'students' && 'Nöbetçi Öğrenci Listesi'}
                {activeTab === 'photos' && 'Pano Görselleri'}
                {activeTab === 'weather' && 'Hava Durumu Ayarları'}
                {activeTab === 'ai' && 'Yapay Zeka İçerik Oluşturucu'}
                {activeTab === 'settings' && 'Sistem Ayarları'}
            </h2>
        </header>

        {/* ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
            <div className="space-y-6 max-w-4xl">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Yeni Duyuru Ekle</h3>
                    <button onClick={handleAddAnnouncement} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                        <Plus size={18} /> Ekle
                    </button>
                </div>
                <div className="space-y-4">
                    {data.announcements.map(ann => (
                        <div key={ann.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input 
                                    value={ann.title} 
                                    onChange={(e) => handleUpdateAnnouncement(ann.id, 'title', e.target.value)}
                                    className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-gray-800"
                                    placeholder="Başlık"
                                />
                                <select 
                                    value={ann.priority}
                                    onChange={(e) => handleUpdateAnnouncement(ann.id, 'priority', e.target.value)}
                                    className="border border-gray-300 rounded-lg p-2 outline-none text-gray-700"
                                >
                                    <option value="normal">Normal Önem</option>
                                    <option value="high">Yüksek Önem</option>
                                </select>
                            </div>
                            <textarea 
                                value={ann.content}
                                onChange={(e) => handleUpdateAnnouncement(ann.id, 'content', e.target.value)}
                                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none w-full h-24 resize-none text-gray-700"
                                placeholder="Duyuru metni..."
                            />
                             {/* AI Helper for Announcement */}
                            <div className="flex items-center gap-2 bg-purple-50 p-3 rounded-lg border border-purple-100">
                                <Sparkles size={16} className="text-purple-500" />
                                <input 
                                    type="text" 
                                    placeholder="AI ile yaz: örn. '29 ekim kutlaması'" 
                                    className="flex-1 bg-transparent border-b border-purple-200 focus:border-purple-500 outline-none text-sm px-2 py-1 text-purple-900 placeholder-purple-300"
                                    value={announceKeywords}
                                    onChange={(e) => setAnnounceKeywords(e.target.value)}
                                />
                                <button 
                                    onClick={() => handleGenerateAnnouncement(ann.id)}
                                    disabled={announceGeneratingId === ann.id}
                                    className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-md hover:bg-purple-700 disabled:opacity-70 flex items-center gap-1 min-w-[80px] justify-center transition-colors"
                                >
                                    {announceGeneratingId === ann.id ? <Loader2 size={12} className="animate-spin" /> : 'Oluştur'}
                                </button>
                            </div>

                            <div className="flex justify-end">
                                <button onClick={() => handleRemoveAnnouncement(ann.id)} className="text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors">
                                    <Trash2 size={18} /> Sil
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* TEACHERS */}
        {activeTab === 'teachers' && (
             <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <button onClick={handleAddTeacher} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                        <Plus size={18} /> Yeni Nöbetçi Ekle
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.teachers.map(t => (
                        <div key={t.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative group border-l-4 border-l-blue-500">
                            <button onClick={() => handleRemoveTeacher(t.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                                <Trash2 size={18} />
                            </button>
                            <div className="space-y-3 mt-2">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Öğretmen Adı</label>
                                    <input 
                                        value={t.name} 
                                        onChange={(e) => handleUpdateTeacher(t.id, 'name', e.target.value)}
                                        className="w-full border-b border-gray-300 focus:border-blue-500 outline-none py-1 font-medium text-gray-800"
                                        placeholder="Ad Soyad"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Nöbet Yeri</label>
                                    <input 
                                        value={t.role} 
                                        onChange={(e) => handleUpdateTeacher(t.id, 'role', e.target.value)}
                                        className="w-full border-b border-gray-300 focus:border-blue-500 outline-none py-1 text-gray-600"
                                        placeholder="Örn: Kat 1"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
        )}

        {/* STUDENTS */}
        {activeTab === 'students' && (
             <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <button onClick={handleAddStudent} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                        <Plus size={18} /> Yeni Nöbetçi Öğrenci Ekle
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.dutyStudents.map(s => (
                        <div key={s.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative group border-l-4 border-l-green-500">
                            <button onClick={() => handleRemoveStudent(s.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                                <Trash2 size={18} />
                            </button>
                            <div className="space-y-3 mt-2">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Öğrenci Adı</label>
                                    <input 
                                        value={s.name} 
                                        onChange={(e) => handleUpdateStudent(s.id, 'name', e.target.value)}
                                        className="w-full border-b border-gray-300 focus:border-green-500 outline-none py-1 font-medium text-gray-800"
                                        placeholder="Ad Soyad"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Sınıf</label>
                                        <input 
                                            value={s.class} 
                                            onChange={(e) => handleUpdateStudent(s.id, 'class', e.target.value)}
                                            className="w-full border-b border-gray-300 focus:border-green-500 outline-none py-1 text-gray-600"
                                            placeholder="Örn: 11-A"
                                        />
                                    </div>
                                    <div className="flex-[2]">
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Görev Yeri</label>
                                        <input 
                                            value={s.role} 
                                            onChange={(e) => handleUpdateStudent(s.id, 'role', e.target.value)}
                                            className="w-full border-b border-gray-300 focus:border-green-500 outline-none py-1 text-gray-600"
                                            placeholder="Örn: Danışma"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
        )}

        {/* PHOTOS */}
        {activeTab === 'photos' && (
             <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <button onClick={handleAddPhoto} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                        <Plus size={18} /> Yeni Fotoğraf Ekle
                    </button>
                </div>
                <div className="grid grid-cols-1 gap-6">
                    {data.photos.map(p => (
                        <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex gap-6 items-start">
                            <div className="w-48 h-32 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative border border-gray-300">
                                <img src={p.url} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Görsel URL</label>
                                    <input 
                                        value={p.url}
                                        onChange={(e) => handleUpdatePhoto(p.id, 'url', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm font-mono text-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Alt Başlık (İsteğe Bağlı)</label>
                                    <input 
                                        value={p.caption}
                                        onChange={(e) => handleUpdatePhoto(p.id, 'caption', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Örn: Okul Kermesi 2024"
                                    />
                                </div>
                            </div>
                            <button onClick={() => handleRemovePhoto(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg self-center transition-colors">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
             </div>
        )}

        {/* WEATHER */}
        {activeTab === 'weather' && (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6 border-b pb-4">
                        <Cloud size={48} className="text-blue-400" />
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Hava Durumu Konfigürasyonu</h3>
                            <p className="text-gray-500 text-sm">Konum seçerek sıcaklık verilerini otomatik güncelleyebilirsiniz.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">İl Seçimi</label>
                            <select 
                                value={cityInput}
                                onChange={handleCityChange}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-800" 
                            >
                                <option value="">Seçiniz...</option>
                                {TURKISH_CITIES.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">İlçe (İsteğe Bağlı)</label>
                            {availableDistricts.length > 0 ? (
                                <select
                                    value={districtInput}
                                    onChange={(e) => setDistrictInput(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-800"
                                >
                                    <option value="">Tümü (Merkez)</option>
                                    {availableDistricts.map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            ) : (
                                <input 
                                    value={districtInput}
                                    onChange={(e) => setDistrictInput(e.target.value)}
                                    placeholder="Merkez, Kadıköy..."
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800" 
                                />
                            )}
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center justify-between">
                        <span className="text-blue-800 text-sm">Konuma göre verileri internetten çek</span>
                        <button 
                            onClick={fetchWeather}
                            disabled={isWeatherLoading || !cityInput}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50 transition-colors"
                        >
                            {isWeatherLoading ? <RefreshCw className="animate-spin" size={16} /> : <Cloud size={16} />}
                            Verileri Getir
                        </button>
                    </div>

                    <div className="border-t pt-4 mt-4">
                         <h4 className="font-semibold mb-4 text-gray-600">Manuel Düzenleme</h4>
                         <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Sıcaklık (°C)</label>
                                <input 
                                    type="number"
                                    value={tempInput}
                                    onChange={(e) => setTempInput(Number(e.target.value))}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800" 
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Durum</label>
                                <select 
                                    value={condInput}
                                    onChange={(e) => setCondInput(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-800" 
                                >
                                    <option value="Güneşli">Güneşli</option>
                                    <option value="Açık">Açık</option>
                                    <option value="Parçalı Bulutlu">Parçalı Bulutlu</option>
                                    <option value="Çok Bulutlu">Çok Bulutlu</option>
                                    <option value="Bulutlu">Bulutlu</option>
                                    <option value="Yağmurlu">Yağmurlu</option>
                                    <option value="Karlı">Karlı</option>
                                    <option value="Rüzgarlı">Rüzgarlı</option>
                                    <option value="Sisli">Sisli</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleSaveWeather} 
                        className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg transition-all duration-300 ${weatherSaveStatus === 'saved' ? 'bg-green-600 text-white shadow-green-200' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'}`}
                    >
                        {weatherSaveStatus === 'saved' ? <CheckCircle size={20} /> : <Save size={20} />} 
                        {weatherSaveStatus === 'saved' ? 'Kaydedildi' : 'Ayarları Kaydet'}
                    </button>
                </div>
            </div>
        )}

        {/* AI */}
        {activeTab === 'ai' && (
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
                    <div className="flex items-start gap-4">
                        <Sparkles className="w-12 h-12 text-yellow-300 shrink-0" />
                        <div>
                            <h3 className="text-2xl font-bold mb-2">AI İçerik Asistanı</h3>
                            <p className="text-purple-100 mb-6">
                                Gemini AI kullanarak panoda gösterilecek "Günün Sözü", "İlginç Bilgi" veya motive edici kısa içerikler oluşturun.
                            </p>
                            
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Konu girin (örn: Bilim, Uzay, Atatürk, Matematik)" 
                                    className="flex-1 rounded-lg px-4 py-3 text-gray-900 outline-none focus:ring-4 ring-purple-400/50"
                                    value={aiTopic}
                                    onChange={(e) => setAiTopic(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleGenerateAiContent()}
                                />
                                <button 
                                    onClick={handleGenerateAiContent}
                                    disabled={isGenerating || !aiTopic}
                                    className="bg-white text-purple-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 min-w-[100px] justify-center"
                                >
                                    {isGenerating ? <Loader2 className="animate-spin" /> : 'Üret'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* AI Error Message */}
                {aiError && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3">
                         <AlertCircle className="text-red-500 shrink-0 mt-0.5" />
                         <div>
                             <h4 className="font-bold text-red-800">Hata Oluştu</h4>
                             <p className="text-red-700 text-sm">{aiError}</p>
                         </div>
                    </div>
                )}

                 {/* AI Success Message */}
                 {aiSuccess && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg flex items-center gap-3 animate-pulse">
                         <CheckCircle className="text-green-500 shrink-0" />
                         <p className="text-green-800 font-medium">İçerik başarıyla oluşturuldu ve panoya gönderildi!</p>
                    </div>
                )}

                {/* Current Content Preview */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h4 className="text-gray-500 font-semibold uppercase text-sm mb-4">Şu an Gösterilen İçerik</h4>
                    {data.aiContent ? (
                         <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                            <span className="inline-block px-2 py-1 bg-purple-200 text-purple-800 rounded text-xs font-bold mb-2 uppercase">
                                {data.aiContent.type}
                            </span>
                            <h5 className="font-bold text-gray-900 text-lg">{data.aiContent.title}</h5>
                            <p className="text-gray-700 mt-1">{data.aiContent.content}</p>
                         </div>
                    ) : (
                        <p className="text-gray-400 italic">Henüz içerik oluşturulmadı.</p>
                    )}
                </div>
            </div>
        )}

        {/* SETTINGS */}
        {activeTab === 'settings' && (
             <div className="max-w-2xl mx-auto space-y-8">

                 {/* General Settings */}
                 <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4 mb-6 border-b pb-4">
                        <Building2 size={32} className="text-blue-600" />
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Genel Ayarlar</h3>
                            <p className="text-gray-500 text-sm">Okul adı ve genel bilgiler.</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block font-medium text-gray-700 mb-2">Okul Adı (Panoda en üstte görünür)</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text"
                                    value={schoolNameInput}
                                    onChange={(e) => setSchoolNameInput(e.target.value)}
                                    className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                                    placeholder="Örn: ATATÜRK ANADOLU LİSESİ"
                                />
                                <button 
                                    onClick={handleSaveSchoolName}
                                    className={`px-6 rounded-lg font-semibold text-white transition-all duration-300 min-w-[100px] flex items-center justify-center ${saveSchoolStatus === 'saved' ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {saveSchoolStatus === 'saved' ? <CheckCircle size={20} /> : 'Kaydet'}
                                </button>
                            </div>
                        </div>
                    </div>
                 </div>
                 
                 {/* Theme Settings */}
                 <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4 mb-6 border-b pb-4">
                        <Palette size={32} className="text-indigo-600" />
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Tema Ayarları</h3>
                            <p className="text-gray-500 text-sm">Dijital panonun genel renk görünümünü seçin.</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {THEMES.map(theme => (
                            <button
                                key={theme.id}
                                onClick={() => handleThemeChange(theme.id)}
                                className={`relative group flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${selectedTheme === theme.id ? 'border-indigo-500 bg-indigo-50' : 'border-transparent hover:bg-gray-50'}`}
                            >
                                <div className={`w-16 h-16 rounded-full shadow-lg ${theme.color}`}></div>
                                <span className={`text-sm font-medium ${selectedTheme === theme.id ? 'text-indigo-700' : 'text-gray-600'}`}>
                                    {theme.name}
                                </span>
                                {selectedTheme === theme.id && (
                                    <div className="absolute top-2 right-2 w-3 h-3 bg-indigo-500 rounded-full"></div>
                                )}
                            </button>
                        ))}
                    </div>
                 </div>

                 {/* API Settings */}
                 <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-4 mb-6 border-b pb-4">
                        <Key size={32} className="text-yellow-600" />
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">API Ayarları</h3>
                            <p className="text-gray-500 text-sm">Google Gemini entegrasyonu.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block font-medium text-gray-700 mb-2 flex items-center gap-2">
                                Google Gemini API Anahtarı
                            </label>
                            <p className="text-sm text-gray-500 mb-3">
                                Yapay zeka özelliklerinin çalışması için geçerli bir anahtar gereklidir.
                            </p>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input 
                                        type={showApiKey ? "text" : "password"}
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-3 pr-10 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-gray-800"
                                        placeholder="AIzaSy..."
                                    />
                                    <button 
                                        onClick={() => setShowApiKey(!showApiKey)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    >
                                        {showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <button 
                                    onClick={handleSaveApiKey}
                                    className={`px-6 rounded-lg font-semibold text-white transition-all duration-300 min-w-[100px] flex items-center justify-center ${saveKeyStatus === 'saved' ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                     {saveKeyStatus === 'saved' ? <CheckCircle size={20} /> : 'Kaydet'}
                                </button>
                            </div>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800">
                            <strong>Bilgi:</strong> Eğer anahtar girmezseniz, sadece manuel veri girişi çalışır.
                        </div>
                    </div>
                 </div>
             </div>
        )}

      </div>
    </div>
  );
};

export default AdminPanel;