
export interface StateLanguage {
  code: string
  name: string
  nativeName: string
  state: string
}

export const stateLanguages: StateLanguage[] = [
  // Punjab
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', state: 'punjab' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', state: 'punjab' },
  
  // Haryana
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', state: 'haryana' },
  { code: 'hy', name: 'Haryanvi', nativeName: 'हरियाणवी', state: 'haryana' },
  
  // Uttar Pradesh
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', state: 'uttar-pradesh' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', state: 'uttar-pradesh' },
  
  // Madhya Pradesh
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', state: 'madhya-pradesh' },
  
  // Maharashtra
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', state: 'maharashtra' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', state: 'maharashtra' },
  
  // Bihar
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', state: 'bihar' },
  { code: 'bh', name: 'Bhojpuri', nativeName: 'भोजपुरी', state: 'bihar' },
  { code: 'mg', name: 'Magahi', nativeName: 'मगही', state: 'bihar' },
  
  // West Bengal
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', state: 'west-bengal' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', state: 'west-bengal' },
  
  // Andhra Pradesh
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', state: 'andhra-pradesh' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', state: 'andhra-pradesh' },
  
  // Telangana
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', state: 'telangana' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', state: 'telangana' },
  
  // Gujarat
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', state: 'gujarat' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', state: 'gujarat' },
  
  // Tamil Nadu
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', state: 'tamil-nadu' },
  { code: 'en', name: 'English', nativeName: 'English', state: 'tamil-nadu' },
  
  // Kerala
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', state: 'kerala' },
  { code: 'en', name: 'English', nativeName: 'English', state: 'kerala' },
  
  // Karnataka
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', state: 'karnataka' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', state: 'karnataka' },
  
  // Rajasthan
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', state: 'rajasthan' },
  { code: 'rj', name: 'Rajasthani', nativeName: 'राजस्थानी', state: 'rajasthan' },
  
  // Odisha
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', state: 'odisha' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', state: 'odisha' },
]

export interface Translation {
  [key: string]: string
}

export interface Translations {
  [languageCode: string]: Translation
}

