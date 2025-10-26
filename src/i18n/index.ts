import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.pilgrim": "Pilgrim Portal",
      "nav.authority": "Authority Dashboard",
      "nav.login": "Login",
      "nav.logout": "Logout",
      
      // Landing Page
      "heroTitle": "Smart Crowd Management Solution",
      "heroSubtitle": "For Mahakumbh 2028", 
      "heroDescription": "Advanced digital infrastructure ensuring safe and organized pilgrimage experience through AI-powered crowd monitoring, digital passes, and real-time management.",
      "getStarted": "Get Started",
      "learnMore": "Learn More",
      "digitalPass": "Digital Pass System",
      "digitalPassDesc": "QR code-based entry passes with real-time validation",
      "crowdMonitoring": "Live Crowd Monitoring", 
      "crowdMonitoringDesc": "AI-powered density tracking and prediction alerts",
      "multiLanguage": "Multilingual Support",
      "multiLanguageDesc": "Available in English and Hindi with SMS/IVR integration",
      
      // Common
      "common.loading": "Loading...",
      "common.error": "Error occurred",
      "common.success": "Success",
      "common.cancel": "Cancel",
      "common.save": "Save",
      "common.delete": "Delete",
      "common.edit": "Edit",
      "common.view": "View",
      "common.search": "Search",
      "common.filter": "Filter",
      "common.refresh": "Refresh",
      "common.total": "Total",
      "common.active": "Active",
      "common.inactive": "Inactive",
      
      // Pilgrim Portal
      "pilgrim.welcome": "Welcome to TRINETRA Pilgrim Portal",
  "welcomeBack": "Welcome Back",
  "bookPass": "Book New Pass",
  "pilgrim.noPasses": "No Passes Yet",
  "pilgrim.noPassesDesc": "Book your first digital pass to begin your sacred journey",
  "pilgrim.entryLabel": "Entry:",
  "pilgrim.exitDeadlineLabel": "Exit Deadline:",
  "pilgrim.groupSizeLabel": "Group Size:",
  "pilgrim.members": "members",
  "pilgrim.tentCity": "Tent City:",
  "pilgrim.charged": "charged",
      "pilgrim.dashboard": "My Dashboard",
      "pilgrim.passes": "My Passes",
      "pilgrim.notifications": "Notifications",
      "pilgrim.help": "Help & Support",
      "pilgrim.speakToText": "Speak to Text",
      "pilgrim.voiceAssistant": "Voice Assistant",
      "pilgrim.language": "Language",
      
      // Authority Dashboard
      "authority.dashboard": "Authority Dashboard",
      "authority.crowdAnalysis": "Crowd Analysis",
      "authority.liveHeatmap": "Live Heatmap",
      "authority.analytics": "Analytics",
      "authority.alerts": "Alerts",
      "authority.zones": "Zones",
      "authority.statistics": "Statistics",
      "authority.reports": "Reports",
      
      // Chatbot
      "chatbot.title": "AI Assistant",
      "chatbot.placeholder": "Type your message or use voice...",
      "chatbot.listening": "Listening...",
      "chatbot.processing": "Processing...",
      "chatbot.welcome": "Hello! I'm your AI assistant. How can I help you today?",
      
      // Voice
      "voice.startListening": "Start Listening",
      "voice.stopListening": "Stop Listening",
      "voice.speak": "Speak",
      "voice.notSupported": "Voice recognition is not supported in your browser",
      
      // Analytics
      "analytics.crowdDensity": "Crowd Density",
      "analytics.visitorFlow": "Visitor Flow",
      "analytics.peakHours": "Peak Hours",
      "analytics.zoneComparison": "Zone Comparison",
      "analytics.historicalData": "Historical Data",
      "analytics.realTimeData": "Real-time Data",
      "analytics.predictions": "Predictions",
      
      // Alerts
      "alerts.high": "High",
      "alerts.medium": "Medium",
      "alerts.low": "Low",
      "alerts.crowdAlert": "Crowd Alert",
      "alerts.safetyAlert": "Safety Alert",
      "alerts.systemAlert": "System Alert"
    }
  },
  hi: {
    translation: {
      // Navigation
      "nav.home": "होम",
      "nav.pilgrim": "तीर्थयात्री पोर्टल",
      "nav.authority": "प्राधिकरण डैशबोर्ड",
      "nav.login": "लॉगिन",
      "nav.logout": "लॉगआउट",
      
      // Landing Page
      "heroTitle": "स्मार्ट भीड़ प्रबंधन समाधान",
      "heroSubtitle": "महाकुंभ 2028 के लिए",
      "heroDescription": "एआई-संचालित भीड़ निगरानी, डिजिटल पास, और रियल-टाइम प्रबंधन के माध्यम से सुरक्षित और व्यवस्थित तीर्थयात्रा अनुभव सुनिश्चित करने वाला उन्नत डिजिटल ढांचा।",
      "getStarted": "शुरू करें",
      "learnMore": "और जानें", 
      "digitalPass": "डिजिटल पास सिस्टम",
      "digitalPassDesc": "रियल-टाइम सत्यापन के साथ QR कोड-आधारित प्रवेश पास",
      "crowdMonitoring": "लाइव भीड़ निगरानी",
      "crowdMonitoringDesc": "एआई-संचालित घनत्व ट्रैकिंग और भविष्यवाणी अलर्ट",
      "multiLanguage": "बहुभाषी समर्थन", 
      "multiLanguageDesc": "एसएमएस/आईवीआर एकीकरण के साथ अंग्रेजी और हिंदी में उपलब्ध",
      
      // Common
      "common.loading": "लोड हो रहा है...",
      "common.error": "त्रुटि हुई",
      "common.success": "सफलता",
      "common.cancel": "रद्द करें",
      "common.save": "सेव करें",
      "common.delete": "डिलीट करें",
      "common.edit": "संपादित करें",
      "common.view": "देखें",
      "common.search": "खोजें",
      "common.filter": "फिल्टर",
      "common.refresh": "रिफ्रेश",
      "common.total": "कुल",
      "common.active": "सक्रिय",
      "common.inactive": "निष्क्रिय",
      
      // Pilgrim Portal
      "pilgrim.welcome": "त्रिनेत्र तीर्थयात्री पोर्टल में आपका स्वागत है",
  "welcomeBack": "वापस स्वागत है",
  "bookPass": "नया पास बुक करें",
  "pilgrim.noPasses": "अभी तक कोई पास नहीं",
  "pilgrim.noPassesDesc": "अपनी पवित्र यात्रा शुरू करने के लिए अपना पहला डिजिटल पास बुक करें",
  "pilgrim.entryLabel": "प्रवेश:",
  "pilgrim.exitDeadlineLabel": "निकासी समय सीमा:",
  "pilgrim.groupSizeLabel": "समूह का आकार:",
  "pilgrim.members": "सदस्य",
  "pilgrim.tentCity": "टेंट सिटी:",
  "pilgrim.charged": "शुल्क",
      "pilgrim.dashboard": "मेरा डैशबोर्ड",
      "pilgrim.passes": "मेरे पास",
      "pilgrim.notifications": "सूचनाएं",
      "pilgrim.help": "सहायता और सहारा",
      "pilgrim.speakToText": "आवाज से टेक्स्ट",
      "pilgrim.voiceAssistant": "आवाज सहायक",
      "pilgrim.language": "भाषा",
      
      // Authority Dashboard
      "authority.dashboard": "प्राधिकरण डैशबोर्ड",
      "authority.crowdAnalysis": "भीड़ विश्लेषण",
      "authority.liveHeatmap": "लाइव हीटमैप",
      "authority.analytics": "विश्लेषिकी",
      "authority.alerts": "अलर्ट",
      "authority.zones": "क्षेत्र",
      "authority.statistics": "आंकड़े",
      "authority.reports": "रिपोर्ट",
      
      // Chatbot
      "chatbot.title": "एआई सहायक",
      "chatbot.placeholder": "अपना संदेश टाइप करें या आवाज का उपयोग करें...",
      "chatbot.listening": "सुन रहा है...",
      "chatbot.processing": "प्रसंस्करण...",
      "chatbot.welcome": "नमस्कार! मैं आपका एआई सहायक हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?",
      
      // Voice
      "voice.startListening": "सुनना शुरू करें",
      "voice.stopListening": "सुनना बंद करें",
      "voice.speak": "बोलें",
      "voice.notSupported": "आपके ब्राउज़र में वॉयस रिकग्निशन समर्थित नहीं है",
      
      // Analytics
      "analytics.crowdDensity": "भीड़ घनत्व",
      "analytics.visitorFlow": "विज़िटर फ्लो",
      "analytics.peakHours": "पीक आवर्स",
      "analytics.zoneComparison": "क्षेत्र तुलना",
      "analytics.historicalData": "ऐतिहासिक डेटा",
      "analytics.realTimeData": "रियल-टाइम डेटा",
      "analytics.predictions": "भविष्यवाणियां",
      
      // Alerts
      "alerts.high": "उच्च",
      "alerts.medium": "मध्यम",
      "alerts.low": "कम",
      "alerts.crowdAlert": "भीड़ अलर्ट",
      "alerts.safetyAlert": "सुरक्षा अलर्ट",
      "alerts.systemAlert": "सिस्टम अलर्ट"
    }
  },
  te: {
    translation: {
      // Navigation
      "nav.home": "హోమ్",
      "nav.pilgrim": "యాత్రికుల పోర్టల్",
      "nav.authority": "అధికార డాష్‌బోర్డ్",
      "nav.login": "లాగిన్",
      "nav.logout": "లాగ్అవుట్",
      
      // Landing Page
      "heroTitle": "స్మార్ట్ గుంపు నిర్వహణ పరిష్కారం",
      "heroSubtitle": "మహాకుంభ 2028 కోసం",
      "heroDescription": "AI-శక్తితో కూడిన గుంపు పర్యవేక్షణ, డిజిటల్ పాసులు మరియు రియల్-టైమ్ మేనేజ్‌మెంట్ ద్వారా సురక్షితమైన మరియు వ్యవస్థీకృత తీర్థయాత్ర అనుభవాన్ని నిర్ధారించే అధునాతన డిజిటల్ మౌలిక సదుపాయాలు.",
      "getStarted": "ప్రారంభించండి",
      "learnMore": "మరింత తెలుసుకోండి",
      "digitalPass": "డిజిటల్ పాస్ సిస్టమ్",
      "digitalPassDesc": "రియల్-టైమ్ ధృవీకరణతో QR కోడ్-ఆధారిత ప్రవేశ పాసులు",
      "crowdMonitoring": "లైవ్ గుంపు పర్యవేక్షణ",
      "crowdMonitoringDesc": "AI-శక్తితో కూడిన సాంద్రత ట్రాకింగ్ మరియు అంచనా హెచ్చరికలు",
      "multiLanguage": "బహుభాషా మద్దతు",
      "multiLanguageDesc": "SMS/IVR ఏకీకరణతో ఇంగ్లీష్ మరియు హిందీలో అందుబాటులో ఉంది",
      
      // Common
      "common.loading": "లోడ్ అవుతోంది...",
      "common.error": "లోపం జరిగింది",
      "common.success": "విజయం",
      "common.cancel": "రద్దు చేయండి",
      "common.save": "సేవ్ చేయండి",
      "common.delete": "తొలగించండి",
      "common.edit": "సవరించండి",
      "common.view": "చూడండి",
      "common.search": "వెతకండి",
      "common.filter": "ఫిల్టర్",
      "common.refresh": "రిఫ్రెష్",
      "common.total": "మొత్తం",
      "common.active": "చురుకైన",
      "common.inactive": "నిష్క్రియ",
      
      // Pilgrim Portal
      "pilgrim.welcome": "త్రినేత్ర యాత్రికుల పోర్టల్‌కు స్వాగతం",
  "welcomeBack": "మళ్లీ స్వాగతం",
  "bookPass": "కొత్త పాస్ బుక్ చేయండి",
  "pilgrim.noPasses": "ఇప్పటివరకు పాసులు లేవు",
  "pilgrim.noPassesDesc": "మీ పుణ్య యాత్రను ప్రారంభించడానికి మీ మొదటి డిజిటల్ పాస్‌ను బుక్ చేయండి",
  "pilgrim.entryLabel": "ప్రవేశం:",
  "pilgrim.exitDeadlineLabel": "నిష్క్రమణ గడువు:",
  "pilgrim.groupSizeLabel": "సమూహం పరిమాణం:",
  "pilgrim.members": "సభ్యులు",
  "pilgrim.tentCity": "టెంట్ సిటీ:",
  "pilgrim.charged": "వెచ్చించబడింది",
      "pilgrim.dashboard": "నా డాష్‌బోర్డ్",
      "pilgrim.passes": "నా పాసులు",
      "pilgrim.notifications": "నోటిఫికేషన్లు",
      "pilgrim.help": "సహాయం & మద్దతు",
      "pilgrim.speakToText": "వాయిస్ టు టెక్స్ట్",
      "pilgrim.voiceAssistant": "వాయిస్ అసిస్టెంట్",
      "pilgrim.language": "భాష",
      
      // Authority Dashboard  
      "authority.dashboard": "అధికార డాష్‌బోర్డ్",
      "authority.crowdAnalysis": "గుంపు విశ్లేషణ",
      "authority.liveHeatmap": "లైవ్ హీట్‌మ్యాప్",
      "authority.analytics": "విశ్లేషణలు",
      "authority.alerts": "అలర్ట్‌లు",
      "authority.zones": "జోన్లు",
      "authority.statistics": "గణాంకాలు",
      "authority.reports": "నివేదికలు",
      
      // Chatbot
      "chatbot.title": "AI అసిస్టెంట్",
      "chatbot.placeholder": "మీ సందేశాన్ని టైప్ చేయండి లేదా వాయిస్ ఉపయోగించండి...",
      "chatbot.listening": "వింటోంది...",
      "chatbot.processing": "ప్రాసెసింగ్...",
      "chatbot.welcome": "హలో! నేను మీ AI అసిస్టెంట్. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?",
      
      // Voice
      "voice.startListening": "వినడం ప్రారంభించండి",
      "voice.stopListening": "వినడం ఆపండి", 
      "voice.speak": "మాట్లాడండి",
      "voice.notSupported": "మీ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ మద్దతు లేదు",
      
      // Analytics
      "analytics.crowdDensity": "గుంపు సాంద్రత",
      "analytics.visitorFlow": "విజిటర్ ఫ్లో",
      "analytics.peakHours": "పీక్ అవర్స్",
      "analytics.zoneComparison": "జోన్ పోలిక",
      "analytics.historicalData": "చారిత్రక డేటా",
      "analytics.realTimeData": "రియల్-టైమ్ డేటా",
      "analytics.predictions": "అంచనాలు",
      
      // Alerts
      "alerts.high": "అధిక",
      "alerts.medium": "మధ్యమ",
      "alerts.low": "తక్కువ",
      "alerts.crowdAlert": "గుంపు అలర్ట్",
      "alerts.safetyAlert": "భద్రతా అలర్ట్",
      "alerts.systemAlert": "సిస్టం అలర్ట్"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;