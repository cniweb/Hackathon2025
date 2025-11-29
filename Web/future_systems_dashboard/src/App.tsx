import React, { useState, useEffect, useRef } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
  BarChart, Bar, ComposedChart
} from 'recharts';
import { 
  Zap, Leaf, TrendingUp, AlertTriangle, Home, BarChart2, Award, Settings, 
  PlusCircle, Activity, ArrowUpRight, ArrowDownRight, CheckCircle, Database, Download, CloudRain, Cloud, Snowflake, Wind, Waves, Monitor, Calendar, Search,
  Trophy, Medal, Target, Users, CheckSquare, TreeDeciduous, Star, Lock, Sun, ExternalLink, RefreshCw, Clock, Globe, User, LogOut, X, BarChart3, CalendarDays,
  ArrowRightLeft, Layers, Factory, Brain, Car, Trees, Bell, AlertCircle, ChevronRight, MapPin, Warehouse, Cpu, HardDrive, ZoomIn, Mail, ToggleLeft, ToggleRight, Save
} from 'lucide-react';

// --- I18N TRANSLATIONS ---
const translations = {
  de: {
    nav: { dashboard: 'Dashboard', history: 'Historie', analytics: 'Analyse', compare: 'Vergleich', forecast: 'Prognose (ML)', gamification: 'Erfolge' },
    header: { title: 'Energy Monitoring Suite', live: 'Live Generatoren aktiv' },
    hierarchy: {
      location: 'Standort',
      hall: 'Produktionshalle',
      machine: 'Anlage (Maschine)',
      device: 'Gerät (Motor)',
      all: 'Alle'
    },
    cards: {
      consumption: 'Aktueller Verbrauch',
      machineState: 'Maschinen Status',
      gridQuality: 'Netzqualität (L1)',
      sub_live: 'Live Aggregation',
      sub_rms: 'rms_value_generator.py',
      sub_sinus: 'sinus_generator_3ph.py'
    },
    history: {
      title: 'Historische Daten (Axpo Open Data)',
      desc: 'Wähle einen Datensatz aus dem öffentlichen Axpo/CKW Repository.',
      source: 'Quelle:',
      load: 'Importieren',
      loading: 'Lade...',
      loaded: 'Geladen:',
      noData: 'Keine Daten geladen. Bitte wähle einen Zeitraum.',
      processing: 'Verarbeite CSV Stream...',
      viewDay: 'Tag (15m)',
      viewWeek: 'Woche (1h)',
      viewMonth: 'Monat (1d)'
    },
    analytics: {
      heatmapTitle: 'Lastprofil Heatmap (Wochentag vs. Stunde)',
      heatmapDesc: 'Identifizierung von ungewöhnlich hohem Verbrauch außerhalb der Kernarbeitszeiten.',
      peaksTitle: 'Top 5 Lastspitzen (Verbraucher)',
      peaksDesc: 'Geräte mit den höchsten Peaks in den letzten 30 Tagen. Klicke für Details.',
      costTitle: 'Kosten Prognose',
      costDesc: 'Erwartete Stromkosten für diesen Monat.',
      budget: 'Budget',
      current: 'Aktuell:',
      forecast: 'Prognose:',
      drilldownTitle: 'Details für',
      drilldownClose: 'Schließen'
    },
    compare: {
      title: 'Vergleichs-Center',
      subtitle: 'Vergleiche Datensätze basierend auf importierten CSV-Profilen.',
      modeLocations: 'Standorte',
      modeDevices: 'Geräte',
      modeTime: 'Zeiträume',
      legendA: 'Verwaltung',
      legendB: 'Produktion',
      legendC: 'Logistik',
      timeCurrent: 'Aktuell',
      timePrevious: 'Vormonat',
      devHVAC: 'Klima/Lüftung',
      devProd: 'Maschinen',
      devLight: 'Licht/IT'
    },
    forecast: {
      title: 'KI-Verbrauchsprognose',
      subtitle: 'Vorhersage des Energiebedarfs basierend auf historischen Mustern und Wetterdaten.',
      model: 'ML Modell:',
      train: 'Modell neu trainieren',
      training: 'Training läuft...',
      accuracy: 'Modellgenauigkeit (R²)',
      predicted: 'Prognose (24h)',
      confidence: 'Konfidenzintervall',
      algoRF: 'Random Forest Regressor',
      algoLSTM: 'LSTM Neural Network',
      algoProphet: 'Facebook Prophet'
    },
    gamification: {
      level: 'Level',
      xp: 'XP Fortschritt',
      nextLevel: 'bis zum nächsten Level',
      activeQuests: 'Aktive Quests',
      badges: 'Deine Abzeichen',
      leaderboard: 'Bestenliste (Woche)',
      finish: 'Abschließen',
      done: 'Erledigt',
      rank: 'Bereich',
      score: 'Score',
      footer: 'Top 3 erhalten am Monatsende einen Cafeteria-Gutschein!',
      co2Title: 'Deine Umwelt-Bilanz',
      co2Saved: 'CO₂ eingespart',
      impact: 'Das entspricht:',
      trees: 'Bäumen',
      car: 'km Autofahrt',
      goal: 'Monatsziel Reduktion',
      hello: 'Hallo Christian! Weiter so!'
    },
    profile: {
      title: 'Benutzerprofil',
      role: 'Facility Manager',
      language: 'Sprache / Language',
      email: 'E-Mail für Alarme',
      emailPlaceholder: 'name@firma.com',
      notifications: 'Alarmierung per E-Mail',
      save: 'Speichern',
      saved: 'Einstellungen gespeichert',
      logout: 'Abmelden'
    },
    notifications: {
      title: 'Benachrichtigungen',
      empty: 'Keine neuen Warnungen',
      clear: 'Alle löschen',
      alertCritical: 'Kritischer Alarm',
      alertWarning: 'Warnung',
      newAlert: 'Neue Anomalie erkannt!',
      demoAlert1: 'Spannungsabfall L2',
      demoAlert2: 'Überlast in Halle 4',
      demoAlert3: 'Blindstrom kompensieren'
    }
  },
  en: {
    nav: { dashboard: 'Dashboard', history: 'History', analytics: 'Analytics', compare: 'Compare', forecast: 'Forecast (ML)', gamification: 'Achievements' },
    header: { title: 'Energy Monitoring Suite', live: 'Live Generators active' },
    hierarchy: {
      location: 'Location',
      hall: 'Production Hall',
      machine: 'Machine',
      device: 'Device (Motor)',
      all: 'All'
    },
    cards: {
      consumption: 'Current Consumption',
      machineState: 'Machine Status',
      gridQuality: 'Grid Quality (L1)',
      sub_live: 'Live Aggregation',
      sub_rms: 'rms_value_generator.py',
      sub_sinus: 'sinus_generator_3ph.py'
    },
    history: {
      title: 'Historical Data (Axpo Open Data)',
      desc: 'Select a dataset from the public Axpo/CKW repository.',
      source: 'Source:',
      load: 'Import',
      loading: 'Loading...',
      loaded: 'Loaded:',
      noData: 'No data loaded. Please select a time range.',
      processing: 'Processing CSV stream...',
      viewDay: 'Day (15m)',
      viewWeek: 'Week (1h)',
      viewMonth: 'Month (1d)'
    },
    analytics: {
      heatmapTitle: 'Load Profile Heatmap (Weekday vs. Hour)',
      heatmapDesc: 'Identification of unusually high consumption outside core working hours.',
      peaksTitle: 'Top 5 Peak Consumers',
      peaksDesc: 'Devices with the highest peaks in the last 30 days. Click for details.',
      costTitle: 'Cost Forecast',
      costDesc: 'Expected electricity costs for this month.',
      budget: 'Budget',
      current: 'Current:',
      forecast: 'Forecast:',
      drilldownTitle: 'Details for',
      drilldownClose: 'Close'
    },
    compare: {
      title: 'Comparison Center',
      subtitle: 'Compare datasets based on imported CSV profiles.',
      modeLocations: 'Locations',
      modeDevices: 'Devices',
      modeTime: 'Time Periods',
      legendA: 'Admin Building',
      legendB: 'Production',
      legendC: 'Logistics',
      timeCurrent: 'Current',
      timePrevious: 'Last Month',
      devHVAC: 'HVAC',
      devProd: 'Machinery',
      devLight: 'Light/IT'
    },
    forecast: {
      title: 'AI Energy Forecast',
      subtitle: 'Predicting energy demand based on historical patterns and weather data.',
      model: 'ML Model:',
      train: 'Retrain Model',
      training: 'Training in progress...',
      accuracy: 'Model Accuracy (R²)',
      predicted: 'Forecast (24h)',
      confidence: 'Confidence Interval',
      algoRF: 'Random Forest Regressor',
      algoLSTM: 'LSTM Neural Network',
      algoProphet: 'Facebook Prophet'
    },
    gamification: {
      level: 'Level',
      xp: 'XP Progress',
      nextLevel: 'to next level',
      activeQuests: 'Active Quests',
      badges: 'Your Badges',
      leaderboard: 'Leaderboard (Week)',
      finish: 'Complete',
      done: 'Done',
      rank: 'Area',
      score: 'Score',
      footer: 'Top 3 receive a cafeteria voucher at the end of the month!',
      co2Title: 'Your Environmental Impact',
      co2Saved: 'CO₂ Saved',
      impact: 'Equivalent to:',
      trees: 'Trees',
      car: 'km by car',
      goal: 'Monthly Reduction Goal',
      hello: 'Hello Christian! Keep it up!'
    },
    profile: {
      title: 'User Profile',
      role: 'Facility Manager',
      language: 'Language / Sprache',
      email: 'Alert Email Address',
      emailPlaceholder: 'name@company.com',
      notifications: 'Email Alerts',
      save: 'Save',
      saved: 'Settings saved',
      logout: 'Logout'
    },
    notifications: {
      title: 'Notifications',
      empty: 'No new alerts',
      clear: 'Clear all',
      alertCritical: 'Critical Alert',
      alertWarning: 'Warning',
      newAlert: 'New Anomaly Detected!',
      demoAlert1: 'Voltage Dip L2',
      demoAlert2: 'Overload in Hall 4',
      demoAlert3: 'Check Reactive Power'
    }
  },
  hi: {
    nav: { dashboard: 'डैशबोर्ड', history: 'इतिहास', analytics: 'विश्लेषण', compare: 'तुलना', forecast: 'पूर्वानुमान (ML)', gamification: 'उपलब्धियां' },
    header: { title: 'ऊर्जा निगरानी सुइट', live: 'लाइव जनरेटर सक्रिय' },
    hierarchy: {
      location: 'स्थान',
      hall: 'उत्पादन हॉल',
      machine: 'मशीन',
      device: 'उपकरण (मोटर)',
      all: 'सभी'
    },
    cards: {
      consumption: 'वर्तमान खपत',
      machineState: 'मशीन की स्थिति',
      gridQuality: 'ग्रिड गुणवत्ता (L1)',
      sub_live: 'लाइव एकत्रीकरण',
      sub_rms: 'rms_value_generator.py',
      sub_sinus: 'sinus_generator_3ph.py'
    },
    history: {
      title: 'ऐतिहासिक डेटा (Axpo Open Data)',
      desc: 'सार्वजनिक Axpo/CKW रिपॉजिटरी से डेटासेट चुनें।',
      source: 'स्रोत:',
      load: 'आयात करें',
      loading: 'लोड हो रहा है...',
      loaded: 'लोड किया गया:',
      noData: 'कोई डेटा लोड नहीं है। कृपया समय सीमा चुनें।',
      processing: 'CSV स्ट्रीम संसाधित हो रही है...',
      viewDay: 'दिन (15m)',
      viewWeek: 'सप्ताह (1h)',
      viewMonth: 'माह (1d)'
    },
    analytics: {
      heatmapTitle: 'लोड प्रोफ़ाइल हीटमैप (सप्ताह का दिन बनाम घंटा)',
      heatmapDesc: 'मुख्य कामकाजी घंटों के बाहर असामान्य रूप से उच्च खपत की पहचान।',
      peaksTitle: 'शीर्ष 5 पीक उपभोक्ता',
      peaksDesc: 'पिछले 30 दिनों में उच्चतम पीक वाले उपकरण।',
      costTitle: 'लागत पूर्वानुमान',
      costDesc: 'इस महीने के लिए अनुमानित बिजली लागत।',
      budget: 'बजट',
      current: 'वर्तमान:',
      forecast: 'पूर्वानुमान:'
    },
    compare: {
      title: 'तुलना केंद्र',
      subtitle: 'आयातित CSV प्रोफाइल के आधार पर डेटासेट की तुलना करें।',
      modeLocations: 'स्थान',
      modeDevices: 'उपकरण',
      modeTime: 'समय अवधि',
      legendA: 'प्रशासन भवन',
      legendB: 'उत्पादन',
      legendC: 'लॉजिस्टिक्स',
      timeCurrent: 'वर्तमान',
      timePrevious: 'पिछला महीना',
      devHVAC: 'HVAC',
      devProd: 'मशीनरी',
      devLight: 'लाइट/IT'
    },
    forecast: {
      title: 'AI ऊर्जा पूर्वानुमान',
      subtitle: 'ऐतिहासिक पैटर्न और मौसम डेटा के आधार पर ऊर्जा मांग की भविष्यवाणी।',
      model: 'ML मॉडल:',
      train: 'मॉडल को फिर से प्रशिक्षित करें',
      training: 'प्रशिक्षण जारी है...',
      accuracy: 'मॉडल सटीकता (R²)',
      predicted: 'पूर्वानुमान (24h)',
      confidence: 'विश्वास अंतराल',
      algoRF: 'रैंडम फॉरेस्ट रिग्रेसर',
      algoLSTM: 'LSTM न्यूरल नेटवर्क',
      algoProphet: 'फेसबुक प्रोफेट'
    },
    gamification: {
      level: 'स्तर',
      xp: 'XP प्रगति',
      nextLevel: 'अगले स्तर तक',
      activeQuests: 'सक्रिय खोज',
      badges: 'आपके बैज',
      leaderboard: 'लीडरबोर्ड (सप्ताह)',
      finish: 'पूरा करें',
      done: 'हो गया',
      rank: 'क्षेत्र',
      score: 'स्कोर',
      footer: 'शीर्ष 3 को महीने के अंत में कैफेटेरिया वाउचर मिलता है!',
      co2Title: 'आपका पर्यावरणीय प्रभाव',
      co2Saved: 'CO₂ की बचत',
      impact: 'के बराबर:',
      trees: 'पेड़',
      car: 'किमी कार से',
      goal: 'मासिक कमी लक्ष्य',
      hello: 'नमस्ते क्रिश्चियन! लगे रहो!'
    },
    profile: {
      title: 'उपयोगकर्ता प्रोफ़ाइल',
      role: 'सुविधा प्रबंधक',
      language: 'भाषा / Language',
      email: 'ईमेल अलर्ट पता',
      emailPlaceholder: 'name@company.com',
      notifications: 'ईमेल अलर्ट',
      save: 'सहेजें',
      saved: 'सेटिंग्स सहेजी गईं',
      logout: 'लॉग आउट'
    },
    notifications: {
      title: 'सूचनाएं',
      empty: 'कोई नई चेतावनी नहीं',
      clear: 'सभी साफ़ करें',
      alertCritical: 'गंभीर चेतावनी',
      alertWarning: 'चेतावनी',
      newAlert: 'नई विसंगति पाई गई!',
      demoAlert1: 'वोल्टेज गिरावट L2',
      demoAlert2: 'हॉल 4 में ओवरलोड',
      demoAlert3: 'प्रतिक्रियाशील शक्ति की जांच करें'
    }
  }
};

