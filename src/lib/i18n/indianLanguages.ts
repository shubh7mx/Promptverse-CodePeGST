/**
 * DRISHTI-SWARM: Indian Language Metadata & Web Speech Voice Mappings
 */

export interface IndianLanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  script: string;
  voiceCode: string;
  sampleGreeting: string;
}

export const INDIAN_LANGUAGES: IndianLanguageConfig[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    script: 'Latin',
    voiceCode: 'en-IN',
    sampleGreeting: 'Emergency Alert System Active',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    voiceCode: 'hi-IN',
    sampleGreeting: 'आपातकालीन चेतावनी प्रणाली सक्रिय',
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    voiceCode: 'bn-IN',
    sampleGreeting: 'জরুরি সতর্কতা ব্যবস্থা সক্রিয়',
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'Telugu',
    voiceCode: 'te-IN',
    sampleGreeting: 'అత్యవసర హెచ్చరిక వ్యవస్థ క్రియాశీలం',
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    script: 'Devanagari',
    voiceCode: 'mr-IN',
    sampleGreeting: 'तातडीची इशारा प्रणाली सक्रिय',
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Tamil',
    voiceCode: 'ta-IN',
    sampleGreeting: 'அவசர எச்சரிக்கை அமைப்பு செயலில் உள்ளது',
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    script: 'Gujarati',
    voiceCode: 'gu-IN',
    sampleGreeting: 'કટોકટી ચેતવણી સિસ્ટમ સક્રિય',
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'Kannada',
    voiceCode: 'kn-IN',
    sampleGreeting: 'ತುರ್ತು ಎಚ್ಚರಿಕೆ ವ್ಯವಸ್ಥೆ ಸಕ್ರಿಯವಾಗಿದೆ',
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    script: 'Malayalam',
    voiceCode: 'ml-IN',
    sampleGreeting: 'അടിയന്തര മുന്നറിയിപ്പ് സംവിധാനം സജീവം',
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    script: 'Odia',
    voiceCode: 'or-IN',
    sampleGreeting: 'ଜରୁରୀକାଳୀନ ସତର୍କତା ବ୍ୟବସ୍ଥା ସକ୍ରିୟ',
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    script: 'Gurmukhi',
    voiceCode: 'pa-IN',
    sampleGreeting: 'ਐਮਰਜੈਂਸੀ ਅਲਰਟ ਸਿਸਟਮ ਸਰਗਰਮ',
  },
];