export const translations: Translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.farms': 'My Farms',
    'nav.recommendations': 'Crop Advice',
    'nav.pest-detection': 'Pest Detection',
    'nav.chat': 'Expert Chat',
    'nav.sensors': 'IoT Sensors',
    'nav.analytics': 'Analytics',
    'nav.logout': 'Logout',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    
    // Common
    'common.welcome': 'Welcome',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.add': 'Add',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.selectLanguage': 'Select Language',
    'common.selectState': 'Select Your State',
    'common.selectYourState': 'Select your state for localized farming advice',
    
    // Home page
    'home.title': 'AgriNetra - Smart Crop Advisory System',
    'home.subtitle': 'Transform your farming with AI-powered crop recommendations, real-time pest detection, and intelligent IoT sensors. Join the agricultural revolution today.',
    'home.getStarted': 'Get Started Free',
    'home.learnMore': 'Learn More',
    'home.viewDemo': 'View Demo',
    'home.revolutionaryTech': 'Revolutionary Agricultural Technology',
    'home.smartCropAdvisory': 'Smart Crop Advisory',
    
    // Dashboard
    'dashboard.title': 'Farmer Dashboard',
    'dashboard.overview': 'Farm Overview',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.weatherUpdate': 'Weather Update',
    'dashboard.cropRecommendations': 'Crop Recommendations',
    
    // Farm Management
    'farm.addNew': 'Add New Farm',
    'farm.name': 'Farm Name',
    'farm.location': 'Location',
    'farm.size': 'Farm Size (hectares)',
    'farm.soilType': 'Soil Type',
    'farm.irrigationType': 'Irrigation Type',
    'farm.create': 'Create Farm',
    
    // Crop Recommendations
    'crops.title': 'Crop Recommendations',
    'crops.seasonal': 'Seasonal Recommendations',
    'crops.kharif': 'Kharif Season',
    'crops.rabi': 'Rabi Season',
    'crops.zaid': 'Zaid Season',
    
    // States and Agriculture
    'state.punjab': 'Punjab - Granary of India',
    'state.haryana': 'Haryana - Green Revolution Belt',
    'state.uttar-pradesh': 'Uttar Pradesh - Sugarcane Capital',
    'state.madhya-pradesh': 'Madhya Pradesh - Soybean State',
    'state.maharashtra': 'Maharashtra - Cotton Leader',
    'state.bihar': 'Bihar - Rice Bowl',
    'state.west-bengal': 'West Bengal - Rice & Jute Hub',
    'state.andhra-pradesh': 'Andhra Pradesh - Rice & Spices',
    'state.telangana': 'Telangana - IT & Agriculture',
    'state.gujarat': 'Gujarat - Cotton & Dairy',
    'state.tamil-nadu': 'Tamil Nadu - Rice & Horticulture',
    'state.kerala': 'Kerala - Spice Garden',
    'state.karnataka': 'Karnataka - Coffee Land',
    'state.rajasthan': 'Rajasthan - Millet State',
    'state.odisha': 'Odisha - Rice & Fisheries',
  },
  
  hi: {
    // Navigation (Hindi)
    'nav.home': 'होम',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.farms': 'मेरे खेत',
    'nav.recommendations': 'फसल सलाह',
    'nav.pest-detection': 'कीट पहचान',
    'nav.chat': 'विशेषज्ञ चैट',
    'nav.sensors': 'IoT सेंसर',
    'nav.analytics': 'विश्लेषण',
    'nav.logout': 'लॉगआउट',
    'nav.login': 'लॉगिन',
    'nav.signup': 'साइन अप',
    
    // Common (Hindi)
    'common.welcome': 'स्वागत',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.save': 'सहेजें',
    'common.cancel': 'रद्द करें',
    'common.submit': 'जमा करें',
    'common.edit': 'संपादित करें',
    'common.delete': 'हटाएं',
    'common.view': 'देखें',
    'common.add': 'जोड़ें',
    'common.next': 'अगला',
    'common.previous': 'पिछला',
    
    // Home page (Hindi)
    'home.title': 'एग्रीनेत्रा - स्मार्ट फसल सलाहकार प्रणाली',
    'home.subtitle': 'AI-संचालित अंतर्दृष्टि के साथ अपनी खेती को बदलें',
    'home.getStarted': 'शुरू करें',
    'home.learnMore': 'और जानें',
    
    // Dashboard (Hindi)
    'dashboard.title': 'किसान डैशबोर्ड',
    'dashboard.overview': 'खेत अवलोकन',
    'dashboard.recentActivity': 'हाल की गतिविधि',
    'dashboard.weatherUpdate': 'मौसम अपडेट',
    'dashboard.cropRecommendations': 'फसल सिफारिशें',
    
    // Farm Management (Hindi)
    'farm.addNew': 'नया खेत जोड़ें',
    'farm.name': 'खेत का नाम',
    'farm.location': 'स्थान',
    'farm.size': 'खेत का आकार (हेक्टेयर)',
    'farm.soilType': 'मिट्टी का प्रकार',
    'farm.irrigationType': 'सिंचाई का प्रकार',
    'farm.create': 'खेत बनाएं',
    
    // States (Hindi)
    'state.punjab': 'पंजाब - भारत का अन्न भंडार',
    'state.haryana': 'हरियाणा - हरित क्रांति क्षेत्र',
    'state.uttar-pradesh': 'उत्तर प्रदेश - गन्ना राजधानी',
    'state.madhya-pradesh': 'मध्य प्रदेश - सोयाबीन राज्य',
    'state.maharashtra': 'महाराष्ट्र - कपास नेता',
    'state.bihar': 'बिहार - चावल का कटोरा',
    'state.west-bengal': 'पश्चिम बंगाल - चावल और जूट केंद्र',
    'state.gujarat': 'गुजरात - कपास और डेयरी',
    'state.tamil-nadu': 'तमिलनाडु - चावल और बागवानी',
    'state.kerala': 'केरल - मसाला बगीचा',
    'state.karnataka': 'कर्नाटक - कॉफी भूमि',
    'state.rajasthan': 'राजस्थान - बाजरा राज्य',
    'state.odisha': 'ओडिशा - चावल और मत्स्य पालन',
  },
  
  // Add more languages for each state...
  pa: {
    // Punjabi translations
    'nav.home': 'ਘਰ',
    'nav.dashboard': 'ਡੈਸ਼ਬੋਰਡ',
    'nav.farms': 'ਮੇਰੇ ਖੇਤ',
    'home.title': 'ਅਗਰੀਨੇਤਰਾ - ਸਮਾਰਟ ਫਸਲ ਸਲਾਹਕਾਰ ਸਿਸਟਮ',
    'state.punjab': 'ਪੰਜਾਬ - ਭਾਰਤ ਦਾ ਅਨਾਜ ਭੰਡਾਰ',
  },
  
  mr: {
    // Marathi translations
    'nav.home': 'मुख्यपृष्ठ',
    'nav.dashboard': 'डॅशबोर्ड',
    'nav.farms': 'माझी शेती',
    'home.title': 'अग्रीनेत्रा - स्मार्ट पीक सल्लागार प्रणाली',
    'state.maharashtra': 'महाराष्ट्र - कापूस नेता',
  },
  
  bn: {
    // Bengali translations
    'nav.home': 'হোম',
    'nav.dashboard': 'ড্যাশবোর্ড',
    'nav.farms': 'আমার খামার',
    'home.title': 'এগ্রিনেত্রা - স্মার্ট ফসল পরামর্শ সিস্টেম',
    'state.west-bengal': 'পশ্চিমবঙ্গ - চাল ও পাট কেন্দ্র',
  },
  
  te: {
    // Telugu translations
    'nav.home': 'హోమ్',
    'nav.dashboard': 'డాష్‌బోర్డ్',
    'nav.farms': 'నా వ్యవసాయ క్షేత్రాలు',
    'home.title': 'అగ్రినేత్రా - స్మార్ట్ పంట సలహా వ్యవస్థ',
    'state.andhra-pradesh': 'ఆంధ్రప్రదేశ్ - వరి మరియు మసాలా',
    'state.telangana': 'తెలంగాణ - IT మరియు వ్యవసాయం',
  },
  
  gu: {
    // Gujarati translations
    'nav.home': 'ઘર',
    'nav.dashboard': 'ડેશબોર્ડ',
    'nav.farms': 'મારા ખેતરો',
    'home.title': 'અગ્રિનેત્રા - સ્માર્ટ પાક સલાહકાર સિસ્ટમ',
    'state.gujarat': 'ગુજરાત - કપાસ અને ડેરી',
  },
  
  ta: {
    // Tamil translations
    'nav.home': 'முகப்பு',
    'nav.dashboard': 'டாஷ்போர்டு',
    'nav.farms': 'எனது பண்ணைகள்',
    'home.title': 'அக்ரிநேத்ரா - ஸ்மார்ட் பயிர் ஆலோசனை அமைப்பு',
    'state.tamil-nadu': 'தமிழ்நாடு - அரிசி மற்றும் தோட்டக்கலை',
  },
  
  ml: {
    // Malayalam translations
    'nav.home': 'ഹോം',
    'nav.dashboard': 'ഡാഷ്ബോർഡ്',
    'nav.farms': 'എന്റെ കൃഷിയിടങ്ങൾ',
    'home.title': 'അഗ്രിനേത്രാ - സ്മാർട്ട് വിള ഉപദേശ സംവിധാനം',
    'state.kerala': 'കേരളം - മസാല തോട്ടം',
  },
  
  kn: {
    // Kannada translations
    'nav.home': 'ಮುಖ್ಯಪುಟ',
    'nav.dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'nav.farms': 'ನನ್ನ ಜಮೀನುಗಳು',
    'home.title': 'ಅಗ್ರಿನೇತ್ರಾ - ಸ್ಮಾರ್ಟ್ ಬೆಳೆ ಸಲಹಾ ವ್ಯವಸ್ಥೆ',
    'state.karnataka': 'ಕರ್ನಾಟಕ - ಕಾಫಿ ಭೂಮಿ',
  },
  
  or: {
    // Odia translations
    'nav.home': 'ଘର',
    'nav.dashboard': 'ଡ୍ୟାସବୋର୍ଡ',
    'nav.farms': 'ମୋର ଚାଷ ଜମି',
    'home.title': 'ଅଗ୍ରିନେତ୍ରା - ସ୍ମାର୍ଟ ଫସଲ ପରାମର୍ଶ ବ୍ୟବସ୍ଥା',
    'state.odisha': 'ଓଡ଼ିଶା - ଚାଉଳ ଏବଂ ମତ୍ସ୍ୟ ଚାଷ',
  }
}

export function getLanguagesForState(state: string): StateLanguage[] {
  return stateLanguages.filter(lang => lang.state === state)
}

export function translate(key: string, language: string = 'en'): string {
  return translations[language]?.[key] || translations['en'][key] || key
}

export function getCurrentLanguage(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('language') || 'en'
  }
  return 'en'
}

export function setCurrentLanguage(language: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', language)
  }
}

export function getUserState(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userState') || ''
  }
  return ''
}

export function setUserState(state: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userState', state)
  }
}