// --- MOCK HIERARCHY DATA ---
const HIERARCHY_DATA = [
  {
    id: 'coburg', name: 'Werk Coburg', halls: [
      { id: 'h1', name: 'Halle 1 (Montage)', machines: [
        { id: 'm1', name: 'Montagelinie A', devices: [
          { id: 'd1', name: 'Motor M1 (Förderband)' },
          { id: 'd2', name: 'Roboterarm R1' }
        ]},
        { id: 'm2', name: 'Lackieranlage', devices: [
          { id: 'd3', name: 'Pumpe P1' },
          { id: 'd4', name: 'Lüftung V1' }
        ]}
      ]},
      { id: 'h2', name: 'Halle 2 (Logistik)', machines: [
        { id: 'm3', name: 'Hochregallager', devices: [
           { id: 'd5', name: 'Liftmotor L1' }
        ]}
      ]}
    ]
  },
  {
    id: 'berlin', name: 'Werk Berlin', halls: [
      { id: 'h3', name: 'Halle B1', machines: [] }
    ]
  }
];


// --- KONFIGURATION ---
const AXPO_BASE_URL = "https://open.data.axpo.com/$web/";
const AVAILABLE_MONTHS = [
  { id: '202510', label: 'Oct 2025' },
  { id: '202509', label: 'Sep 2025' },
  { id: '202508', label: 'Aug 2025' },
];

// --- GENERATORS (PORTED PYTHON LOGIC) ---

const generateThreePhasePoint = (tick) => {
  const amplitude = 230; 
  const noise = 0.02; 
  const freq = 0.1; 
  const phaseShiftL2 = (120 / 360) * 2 * Math.PI;
  const phaseShiftL3 = (240 / 360) * 2 * Math.PI;
  const angle = tick * freq;
  const addNoise = (val) => val + (Math.random() * amplitude * noise - (amplitude * noise / 2));

  return {
    time: tick,
    L1: addNoise(amplitude * Math.sin(angle)),
    L2: addNoise(amplitude * Math.sin(angle + phaseShiftL2)),
    L3: addNoise(amplitude * Math.sin(angle + phaseShiftL3)),
  };
};

const RMS_CYCLE = [
  { val: 5.0, duration: 30 },   
  { val: 1.0, duration: 150 },  
  { val: 0.0, duration: 60 }    
];

const generateRMSPoint = (tick) => {
  const totalDuration = RMS_CYCLE.reduce((acc, seg) => acc + seg.duration, 0);
  const cycleTime = tick % totalDuration;
  let currentVal = 0;
  let accumulatedTime = 0;

  for (const seg of RMS_CYCLE) {
    if (cycleTime < accumulatedTime + seg.duration) {
      currentVal = seg.val;
      break;
    }
    accumulatedTime += seg.duration;
  }

  const noise = 0.1; 
  const valWithNoise = currentVal + (Math.random() * currentVal * noise);

  return {
    time: tick,
    value: parseFloat(valWithNoise.toFixed(2)),
    state: currentVal > 4 ? 'Produktion' : (currentVal > 0.5 ? 'Standby' : 'Aus')
  };
};

