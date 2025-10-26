export const translations = {
  // keep the previous fallback resource as a small compatibility map
  en: {
    // Landing Page
    heroTitle: 'Smart Crowd Management Solution',
    heroSubtitle: 'For Mahakumbh 2028',
    heroDescription: 'Advanced digital infrastructure ensuring safe and organized pilgrimage experience through AI-powered crowd monitoring, digital passes, and real-time management.',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    
    // Features
    digitalPass: 'Digital Pass System',
    digitalPassDesc: 'QR code-based entry passes with real-time validation',
    crowdMonitoring: 'Live Crowd Monitoring',
    crowdMonitoringDesc: 'AI-powered density tracking and prediction alerts',
    multiLanguage: 'Multilingual Support',
    multiLanguageDesc: 'Available in English and Hindi with SMS/IVR integration',
    
    // Authentication
    welcomeBack: 'Welcome Back',
    enterMobile: 'Enter your credentials to access TRINETRA',
    selectRole: 'Select Role',
    pilgrim: 'Pilgrim',
    authority: 'Authority',
    signIn: 'Sign In',
    loading: 'Loading...',
    error: 'Error occurred',
    success: 'Success',
    
    // Pilgrim Portal
    totalPilgrims: 'Total Pilgrims',
    activeAlerts: 'Active Alerts',
    liveMonitoring: 'Live Monitoring',
    recentEntries: 'Recent Entries',
    viewPass: 'View Pass',
    downloadPass: 'Download Pass'
  },
  hi: {
    // Landing Page
    heroTitle: 'स्मार्ट भीड़ प्रबंधन समाधान',
    heroSubtitle: 'महाकुंभ 2028 के लिए',
    heroDescription: 'एआई-संचालित भीड़ निगरानी, डिजिटल पास, और रियल-टाइम प्रबंधन के माध्यम से सुरक्षित और व्यवस्थित तीर्थयात्रा अनुभव सुनिश्चित करने वाला उन्नत डिजिटल ढांचा।',
    getStarted: 'शुरू करें',
    learnMore: 'और जानें',
    
    // Features
    digitalPass: 'डिजिटल पास सिस्टम',
    digitalPassDesc: 'रियल-टाइम सत्यापन के साथ QR कोड-आधारित प्रवेश पास',
    crowdMonitoring: 'लाइव भीड़ निगरानी',
    crowdMonitoringDesc: 'एआई-संचालित घनत्व ट्रैकिंग और भविष्यवाणी अलर्ट',
    multiLanguage: 'बहुभाषी समर्थन',
    multiLanguageDesc: 'एसएमएस/आईवीआर एकीकरण के साथ अंग्रेजी और हिंदी में उपलब्ध',
    
    // Authentication  
    welcomeBack: 'वापस स्वागत है',
    enterMobile: 'त्रिनेत्र तक पहुंचने के लिए अपनी क्रेडेंशियल दर्ज करें',
    selectRole: 'भूमिका चुनें',
    pilgrim: 'यात्री',
    authority: 'प्राधिकरण',
    signIn: 'साइन इन',
    loading: 'लोड हो रहा...',
    error: 'त्रुटि हुई',
    success: 'सफलता',
    
    // Pilgrim Portal
    totalPilgrims: 'कुल तीर्थयात्री',
    activeAlerts: 'सक्रिय अलर्ट',
    liveMonitoring: 'लाइव निगरानी',
    recentEntries: 'हाल की प्रविष्टियां',
    viewPass: 'पास देखें',
    downloadPass: 'पास डाउनलोड करें'
  },
};

// Unified hook: delegate to react-i18next and the app i18n instance
import i18n from '@/i18n';
import { useTranslation as useI18nHook } from 'react-i18next';

export const useTranslation = (language?: 'en' | 'hi' | 'te') => {
  // If a language is provided, switch i18n language only if it's different
  if (language && language !== i18n.language) {
    try {
      i18n.changeLanguage(language);
    } catch (e) {
      // ignore
    }
  }

  const { t } = useI18nHook();
  return t;
};