const generateSimulatedData = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    const baseLoad = 150 + Math.random() * 50;
    const peak = (i > 8 && i < 18) ? 300 : 0; 
    const anomaly = (i === 14) ? 400 : 0; 
    data.push({
      time: `${i}:00`,
      kwh: Math.round(baseLoad + peak + anomaly),
      co2: Math.round((baseLoad + peak + anomaly) * 0.4), 
      solar: i > 6 && i < 20 ? Math.round(Math.random() * 200) : 0,
      source: 'simulated'
    });
  }
  return data;
};

// Advanced History Generator for Day, Week, Month
const generateAdvancedHistoryData = (monthId, viewType) => {
  const data = [];
  const year = parseInt(monthId.substring(0, 4));
  const month = parseInt(monthId.substring(4, 6)) - 1; 
  
  if (viewType === 'day') {
    const date = new Date(year, month, 15);
    const dateStr = date.toLocaleDateString('de-CH');
    const isSummer = month >= 4 && month <= 8;
    const baseConsumption = isSummer ? 120 : 180; 

    for (let i = 0; i < 24; i++) {
      for (let min of [0, 15, 30, 45]) {
        const timeString = `${i.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        let val = baseConsumption + Math.random() * 80;
        if (i >= 6 && i <= 9) val += 250 + Math.random() * 80;
        if (i >= 17 && i <= 21) val += 350 + Math.random() * 120;
        if (i >= 23 || i <= 5) val = 60 + Math.random() * 30;

        let solar = 0;
        if (i > 6 && i < 19) {
          const peakHour = 13;
          const dist = Math.abs(i - peakHour);
          solar = Math.max(0, 300 - (dist * (300/6)) + (Math.random()*50));
        }

        data.push({
          time: timeString,
          fullDate: `${dateStr} ${timeString}`,
          kwh: Math.round(val),
          co2: Math.round(val * 0.35),
          solar: Math.round(solar),
        });
      }
    }
  } else if (viewType === 'week') {
    const startDay = 10;
    const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    for (let d = 0; d < 7; d++) {
      const currentDay = startDay + d;
      const isWeekend = d >= 5;
      for (let h = 0; h < 24; h++) {
        let val = 150 + Math.random() * 50; 
        if (!isWeekend && h > 7 && h < 18) val += 400; 
        if (isWeekend && h > 9 && h < 20) val += 100; 
        let solar = 0;
        if (h > 6 && h < 19) solar = Math.max(0, 250 - Math.abs(13 - h) * 40 + Math.random() * 50);
        data.push({
          time: `${weekDays[d]} ${h}:00`,
          fullDate: `${currentDay}.${month+1}. ${h}:00`,
          kwh: Math.round(val),
          solar: Math.round(solar),
        });
      }
    }
  } else if (viewType === 'month') {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      let dailySum = isWeekend ? 2500 : 6500; 
      dailySum += Math.random() * 1000 - 500;
      let dailySolar = 1500 + Math.random() * 1000;
      data.push({
        time: `${d}.`,
        fullDate: date.toLocaleDateString('de-CH'),
        kwh: Math.round(dailySum),
        solar: Math.round(dailySolar),
      });
    }
  }
  return data;
};

// --- NEW HELPERS FOR COMPARISON CHART ---
const generateSinusProfile = (points, phaseOffset = 0) => {
  const data = [];
  const amplitude = 230;
  const noise = 0.05;
  const freq = 0.2; 
  for(let i=0; i<points; i++) {
    const angle = i * freq + phaseOffset;
    const val = amplitude * Math.sin(angle) + (Math.random() * amplitude * noise);
    data.push(val);
  }
  return data;
};

const generateRMSProfile = (points, timeShift = 0) => {
  const data = [];
  const cycleLength = 100;
  for(let i=0; i<points; i++) {
    const tick = (i + timeShift) % cycleLength;
    let val = 0;
    if (tick < 15) val = 5.0; 
    else if (tick < 70) val = 1.0; 
    else val = 0.0; 
    val += Math.random() * val * 0.1;
    data.push(val);
  }
  return data;
};

// --- ML FORECAST GENERATOR ---
const generateMLForecastData = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    const base = 200 + 100 * Math.sin((i / 24) * 2 * Math.PI - Math.PI / 2);
    const val = base + Math.random() * 30;
    data.push({
      time: `${i}:00`,
      actual: Math.round(val),
      predicted: null,
      range: null,
      upper: null,
      lower: null
    });
  }
  for (let i = 0; i < 24; i++) {
    const base = 200 + 100 * Math.sin((i / 24) * 2 * Math.PI - Math.PI / 2);
    const trend = base * 1.05; 
    const upper = Math.round(trend + 20 + i * 2);
    const lower = Math.round(trend - 20 - i * 2);
    data.push({
      time: `+${i}h`,
      actual: null,
      predicted: Math.round(trend),
      range: [lower, upper], 
      upper: upper,
      lower: lower,
    });
  }
  return data;
};

const generateHeatmapData = () => {
  const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  const heatmap = [];
  days.forEach(day => {
    const hours = [];
    for(let h=0; h<24; h++) {
      let intensity = Math.random() * 100;
      if (h > 6 && h < 18) intensity += 50;
      if (day === 'Sa' || day === 'So') intensity *= 0.4;
      hours.push(Math.min(100, Math.round(intensity)));
    }
    heatmap.push({ day, hours });
  });
  return heatmap;
};

const peakConsumers = [
  { name: 'Klima (Haupt)', value: 1250, time: '14:00' },
  { name: 'Produktion A', value: 980, time: '10:15' },
  { name: 'Laden (EV)', value: 850, time: '08:30' },
  { name: 'Küche', value: 620, time: '12:00' },
  { name: 'Serverraum', value: 550, time: '24/7' },
];

const QUESTS = [
  { id: 1, title: 'Wochenend-Sparer', desc: 'Reduziere den Verbrauch am Sonntag um 10%', xp: 150, completed: false, type: 'weekly' },
  { id: 2, title: 'Daten-Detektiv', desc: 'Verbinde eine neue Datenquelle (z.B. CSV)', xp: 200, completed: false, type: 'one-time' },
  { id: 3, title: 'Nachtwächter', desc: 'Prüfe den Standby-Verbrauch um 23:00 Uhr', xp: 50, completed: true, type: 'daily' },
];

const LEADERBOARD = [
  { rank: 1, name: 'Produktion Halle 3', score: 12400, trend: 'up' },
  { rank: 2, name: 'Logistikzentrum', score: 11850, trend: 'down' },
  { rank: 3, name: 'Verwaltung (Du)', score: 9800, trend: 'up' }, 
  { rank: 4, name: 'Kantine', score: 8500, trend: 'stable' },
];

const BADGES = [
  { id: 1, name: 'Datensammler', icon: Database, color: 'text-blue-500', unlocked: true },
  { id: 2, name: 'Energiesparfuchs', icon: Leaf, color: 'text-emerald-500', unlocked: true },
  { id: 3, name: 'Anomalie-Jäger', icon: Search, color: 'text-purple-500', unlocked: false },
  { id: 4, name: 'Solar-Pionier', icon: Sun, color: 'text-amber-500', unlocked: false },
];

// --- COMPONENTS ---

const NotificationToast = ({ alert, onClose, t }) => {
  if (!alert) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className={`bg-white rounded-lg shadow-xl border-l-4 p-4 flex items-start max-w-sm ${alert.type === 'critical' ? 'border-red-500' : 'border-amber-500'}`}>
        <div className={`p-2 rounded-full mr-3 ${alert.type === 'critical' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="flex-1 mr-2">
          <h4 className="font-bold text-slate-800 text-sm">{t.notifications.newAlert}</h4>
          <p className="text-xs font-medium text-slate-900 mt-1">{alert.title}</p>
          <p className="text-xs text-slate-500">{alert.message}</p>
          <span className="text-[10px] text-slate-400 mt-2 block">{alert.time}</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// --- NEW DRILLDOWN MODAL ---
const DrilldownModal = ({ consumer, onClose, t }) => {
  if (!consumer) return null;
  
  // Simulate detailed 24h data for the selected consumer
  const detailData = [];
  for(let i=0; i<24; i++) {
     // Generate a curve that peaks around the consumer's peak time if possible
     let val = Math.random() * 50 + 10;
     // Extract hour from time string "14:00" -> 14
     const peakHour = parseInt(consumer.time.split(':')[0]);
     const dist = Math.abs(i - peakHour);
     
     // Add a gaussian-like peak
     if(dist < 5) {
       val += (consumer.value / 2) * Math.exp(-(dist*dist)/4); 
     }
     detailData.push({ time: `${i}:00`, value: Math.round(val) });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
         <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-slate-800">{t.analytics.drilldownTitle} {consumer.name}</h3>
              <p className="text-sm text-slate-500">24h Detail-Analyse • Peak um {consumer.time} Uhr</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400"/></button>
         </div>
         
         <div className="p-6 bg-slate-50">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={detailData}>
                    <defs>
                      <linearGradient id="colorDetail" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} unit=" W" />
                    <RechartsTooltip />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDetail)" />
                 </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
               <div className="bg-white p-3 rounded border border-slate-200 text-center">
                 <span className="text-xs text-slate-400 block uppercase font-bold">Max. Last</span>
                 <span className="text-lg font-bold text-slate-800">{consumer.value} W</span>
               </div>
               <div className="bg-white p-3 rounded border border-slate-200 text-center">
                 <span className="text-xs text-slate-400 block uppercase font-bold">Ø Verbrauch</span>
                 <span className="text-lg font-bold text-slate-800">{Math.round(consumer.value * 0.4)} W</span>
               </div>
               <div className="bg-white p-3 rounded border border-slate-200 text-center">
                 <span className="text-xs text-slate-400 block uppercase font-bold">Effizienz</span>
                 <span className="text-lg font-bold text-emerald-500">92%</span>
               </div>
            </div>
         </div>
         
         <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
               {t.analytics.drilldownClose}
            </button>
         </div>
      </div>
    </div>
  );
};

const Card = ({ title, value, unit, trend, icon: Icon, colorClass, subtext }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 mt-1">
          {value} <span className="text-lg text-slate-400 font-normal">{unit}</span>
        </h3>
      </div>
      <div className={`p-3 rounded-full ${colorClass} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
    </div>
    <div className="flex items-center justify-between">
      <div className={`flex items-center text-sm font-medium ${trend > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
        {trend > 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
        {Math.abs(trend)}% vs. Vortag
      </div>
      {subtext && <span className="text-xs text-slate-400">{subtext}</span>}
    </div>
  </div>
);

const WeatherCard = ({ weather }) => {
  const getWmoIcon = (code) => {
    if (code <= 1) return Sun;
    if (code <= 3) return Cloud;
    if (code <= 67) return CloudRain;
    if (code <= 77) return Snowflake;
    return Cloud;
  };

  const WeatherIcon = weather ? getWmoIcon(weather.weathercode) : Cloud;
  const temp = weather ? weather.temperature : '--';
  const wind = weather ? weather.windspeed : '--';

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-sm text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-blue-100 text-sm font-medium uppercase tracking-wide mb-1">Standort & Wetter</p>
          <div className="flex items-end">
            <h3 className="text-4xl font-bold">{temp}°C</h3>
            <span className="mb-1 ml-2 text-blue-100 text-sm">Coburg, DE</span>
          </div>
          <div className="mt-4 flex space-x-4 text-sm text-blue-50">
             <div className="flex items-center">
                <Wind className="w-4 h-4 mr-1 opacity-70" />
                {wind} km/h
             </div>
             <div className="flex items-center">
                <Cloud className="w-4 h-4 mr-1 opacity-70" />
                Live API
             </div>
          </div>
        </div>
        <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
          <WeatherIcon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
};

const HeatmapCell = ({ value }) => {
  let bg = 'bg-emerald-50';
  let opacity = 0.2;
  
  if (value > 20) { bg = 'bg-emerald-300'; opacity = 0.4; }
  if (value > 40) { bg = 'bg-yellow-300'; opacity = 0.6; }
  if (value > 60) { bg = 'bg-orange-400'; opacity = 0.8; }
  if (value > 80) { bg = 'bg-red-500'; opacity = 1.0; }
  
  return (
    <div 
      className={`h-8 w-full min-w-[20px] rounded-sm ${bg} border border-white/50 transition-all hover:scale-110 hover:z-10 cursor-pointer`} 
      style={{ opacity }}
      title={`Auslastung: ${value}%`}
    ></div>
  );
};

const ProfileModal = ({ isOpen, onClose, lang, setLang, t }) => {
  const [email, setEmail] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert(t.profile.saved);
      onClose();
    }, 800);
  };

  if (!isOpen) return null;
  return (
    <div className="absolute bottom-16 left-4 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-5 z-50 animate-in slide-in-from-bottom-5">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
        <h3 className="font-bold text-slate-800">{t.profile.title}</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4"/></button>
      </div>
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg mr-4">CZ</div>
        <div>
          <p className="font-bold text-slate-800">Christian Zimmermann</p>
          <p className="text-xs text-slate-500">{t.profile.role}</p>
        </div>
      </div>
      
      <div className="space-y-5">
        {/* Email Field */}
        <div>
           <label className="text-xs text-slate-500 font-bold uppercase mb-1.5 block">{t.profile.email}</label>
           <div className="relative">
             <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
             <input 
               type="email" 
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               placeholder={t.profile.emailPlaceholder}
               className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
             />
           </div>
        </div>

        {/* Notification Toggle */}
        <div className="flex items-center justify-between">
           <span className="text-sm font-medium text-slate-700">{t.profile.notifications}</span>
           <button 
             onClick={() => setNotificationsEnabled(!notificationsEnabled)}
             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationsEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
           >
             <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
           </button>
        </div>

        {/* Language Selection */}
        <div>
          <label className="text-xs text-slate-500 font-bold uppercase mb-1.5 block">{t.profile.language}</label>
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => setLang('de')} 
              className={`flex-1 py-1.5 text-xs font-medium rounded border transition-colors ${lang === 'de' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
            >
              DE
            </button>
            <button 
              onClick={() => setLang('en')} 
              className={`flex-1 py-1.5 text-xs font-medium rounded border transition-colors ${lang === 'en' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLang('hi')} 
              className={`flex-1 py-1.5 text-xs font-medium rounded border transition-colors ${lang === 'hi' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
            >
              HI
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full flex items-center justify-center py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-70"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin"/> : <Save className="w-4 h-4 mr-2" />}
            {t.profile.save}
          </button>
          
          <button className="w-full flex items-center justify-center py-2 text-xs text-red-500 hover:bg-red-50 rounded transition-colors">
            <LogOut className="w-3 h-3 mr-2" /> {t.profile.logout}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lang, setLang] = useState('de'); 
  const t = translations[lang];
  
  // Hierarchy State
  const [selectedLocation, setSelectedLocation] = useState(HIERARCHY_DATA[0].id);
  const [selectedHall, setSelectedHall] = useState(HIERARCHY_DATA[0].halls[0].id);
  const [selectedMachine, setSelectedMachine] = useState(HIERARCHY_DATA[0].halls[0].machines[0]?.id || '');
  const [selectedDevice, setSelectedDevice] = useState(HIERARCHY_DATA[0].halls[0].machines[0]?.devices[0]?.id || '');
  
  // Drilldown State
  const [drilldownConsumer, setDrilldownConsumer] = useState(null);

  // Derived Hierarchy Data
  const currentLocation = HIERARCHY_DATA.find(l => l.id === selectedLocation);
  const currentHalls = currentLocation?.halls || [];
  const currentHall = currentHalls.find(h => h.id === selectedHall);
  const currentMachines = currentHall?.machines || [];
  const currentMachine = currentMachines.find(m => m.id === selectedMachine);
  const currentDevices = currentMachine?.devices || [];
  const currentDeviceName = currentDevices.find(d => d.id === selectedDevice)?.name || t.hierarchy.all;

  // Cascading Updates
  useEffect(() => {
    if (currentHalls.length > 0 && !currentHalls.find(h => h.id === selectedHall)) {
      setSelectedHall(currentHalls[0].id);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (currentMachines.length > 0) {
        setSelectedMachine(currentMachines[0].id);
    } else {
        setSelectedMachine('');
    }
  }, [selectedHall]);

  useEffect(() => {
    if (currentDevices.length > 0) {
        setSelectedDevice(currentDevices[0].id);
    } else {
        setSelectedDevice('');
    }
  }, [selectedMachine]);

  const [data, setData] = useState(generateSimulatedData()); 
  const [historyData, setHistoryData] = useState([]); 
  const [historyView, setHistoryView] = useState('day'); 
  
  const [compareMode, setCompareMode] = useState('locations'); 
  const [comparisonData, setComparisonData] = useState([]);

  // --- FORECAST STATE ---
  const [forecastData, setForecastData] = useState(generateMLForecastData());
  const [mlModel, setMlModel] = useState('rf'); // rf, lstm, prophet
  const [isTraining, setIsTraining] = useState(false);

  // --- NOTIFICATION STATE ---
  const [alerts, setAlerts] = useState([]);
  const [showToast, setShowToast] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [dataSource, setDataSource] = useState('simulated');
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('202510');
  const [currentFile, setCurrentFile] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const [livePower, setLivePower] = useState(4250);
  const [profileCompletion, setProfileCompletion] = useState(65);
  const [weatherData, setWeatherData] = useState(null);

  const [heatmapData, setHeatmapData] = useState(generateHeatmapData());
  const [threePhaseData, setThreePhaseData] = useState([]);
  const [rmsData, setRmsData] = useState([]);
  const tickRef = useRef(0);

  const [userLevel, setUserLevel] = useState(4);
  const [currentXP, setCurrentXP] = useState(850);
  const [maxXP, setMaxXP] = useState(1200);
  const [quests, setQuests] = useState(QUESTS);

  // Helper to get localized month labels based on current language
  const getAvailableMonths = (currentLang) => {
    const localeMap = { de: 'de-DE', en: 'en-US', hi: 'hi-IN' };
    const locale = localeMap[currentLang] || 'en-US';
    
    const dates = [
      { id: '202510', date: new Date(2025, 9, 1) }, // Oct
      { id: '202509', date: new Date(2025, 8, 1) }, // Sep
      { id: '202508', date: new Date(2025, 7, 1) }, // Aug
    ];

    return dates.map(item => {
      // Format month name based on locale
      const label = item.date.toLocaleDateString(locale, { year: 'numeric', month: 'short' }); 
      return { id: item.id, label };
    });
  };

  const availableMonths = getAvailableMonths(lang);

  // --- SIMULATE LIVE ANOMALY DETECTION ---
  useEffect(() => {
    // Trigger random alerts occasionally for demo purposes
    const anomalyTimer = setInterval(() => {
      // 20% chance every 15s to trigger an alert (demo logic)
      if (Math.random() > 0.8) {
        const types = ['critical', 'warning'];
        const type = types[Math.floor(Math.random() * types.length)];
        const messages = [t.notifications.demoAlert1, t.notifications.demoAlert2, t.notifications.demoAlert3];
        const msg = messages[Math.floor(Math.random() * messages.length)];
        
        const newAlert = {
          id: Date.now(),
          title: type === 'critical' ? t.notifications.alertCritical : t.notifications.alertWarning,
          message: msg,
          time: new Date().toLocaleTimeString(),
          type: type
        };
        
        setAlerts(prev => [newAlert, ...prev]);
        setShowToast(newAlert);
        
        // Auto hide toast
        setTimeout(() => setShowToast(null), 6000);
      }
    }, 15000);

    return () => clearInterval(anomalyTimer);
  }, [lang]); // Re-run if language changes to update text

  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current += 1;
      const tick = tickRef.current;
      const newThreePhase = generateThreePhasePoint(tick);
      setThreePhaseData(prev => [...prev.slice(-40), newThreePhase]);
      const newRMS = generateRMSPoint(tick);
      setRmsData(prev => [...prev.slice(-40), newRMS]);
    }, 100); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLivePower(prev => prev + (Math.random() * 100 - 50));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateComparison = () => {
      const baseData = generateAdvancedHistoryData(selectedMonth, 'month'); 
      let newData = [];

      if (compareMode === 'locations') {
        newData = baseData.map(d => ({
          name: d.time, 
          set1: Math.round(d.kwh * 0.4), 
          set2: Math.round(d.kwh * 1.1), 
          set3: Math.round(d.kwh * 0.7), 
        }));
      } else if (compareMode === 'time') {
        const prevMonthId = selectedMonth === '202510' ? '202509' : (selectedMonth === '202509' ? '202508' : '202508');
        const prevData = generateAdvancedHistoryData(prevMonthId, 'month');
        
        newData = baseData.map((d, i) => ({
          name: d.time,
          set1: d.kwh, 
          set2: prevData[i] ? prevData[i].kwh : Math.round(d.kwh * 0.95), 
        }));
      } else if (compareMode === 'devices') {
         newData = baseData.map(d => ({
           name: d.time,
           set1: Math.round(d.kwh * 0.30), 
           set2: Math.round(d.kwh * 0.50), 
           set3: Math.round(d.kwh * 0.20), 
         }));
      }
      setComparisonData(newData);
    };
    updateComparison();
  }, [compareMode, selectedMonth]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=50.2581&longitude=10.9645&current_weather=true'
        );
        const data = await response.json();
        setWeatherData(data.current_weather);
      } catch (error) {
        setWeatherData({ temperature: 14, weathercode: 3, windspeed: 5.2 }); 
      }
    };
    fetchWeather();
  }, []);

  const handleFetchAxpoData = async () => {
    setLoading(true);
    const fileName = `ckw_opendata_smartmeter_dataset_a_${selectedMonth}.csv.gz`;
    setTimeout(() => {
      const mockedData = generateAdvancedHistoryData(selectedMonth, historyView);
      setHistoryData(mockedData);
      setDataSource('ckw');
      setCurrentFile(fileName);
      setLoading(false);
      if (!quests[1].completed) {
        completeQuest(2);
      }
    }, 1200);
  };

  const handleTrainModel = () => {
    setIsTraining(true);
    setTimeout(() => {
      setIsTraining(false);
      setForecastData(generateMLForecastData());
      alert("Modell erfolgreich neu trainiert!");
    }, 2000);
  };

  useEffect(() => {
    if (currentFile) {
      const mockedData = generateAdvancedHistoryData(selectedMonth, historyView);
      setHistoryData(mockedData);
    }
  }, [historyView]);

  const completeProfile = () => {
    if (profileCompletion < 100) {
      setProfileCompletion(100);
      addXP(150);
    }
  };

  const addXP = (amount) => {
    const newXP = currentXP + amount;
    if (newXP >= maxXP) {
      setUserLevel(prev => prev + 1);
      setCurrentXP(newXP - maxXP);
      setMaxXP(prev => Math.round(prev * 1.2));
      alert(`🎉 LEVEL UP! Level ${userLevel + 1}!`);
    } else {
      setCurrentXP(newXP);
    }
  };

  const completeQuest = (id) => {
    setQuests(prev => prev.map(q => {
      if (q.id === id && !q.completed) {
        addXP(q.xp);
        return { ...q, completed: true };
      }
      return q;
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6 pb-20 lg:pb-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <WeatherCard weather={weatherData} />
              <Card 
                title={t.cards.consumption} 
                value={Math.round(livePower)} 
                unit="W" 
                trend={-2.4} 
                icon={Zap} 
                colorClass="text-blue-600 bg-blue-600"
                subtext={t.cards.sub_live}
              />
              <Card 
                title={t.cards.machineState} 
                value={rmsData.length > 0 ? rmsData[rmsData.length-1].state : "Init..."} 
                unit="" 
                trend={0} 
                icon={Monitor} 
                colorClass="text-amber-600 bg-amber-600"
                subtext={currentMachine ? currentMachine.name : t.cards.sub_rms}
              />
               <Card 
                title={t.cards.gridQuality} 
                value={threePhaseData.length > 0 ? Math.round(threePhaseData[threePhaseData.length-1].L1) : 0} 
                unit="V" 
                trend={0.1} 
                icon={Waves} 
                colorClass="text-purple-600 bg-purple-600"
                subtext={t.cards.sub_sinus}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center">
                      <Waves className="w-5 h-5 mr-2 text-purple-600" />
                      Netzanalyse (3-Phasen)
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-1">{currentLocation?.name} - {currentHall?.name}</p>
                  </div>
                  <span className="animate-pulse flex h-3 w-3 rounded-full bg-green-500"></span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={threePhaseData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="time" hide={true} />
                      <YAxis domain={[-250, 250]} hide={true} />
                      <RechartsTooltip />
                      <Legend />
                      <Line type="monotone" dataKey="L1" stroke="#ef4444" dot={false} strokeWidth={2} isAnimationActive={false} />
                      <Line type="monotone" dataKey="L2" stroke="#3b82f6" dot={false} strokeWidth={2} isAnimationActive={false} />
                      <Line type="monotone" dataKey="L3" stroke="#22c55e" dot={false} strokeWidth={2} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-amber-600" />
                      Maschinen-Lastprofil (RMS)
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-1">{currentMachine?.name || 'Alle'} - {currentDeviceName}</p>
                  </div>
                  <span className="animate-pulse flex h-3 w-3 rounded-full bg-green-500"></span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={rmsData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="time" hide={true} />
                      <YAxis domain={[0, 6]} />
                      <RechartsTooltip />
                      <Line type="stepAfter" dataKey="value" stroke="#d97706" dot={false} strokeWidth={2} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
               <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-sm text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-5 rounded-full blur-3xl"></div>
                  <div className="relative z-10 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold">Datenqualität & Setup</h3>
                      <div className="flex mt-2">
                        <div className="mr-4">
                          <span className="text-xs text-slate-400 block">Profilvollständigkeit</span>
                          <span className="font-bold text-emerald-400">{profileCompletion}%</span>
                        </div>
                        <div>
                          <span className="text-xs text-slate-400 block">{t.gamification.level}</span>
                          <span className="font-bold text-amber-400">{userLevel}</span>
                        </div>
                      </div>
                    </div>
                    {profileCompletion < 100 && (
                      <button 
                        onClick={completeProfile}
                        className="bg-blue-600 hover:bg-blue-500 text-xs px-3 py-2 rounded-md font-medium transition-colors"
                      >
                        Daten vervollständigen (+150 XP)
                      </button>
                    )}
                  </div>
               </div>
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="space-y-6 pb-20 lg:pb-0">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                {/* Header Section */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center">
                      <Database className="w-5 h-5 mr-2 text-blue-600" />
                      {t.history.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {t.history.desc}
                      <br/>
                      {t.history.source} <a href="https://open.data.axpo.com/$web/index.html" target="_blank" className="text-blue-500 hover:underline">open.data.axpo.com</a>
                    </p>
                    {currentFile && (
                      <div className="flex items-center mt-2 text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-200 w-fit">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {t.history.loaded} {currentFile}
                      </div>
                    )}
                  </div>
                  
                  {/* Controls */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                    {/* View Switcher */}
                    <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-medium border border-slate-200">
                      <button 
                        onClick={() => setHistoryView('day')}
                        className={`px-3 py-1.5 rounded-md transition-all ${historyView === 'day' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        {t.history.viewDay}
                      </button>
                      <button 
                        onClick={() => setHistoryView('week')}
                        className={`px-3 py-1.5 rounded-md transition-all ${historyView === 'week' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        {t.history.viewWeek}
                      </button>
                      <button 
                        onClick={() => setHistoryView('month')}
                        className={`px-3 py-1.5 rounded-md transition-all ${historyView === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        {t.history.viewMonth}
                      </button>
                    </div>

                    <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <select 
                        value={selectedMonth} 
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="bg-white border border-slate-300 text-slate-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none"
                      >
                        {availableMonths.map(m => (
                          <option key={m.id} value={m.id}>{m.label}</option>
                        ))}
                      </select>
                      
                      <button 
                        onClick={handleFetchAxpoData}
                        disabled={loading}
                        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${loading ? 'bg-slate-200 text-slate-400 cursor-wait' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                      >
                        {loading ? (
                          <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Download className="w-4 h-4 mr-2" />
                        )}
                        {loading ? t.history.loading : t.history.load}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Chart Area */}
                <div className="h-96 w-full relative border border-slate-50 rounded-lg bg-slate-50/30 p-2">
                  {loading && (
                    <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center flex-col backdrop-blur-sm">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <p className="text-sm text-blue-600 font-medium">{t.history.loading}</p>
                      <p className="text-xs text-slate-400 font-mono mt-1">{t.history.processing}</p>
                    </div>
                  )}
                  {!loading && !currentFile && (
                    <div className="absolute inset-0 flex items-center justify-center flex-col text-slate-400">
                       <Clock className="w-12 h-12 mb-2 opacity-50" />
                       <p>{t.history.noData}</p>
                    </div>
                  )}
                  {currentFile && !loading && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historyData}>
                      <defs>
                        <linearGradient id="colorKwh" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="time" 
                        stroke="#94a3b8" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        minTickGap={20} // Adjust based on data density
                      />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} unit=" kWh" />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        labelFormatter={(label, payload) => payload[0]?.payload?.fullDate || label}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="kwh" name="Netzbezug" stroke="#3b82f6" fillOpacity={1} fill="url(#colorKwh)" strokeWidth={2} />
                      <Area type="monotone" dataKey="solar" name="Solarerzeugung" stroke="#eab308" fillOpacity={0.6} fill="#eab308" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                  )}
                </div>
            </div>
          </div>
        );
      case 'compare':
        return (
          <div className="space-y-6 pb-20 lg:pb-0">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-full min-h-[600px]">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center">
                    <ArrowRightLeft className="w-5 h-5 mr-2 text-indigo-600" />
                    {t.compare.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{t.compare.subtitle}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Mode Select */}
                  <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                    <button 
                      onClick={() => setCompareMode('locations')}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${compareMode === 'locations' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <Factory className="w-4 h-4 mr-2" />
                      {t.compare.modeLocations}
                    </button>
                    <button 
                      onClick={() => setCompareMode('devices')}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${compareMode === 'devices' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <Monitor className="w-4 h-4 mr-2" />
                      {t.compare.modeDevices}
                    </button>
                    <button 
                      onClick={() => setCompareMode('time')}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all ${compareMode === 'time' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <CalendarDays className="w-4 h-4 mr-2" />
                      {t.compare.modeTime}
                    </button>
                  </div>

                  {/* Month Select */}
                  <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <select 
                        value={selectedMonth} 
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="bg-white border border-slate-300 text-slate-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none"
                      >
                        {availableMonths.map(m => (
                          <option key={m.id} value={m.id}>{m.label}</option>
                        ))}
                      </select>
                      <button 
                        onClick={() => {
                          setLoading(true);
                          setTimeout(() => setLoading(false), 800); 
                        }}
                        className="p-2 bg-white text-blue-600 border border-slate-200 rounded hover:bg-slate-50"
                      >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                      </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Chart */}
              <div className="flex-1 w-full min-h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={comparisonData} key={compareMode + selectedMonth}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} hide={true} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{fill: '#f1f5f9'}}
                    />
                    <Legend />
                    
                    {/* Line Configuration based on Mode */}
                    {compareMode === 'locations' ? [
                        <Line key="l1" type="monotone" name={t.compare.legendA} dataKey="set1" stroke="#3b82f6" strokeWidth={2} dot={false} />,
                        <Line key="l2" type="monotone" name={t.compare.legendB} dataKey="set2" stroke="#ef4444" strokeWidth={2} dot={false} />
                    ] : null}

                    {compareMode === 'devices' ? [
                        <Line key="d1" type="stepAfter" name={t.compare.devHVAC} dataKey="set1" stroke="#8b5cf6" strokeWidth={2} dot={false} />,
                        <Line key="d2" type="stepAfter" name={t.compare.devProd} dataKey="set2" stroke="#ec4899" strokeWidth={2} dot={false} />
                    ] : null}

                    {compareMode === 'time' ? [
                        <Line key="t1" type="monotone" name={t.compare.timeCurrent} dataKey="set1" stroke="#22c55e" strokeWidth={2} dot={false} />,
                        <Line key="t2" type="monotone" name={t.compare.timePrevious} dataKey="set2" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    ] : null}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6 pb-20 lg:pb-0 relative">
            {/* DRILLDOWN MODAL */}
            <DrilldownModal consumer={drilldownConsumer} onClose={() => setDrilldownConsumer(null)} t={t} />

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
               <div className="mb-6">
                 <h3 className="text-lg font-bold text-slate-800 flex items-center">
                   <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                   {t.analytics.heatmapTitle}
                 </h3>
                 <p className="text-sm text-slate-500">
                   {t.analytics.heatmapDesc}
                   <span className="inline-block w-3 h-3 bg-red-500 rounded-full ml-2 mr-1"></span> = Hohe Last
                 </p>
               </div>
               
               <div className="overflow-x-auto">
                 <div className="min-w-[600px] grid grid-cols-[50px_1fr] gap-4">
                    <div className="flex flex-col justify-around text-xs text-slate-500 font-bold py-2">
                      {heatmapData.map(d => <span key={d.day}>{d.day}</span>)}
                    </div>
                    <div className="grid grid-rows-7 gap-2">
                       {heatmapData.map((dayData, i) => (
                         <div key={i} className="grid gap-1 h-8" style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}>
                           {dayData.hours.map((val, h) => (
                             <HeatmapCell key={h} value={val} />
                           ))}
                         </div>
                       ))}
                    </div>
                 </div>
               </div>

               <div className="overflow-x-auto mt-2">
                 <div className="min-w-[600px] grid grid-cols-[50px_1fr] gap-4">
                   <div></div>
                   <div className="flex justify-between text-xs text-slate-400 px-1">
                     <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
                   </div>
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-2">{t.analytics.peaksTitle}</h3>
                <p className="text-sm text-slate-500 mb-6">{t.analytics.peaksDesc}</p>
                
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={peakConsumers} layout="vertical" key="analytics-bar">
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                      <RechartsTooltip cursor={{fill: 'transparent'}} />
                      <Bar 
                        dataKey="value" 
                        fill="#3b82f6" 
                        radius={[0, 4, 4, 0]} 
                        barSize={20} 
                        onClick={(data) => setDrilldownConsumer(data)} // CLICK HANDLER FOR DRILLDOWN
                        cursor="pointer"
                      >
                        {peakConsumers.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : '#3b82f6'} className="hover:opacity-80 transition-opacity" />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
                 <div>
                   <h3 className="text-lg font-bold text-slate-800 mb-2">{t.analytics.costTitle}</h3>
                   <p className="text-sm text-slate-500 mb-4">{t.analytics.costDesc}</p>
                 </div>
                 
                 <div className="flex flex-col items-center justify-center my-4">
                   <div className="relative">
                     <PieChart width={200} height={200} key="analytics-pie">
                       <Pie
                         data={[{value: 75}, {value: 25}]}
                         cx={100}
                         cy={100}
                         innerRadius={60}
                         outerRadius={80}
                         fill="#8884d8"
                         paddingAngle={5}
                         dataKey="value"
                         startAngle={90}
                         endAngle={-270}
                       >
                         <Cell fill="#eab308" />
                         <Cell fill="#f1f5f9" />
                       </Pie>
                     </PieChart>
                     <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                       <span className="block text-3xl font-bold text-slate-800">75%</span>
                       <span className="text-xs text-slate-400">{t.analytics.budget}</span>
                     </div>
                   </div>
                 </div>

                 <div className="bg-slate-50 p-4 rounded-lg">
                   <div className="flex justify-between mb-2">
                     <span className="text-sm text-slate-600">{t.analytics.current}</span>
                     <span className="font-bold text-slate-900">1.240 €</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-sm text-slate-600">{t.analytics.forecast}</span>
                     <span className="font-bold text-amber-600">1.650 €</span>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        );
      case 'forecast':
        return (
          <div className="space-y-6 pb-20 lg:pb-0">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-600" />
                    {t.forecast.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{t.forecast.subtitle}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <div className="text-xs font-bold text-slate-500 uppercase">{t.forecast.model}</div>
                  <select 
                    value={mlModel}
                    onChange={(e) => setMlModel(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-md block p-2 outline-none"
                  >
                    <option value="rf">{t.forecast.algoRF}</option>
                    <option value="lstm">{t.forecast.algoLSTM}</option>
                    <option value="prophet">{t.forecast.algoProphet}</option>
                  </select>
                  
                  <button 
                    onClick={handleTrainModel}
                    disabled={isTraining}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${isTraining ? 'bg-slate-200 text-slate-400 cursor-wait' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                  >
                    {isTraining ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Settings className="w-4 h-4 mr-2" />}
                    {isTraining ? t.forecast.training : t.forecast.train}
                  </button>
                </div>
              </div>

              {/* Forecast Chart */}
              <div className="h-[500px] w-full relative">
                 {isTraining && (
                    <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center flex-col backdrop-blur-sm">
                      <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <p className="text-sm text-purple-600 font-medium">Training {mlModel.toUpperCase()}...</p>
                    </div>
                 )}
                 
                 <div className="absolute top-4 left-16 z-10 bg-white/90 p-2 rounded border border-slate-200 shadow-sm">
                    <span className="text-xs text-slate-500 uppercase font-bold block">{t.forecast.accuracy}</span>
                    <span className="text-xl font-bold text-emerald-500">94.2%</span>
                 </div>

                 <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={forecastData} key="forecast-chart">
                      <defs>
                        <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} unit=" kW" />
                      <RechartsTooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend />
                      
                      {/* Confidence Interval (Area) */}
                      <Area type="monotone" dataKey="range" name={t.forecast.confidence} stroke="none" fill="url(#colorConfidence)" />
                      
                      {/* Actual Data (Past) */}
                      <Line type="monotone" name={t.cards.consumption} dataKey="actual" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      
                      {/* Forecast Data (Future) */}
                      <Line type="monotone" name={t.forecast.predicted} dataKey="predicted" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                      
                      {/* Bounds Visualization (Optional simple lines) */}
                      <Line type="monotone" dataKey="upper" stroke="#10b981" strokeWidth={1} strokeOpacity={0.5} dot={false} legendType="none" />
                      <Line type="monotone" dataKey="lower" stroke="#10b981" strokeWidth={1} strokeOpacity={0.5} dot={false} legendType="none" />
                    </ComposedChart>
                 </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      case 'gamification':
        return (
          <div className="space-y-6 pb-20 lg:pb-0">
            {/* --- HERO SECTION: Level & Tree --- */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-xl p-8 text-white relative overflow-hidden shadow-lg">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mt-10 -mr-10 blur-3xl"></div>
               <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 items-center relative z-10">
                 <div className="flex flex-col items-center justify-center">
                   <div className="w-32 h-32 bg-emerald-700/50 rounded-full flex items-center justify-center border-4 border-emerald-400/30 mb-4 relative">
                      <TreeDeciduous className={`w-16 h-16 ${userLevel > 5 ? 'text-amber-300' : 'text-emerald-300'} transition-all`} />
                      <div className="absolute -bottom-2 bg-emerald-500 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400">
                        {t.gamification.level} {userLevel}
                      </div>
                   </div>
                   <p className="text-emerald-200 text-sm font-medium">Eco-Champion</p>
                 </div>
                 
                 <div className="space-y-4">
                   <div>
                     <h2 className="text-3xl font-bold">{t.gamification.hello}</h2>
                     <p className="text-emerald-100 opacity-80">Du bist unter den Top 10% der Energiesparer in deinem Unternehmen.</p>
                   </div>
                   
                   <div>
                     <div className="flex justify-between text-sm mb-2 font-medium">
                       <span>{t.gamification.xp}</span>
                       <span>{currentXP} / {maxXP} XP</span>
                     </div>
                     <div className="w-full bg-emerald-900/50 h-4 rounded-full border border-emerald-700">
                        <div 
                          className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${(currentXP / maxXP) * 100}%` }}
                        ></div>
                     </div>
                     <p className="text-xs text-emerald-300 mt-2 flex items-center">
                       <Target className="w-3 h-3 mr-1" />
                       Noch {maxXP - currentXP} XP {t.gamification.nextLevel}
                     </p>
                   </div>
                 </div>
               </div>
            </div>

            {/* --- NEW CO2 BALANCE CARD --- */}
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-6 rounded-xl border border-emerald-100">
               <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center">
                 <Leaf className="w-5 h-5 mr-2 text-emerald-600" />
                 {t.gamification.co2Title}
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Total Saved */}
                 <div className="bg-white p-4 rounded-lg border border-emerald-100 shadow-sm flex flex-col justify-center items-center text-center">
                    <span className="text-sm text-emerald-600 font-medium mb-1">{t.gamification.co2Saved}</span>
                    <span className="text-3xl font-bold text-emerald-800">1,245 kg</span>
                 </div>
                 
                 {/* Equivalents */}
                 <div className="bg-white p-4 rounded-lg border border-emerald-100 shadow-sm">
                    <p className="text-xs text-emerald-600 mb-3 font-medium uppercase">{t.gamification.impact}</p>
                    <div className="flex justify-around items-center">
                       <div className="flex flex-col items-center">
                          <Trees className="w-8 h-8 text-emerald-500 mb-1" />
                          <span className="font-bold text-slate-700">58</span>
                          <span className="text-[10px] text-slate-400">{t.gamification.trees}</span>
                       </div>
                       <div className="w-px h-8 bg-slate-100"></div>
                       <div className="flex flex-col items-center">
                          <Car className="w-8 h-8 text-blue-400 mb-1" />
                          <span className="font-bold text-slate-700">6,800</span>
                          <span className="text-[10px] text-slate-400">{t.gamification.car}</span>
                       </div>
                    </div>
                 </div>

                 {/* Monthly Goal */}
                 <div className="bg-white p-4 rounded-lg border border-emerald-100 shadow-sm flex flex-col justify-center">
                    <div className="flex justify-between text-xs font-medium text-emerald-700 mb-2">
                      <span>{t.gamification.goal}</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                       <div className="bg-emerald-500 h-full rounded-full w-[85%]"></div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 text-center">Nur noch 120 kg bis zum Ziel!</p>
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* --- QUESTS --- */}
               <div className="lg:col-span-2 space-y-6">
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                   <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                     <CheckSquare className="w-5 h-5 mr-2 text-blue-500" />
                     {t.gamification.activeQuests}
                   </h3>
                   <div className="space-y-3">
                     {quests.map(quest => (
                       <div key={quest.id} className={`p-4 rounded-lg border flex flex-col md:flex-row items-start md:items-center justify-between transition-colors ${quest.completed ? 'bg-slate-50 border-slate-200 opacity-70' : 'bg-white border-slate-200 hover:border-blue-300'}`}>
                          <div className="flex items-start mb-4 md:mb-0">
                            <div className={`mt-1 p-2 rounded-full mr-4 ${quest.completed ? 'bg-slate-200 text-slate-500' : 'bg-blue-50 text-blue-600'}`}>
                               {quest.type === 'weekly' ? <Calendar className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                            </div>
                            <div>
                               <h4 className={`font-bold text-sm ${quest.completed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{quest.title}</h4>
                               <p className="text-xs text-slate-500 mt-1">{quest.desc}</p>
                               <div className="mt-2 flex items-center space-x-2">
                                 <span className="text-xs font-bold text-amber-500 flex items-center">
                                   <Star className="w-3 h-3 mr-1 fill-current" /> {quest.xp} XP
                                 </span>
                                 <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                   {quest.type}
                                 </span>
                               </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => completeQuest(quest.id)}
                            disabled={quest.completed}
                            className={`w-full md:w-auto px-4 py-2 rounded-lg text-sm font-medium transition-colors ${quest.completed ? 'text-green-600 bg-green-50 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                          >
                            {quest.completed ? t.gamification.done : t.gamification.finish}
                          </button>
                       </div>
                     ))}
                   </div>
                 </div>

                 {/* --- BADGES --- */}
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                      <Medal className="w-5 h-5 mr-2 text-amber-500" />
                      {t.gamification.badges}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       {BADGES.map(badge => (
                         <div key={badge.id} className={`flex flex-col items-center justify-center p-4 rounded-xl border ${badge.unlocked ? 'border-slate-100 bg-slate-50' : 'border-dashed border-slate-200 bg-slate-50/50'}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${badge.unlocked ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                               {badge.unlocked ? (
                                 <badge.icon className={`w-6 h-6 ${badge.color}`} />
                               ) : (
                                 <Lock className="w-5 h-5 text-slate-300" />
                               )}
                            </div>
                            <span className={`text-xs font-bold text-center ${badge.unlocked ? 'text-slate-700' : 'text-slate-400'}`}>
                              {badge.name}
                            </span>
                         </div>
                       ))}
                    </div>
                 </div>
               </div>

               {/* --- LEADERBOARD --- */}
               <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                     <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                     {t.gamification.leaderboard}
                  </h3>
                  <div className="flex-1 overflow-y-auto pr-1">
                     <table className="w-full text-sm text-left">
                       <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                         <tr>
                           <th className="px-3 py-3 rounded-l-lg">#</th>
                           <th className="px-3 py-3">{t.gamification.rank}</th>
                           <th className="px-3 py-3 rounded-r-lg text-right">{t.gamification.score}</th>
                         </tr>
                       </thead>
                       <tbody>
                         {LEADERBOARD.map((entry) => (
                           <tr key={entry.rank} className={`border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors ${entry.rank === 3 ? 'bg-blue-50/50' : ''}`}>
                             <td className="px-3 py-4 font-bold text-slate-500">
                               {entry.rank === 1 ? <Trophy className="w-4 h-4 text-yellow-500" /> : entry.rank}
                             </td>
                             <td className="px-3 py-4 font-medium text-slate-800">
                               {entry.name}
                               {entry.rank === 3 && <span className="ml-2 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">DU</span>}
                             </td>
                             <td className="px-3 py-4 text-right font-bold text-slate-600">
                               {entry.score}
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs text-center text-slate-400">
                      {t.gamification.footer}
                    </p>
                  </div>
               </div>
            </div>
          </div>
        );
      default:
        return <div className="p-12 text-center text-slate-500">Modul nicht aktiv</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 flex-col lg:flex-row">
      {/* Toast Notification */}
      <NotificationToast alert={showToast} onClose={() => setShowToast(null)} t={t} />

      {/* SIDEBAR DESKTOP */}
      <div className="hidden lg:flex w-64 bg-[#03057a] flex-shrink-0 flex-col justify-between transition-all duration-300 relative">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-slate-800">
            <img src="https://future.systems/wp-content/uploads/2022/02/cropped-favicon_01-192x192.png" alt="Logo" className="w-8 h-8 rounded-full" />
            <span className="ml-3 text-white font-bold text-xl">Future Systems</span>
          </div>
          <nav className="mt-8 px-4 space-y-2">
            {[
              { id: 'dashboard', icon: Home, label: t.nav.dashboard },
              { id: 'history', icon: Database, label: t.nav.history },
              { id: 'analytics', icon: BarChart2, label: t.nav.analytics },
              { id: 'compare', icon: ArrowRightLeft, label: t.nav.compare },
              { id: 'forecast', icon: Brain, label: t.nav.forecast },
              { id: 'gamification', icon: Award, label: t.nav.gamification },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-[#7bfafd] hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        {/* User Profile Trigger Desktop */}
        <div className="p-4 border-t border-slate-800 relative">
          <ProfileModal 
            isOpen={isProfileOpen} 
            onClose={() => setIsProfileOpen(false)} 
            lang={lang} 
            setLang={setLang} 
            t={t} 
          />
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center w-full p-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition"
          >
             <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-sm">CZ</div>
             <div className="ml-3 text-left">
               <p className="text-sm font-medium">Christian Zimmermann</p>
               <p className="text-xs text-slate-400">Level {userLevel}</p>
             </div>
             <Settings className="w-4 h-4 ml-auto text-slate-400" />
          </button>
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#03057a] border-t border-slate-800 z-50 flex justify-around p-2">
         {[
            { id: 'dashboard', icon: Home, label: 'Dash' },
            { id: 'history', icon: Database, label: 'Hist' },
            { id: 'analytics', icon: BarChart2, label: 'Analyt' },
            { id: 'compare', icon: ArrowRightLeft, label: 'Comp' },
            { id: 'forecast', icon: Brain, label: 'ML' },
            { id: 'gamification', icon: Award, label: 'Erfolg' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? 'text-blue-400' 
                  : 'text-[#7bfafd]'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] mt-1">{item.label}</span>
            </button>
          ))}
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex flex-col items-center p-2 text-[#7bfafd]"
          >
            <User className="w-6 h-6" />
            <span className="text-[10px] mt-1">Profil</span>
          </button>
      </div>

      {/* MOBILE PROFILE MODAL */}
      {isProfileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-[60] flex items-end justify-center" onClick={() => setIsProfileOpen(false)}>
           <div className="bg-white w-full rounded-t-xl p-6" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">{t.profile.title}</h3>
                <button onClick={() => setIsProfileOpen(false)}><X className="w-6 h-6 text-slate-400"/></button>
              </div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg mr-4">CZ</div>
                <div>
                  <p className="font-bold text-slate-800 text-lg">Christian Zimmermann</p>
                  <p className="text-sm text-slate-500">{t.profile.role}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="text-sm font-bold text-slate-700 block mb-2">{t.profile.language}</label>
                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => setLang('de')} 
                    className={`py-3 rounded-lg border font-medium ${lang === 'de' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                  >
                    Deutsch
                  </button>
                  <button 
                    onClick={() => setLang('en')} 
                    className={`py-3 rounded-lg border font-medium ${lang === 'en' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                  >
                    English
                  </button>
                  <button 
                    onClick={() => setLang('hi')} 
                    className={`py-3 rounded-lg border font-medium ${lang === 'hi' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                  >
                    हिन्दी
                  </button>
                </div>
              </div>
              
              <button className="w-full py-3 text-red-500 bg-red-50 rounded-lg font-medium flex items-center justify-center">
                <LogOut className="w-5 h-5 mr-2" /> {t.profile.logout}
              </button>
           </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        <header className="bg-white border-b border-slate-200 flex flex-col z-10 flex-shrink-0">
           <div className="h-16 flex items-center justify-between px-4 lg:px-6">
              <h2 className="text-lg lg:text-xl font-bold text-slate-800 capitalize truncate pr-4">{t.header.title}</h2>
              <div className="flex items-center flex-shrink-0 space-x-2 lg:space-x-4">
                 <div className="hidden md:flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200 whitespace-nowrap">
                   <Activity className="w-3 h-3 mr-1" />
                   {t.header.live}
                 </div>
                 
                 {/* NOTIFICATIONS BUTTON */}
                 <div className="relative">
                   <button 
                     onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                     className="p-2 text-slate-400 hover:text-blue-600 transition-colors relative"
                   >
                     <Bell className="w-5 h-5" />
                     {alerts.length > 0 && (
                       <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                     )}
                   </button>
                   
                   {/* Notifications Dropdown */}
                   {isNotificationsOpen && (
                     <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200">
                       <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                         <h4 className="font-bold text-slate-800">{t.notifications.title}</h4>
                         {alerts.length > 0 && (
                           <button onClick={() => setAlerts([])} className="text-xs text-slate-400 hover:text-blue-600">{t.notifications.clear}</button>
                         )}
                       </div>
                       <div className="max-h-80 overflow-y-auto p-2">
                         {alerts.length === 0 ? (
                           <div className="p-8 text-center text-slate-400 text-sm">
                             <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                             {t.notifications.empty}
                           </div>
                         ) : (
                           alerts.map(alert => (
                             <div key={alert.id} className={`p-3 mb-2 rounded-lg border-l-4 ${alert.type === 'critical' ? 'bg-red-50 border-red-500' : 'bg-amber-50 border-amber-500'} flex items-start`}>
                               <div className={`mt-0.5 mr-3 ${alert.type === 'critical' ? 'text-red-500' : 'text-amber-500'}`}>
                                 <AlertCircle className="w-4 h-4" />
                               </div>
                               <div>
                                 <p className="text-sm font-bold text-slate-800">{alert.title}</p>
                                 <p className="text-xs text-slate-600 mt-0.5">{alert.message}</p>
                                 <p className="text-[10px] text-slate-400 mt-1">{alert.time}</p>
                               </div>
                             </div>
                           ))
                         )}
                       </div>
                     </div>
                   )}
                   {isNotificationsOpen && (
                     <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)}></div>
                   )}
                 </div>
              </div>
           </div>

           {/* GLOBAL HIERARCHY SELECTOR BAR */}
           <div className="px-4 lg:px-6 pb-4 flex overflow-x-auto gap-2 items-center no-scrollbar border-b border-slate-100">
              
              {/* Location */}
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 min-w-[160px] flex-shrink-0">
                <MapPin className="w-4 h-4 text-slate-400 mr-2" />
                <div className="flex flex-col w-full">
                  <span className="text-[10px] text-slate-400 uppercase font-bold leading-none mb-0.5">{t.hierarchy.location}</span>
                  <select 
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="bg-transparent text-sm font-medium text-slate-700 outline-none w-full cursor-pointer"
                  >
                    {HIERARCHY_DATA.map(loc => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />

              {/* Hall */}
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 min-w-[160px] flex-shrink-0">
                <Warehouse className="w-4 h-4 text-slate-400 mr-2" />
                <div className="flex flex-col w-full">
                  <span className="text-[10px] text-slate-400 uppercase font-bold leading-none mb-0.5">{t.hierarchy.hall}</span>
                  <select 
                    value={selectedHall}
                    onChange={(e) => setSelectedHall(e.target.value)}
                    className="bg-transparent text-sm font-medium text-slate-700 outline-none w-full cursor-pointer"
                  >
                    {currentHalls.map(hall => (
                      <option key={hall.id} value={hall.id}>{hall.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />

              {/* Machine */}
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 min-w-[160px] flex-shrink-0">
                <Factory className="w-4 h-4 text-slate-400 mr-2" />
                <div className="flex flex-col w-full">
                  <span className="text-[10px] text-slate-400 uppercase font-bold leading-none mb-0.5">{t.hierarchy.machine}</span>
                  <select 
                    value={selectedMachine}
                    onChange={(e) => setSelectedMachine(e.target.value)}
                    className="bg-transparent text-sm font-medium text-slate-700 outline-none w-full cursor-pointer"
                  >
                    <option value="">{t.hierarchy.all}</option>
                    {currentMachines.map(mach => (
                      <option key={mach.id} value={mach.id}>{mach.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />

              {/* Device */}
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 min-w-[160px] flex-shrink-0">
                <Cpu className="w-4 h-4 text-slate-400 mr-2" />
                <div className="flex flex-col w-full">
                  <span className="text-[10px] text-slate-400 uppercase font-bold leading-none mb-0.5">{t.hierarchy.device}</span>
                  <select 
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                    className="bg-transparent text-sm font-medium text-slate-700 outline-none w-full cursor-pointer"
                    disabled={!selectedMachine}
                  >
                    <option value="">{t.hierarchy.all}</option>
                    {currentDevices.map(dev => (
                      <option key={dev.id} value={dev.id}>{dev.name}</option>
                    ))}
                  </select>
                </div>
              </div>

           </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}