/**
 * DRISHTI-SWARM: Multilingual Emergency Advisory Templates
 */

import { DisasterCategory } from '@/types/disaster';

export interface EmergencyBroadcastContent {
  title: string;
  advisoryText: string;
  actionChecklist: string[];
  helplinePhone: string;
}

export const EMERGENCY_TRANSLATIONS: Record<string, Record<DisasterCategory, EmergencyBroadcastContent>> = {
  en: {
    FLOOD: {
      title: 'CRITICAL FLOOD WARNING & EVACUATION ADVISORY',
      advisoryText: 'River levels have breached dangerous thresholds due to continuous torrential rainfall. Inundation of low-lying areas is imminent. Move immediately to higher ground or designated multi-purpose relief shelters.',
      actionChecklist: [
        'Disconnect electrical mains and LPG gas valves before leaving.',
        'Carry emergency kit: drinking water, dry rations, flashlight, and medications.',
        'Do not attempt to walk, swim, or drive through moving floodwaters.',
        'Follow designated NDRF/SDRF evacuation corridors exclusively.',
      ],
      helplinePhone: '1078 (National Disaster Helpline) / 112',
    },
    CYCLONE: {
      title: 'SEVERE CYCLONE LANDFALL ALERT & COASTAL WARNING',
      advisoryText: 'A Very Severe Cyclonic Storm is approaching the coast with wind gusts up to 160 km/h and projected storm surges of 3 to 4 meters. Immediate coastal evacuation is in progress.',
      actionChecklist: [
        'Secure doors and windows; tape large glass panes.',
        'Remain inside fortified concrete shelters; avoid tin-roof structures.',
        'Keep battery-powered radios tuned to official IMD updates.',
        'Fishermen must strictly not venture into the sea.',
      ],
      helplinePhone: '1070 (State Emergency Operations Center)',
    },
    WILDFIRE: {
      title: 'FOREST FIRE EMERGENCY SPREAD ADVISORY',
      advisoryText: 'Active thermal hotspots detected expanding rapidly under dry windy conditions. Buffer settlements are ordered to maintain a 5 km clearance perimeter.',
      actionChecklist: [
        'Cover nose and mouth with wet cloths or N95 masks against smoke and particulate matter.',
        'Wet roof perimeters and vegetation surrounding structures.',
        'Keep domestic livestock untied and ready for transport.',
        'Report sudden flare-ups to the nearest Forest Division Helpline.',
      ],
      helplinePhone: '1926 (Forest Department Emergency)',
    },
    LANDSLIDE: {
      title: 'HIGH-RISK LANDSLIDE & DEBRIS FLOW EVACUATION ALERT',
      advisoryText: 'Torrential rains have saturated hill slopes above critical stability thresholds. Imminent risk of debris flows and rockfalls along ghat roads and hillside settlements.',
      actionChecklist: [
        'Evacuate hillside dwellings immediately; do not wait for nightfall.',
        'Listen for unusual rumbling sounds or cracking trees indicating slope movement.',
        'Avoid ghat road travel and valleys prone to mud accumulation.',
        'Report road blockages immediately to District Control Centers.',
      ],
      helplinePhone: '1077 (District Disaster Management Authority)',
    },
    EARTHQUAKE: {
      title: 'EARTHQUAKE SHAKE ADVISORY & AFTERSHOCK PROTOCOL',
      advisoryText: 'Seismic activity recorded in the region. Strong aftershocks may follow. Inspect structures for structural cracks before re-entering buildings.',
      actionChecklist: [
        'Practice DROP, COVER, and HOLD ON under sturdy furniture.',
        'Stay clear of power lines, glass windows, and unreinforced brick walls.',
        'Use stairs instead of elevators during evacuation.',
        'Check for gas leaks and extinguish open flames immediately.',
      ],
      helplinePhone: '112 (National Emergency Number)',
    },
    DROUGHT: {
      title: 'AGRICULTURAL DROUGHT & WATER CONSERVATION DIRECTIVE',
      advisoryText: 'Severe soil moisture deficit recorded across regional agricultural blocks. Water rationing protocols and crop protection advisories in effect.',
      actionChecklist: [
        'Implement micro-irrigation and drip systems to conserve moisture.',
        'Utilize community borewell storage strictly for drinking purposes.',
        'Access government fodder and grain depots at block headquarters.',
      ],
      helplinePhone: '1800-180-1551 (Kisan Call Center)',
    },
    COMPOUND: {
      title: 'COMPOUND MULTI-HAZARD DISASTER EMERGENCY',
      advisoryText: 'Simultaneous cyclone landfall, flash flooding, and slope instability active in the area. Extreme emergency protocols enforced.',
      actionChecklist: [
        'Adhere strictly to joint NDRF and Army rescue directions.',
        'Keep mobile devices charged using power banks.',
        'Display bright cloths or mirror reflections if stranded on rooftops.',
      ],
      helplinePhone: '1078 / 112',
    }
  },
  hi: {
    FLOOD: {
      title: 'अति गंभीर बाढ़ चेतावनी एवं तत्काल निकासी सलाह',
      advisoryText: 'लगातार भारी बारिश के कारण नदी का जलस्तर खतरे के निशान से ऊपर पहुंच गया है। निचले इलाकों में बाढ़ का पानी भरने की संभावना है। कृपया तुरंत ऊंचे स्थानों या पक्के राहत शिविरों की ओर जाएं।',
      actionChecklist: [
        'घर छोड़ते समय बिजली का मुख्य स्विच और गैस सिलेंडर बंद करें।',
        'अपने साथ पीने का पानी, सूखा भोजन, टॉर्च और जरूरी दवाइयां रखें।',
        'बहते हुए बाढ़ के पानी में पैदल चलने या गाड़ी चलाने की कोशिश न करें।',
        'केवल एनडीआरएफ/एसडीआरएफ द्वारा निर्धारित सुरक्षित निकासी मार्गों का उपयोग करें।',
      ],
      helplinePhone: '1078 (राष्ट्रीय आपदा हेल्पलाइन) / 112',
    },
    CYCLONE: {
      title: 'गंभीर चक्रवात चेतावनी एवं तटीय सुरक्षा निर्देश',
      advisoryText: 'तटीय क्षेत्र की ओर 160 किमी/घंटा की गति से प्रचंड चक्रवाती तूफान बढ़ रहा है। 3 से 4 मीटर ऊंची समुद्री लहरें उठने की आशंका है। तटीय क्षेत्रों को तुरंत खाली करने के निर्देश दिए गए हैं।',
      actionChecklist: [
        'दरवाजे-खिड़कियां सुरक्षित बंद रखें और कांच पर टेप लगाएं।',
        'पक्के कंक्रीट चक्रवात आश्रयों में ही रहें, टिन शेड के नीचे न रहें।',
        'आधिकारिक मौसम विभाग के बुलेटिन सुनते रहें।',
        'मछुआरों को समुद्र में जाने की सख्त मनाही है।',
      ],
      helplinePhone: '1070 (राज्य आपातकालीन केंद्र) / 112',
    },
    WILDFIRE: {
      title: 'जंगल की आग (वनाग्नि) आपातकालीन चेतावनी',
      advisoryText: 'तेज हवा और सूखे मौसम के कारण जंगल की आग तेजी से बस्तियों की तरफ बढ़ रही है। 5 किमी के दायरे में रहने वाले ग्रामीण सुरक्षित स्थानों पर जाएं।',
      actionChecklist: [
        'धुएं से बचने के लिए गीले कपड़े या मास्क से मुंह और नाक ढकें।',
        'मकान के आसपास पानी छिड़कें ताकि चिंगारी से आग न लगे।',
        'पशुओं को खूंटे से खोल दें ताकि वे सुरक्षित भाग सकें।',
        'आग दिखने पर तुरंत वन विभाग नियंत्रण कक्ष को सूचित करें।',
      ],
      helplinePhone: '1926 (वन विभाग हेल्पलाइन)',
    },
    LANDSLIDE: {
      title: 'भूस्खलन का अत्यधिक खतरा - तत्काल निकासी सूचना',
      advisoryText: 'भारी बारिश के कारण पहाड़ी ढलानों की मिट्टी ढीली हो गई है। चट्टान गिरने और मलबे के बहाव का भारी खतरा है। ढलानों के किनारे रहने वाले तुरंत सुरक्षित स्थान पर जाएं।',
      actionChecklist: [
        'पहाड़ी ढलानों वाले मकान तुरंत खाली करें, रात का इंतजार न करें।',
        'पेड़ों के टूटने या जमीन में दरार पड़ने की आवाज पर तुरंत सतर्क हों।',
        'घाटी और मलबे वाली सड़कों पर यात्रा करने से बचें।',
        'मार्ग अवरुद्ध होने पर तुरंत जिला नियंत्रण कक्ष को बताएं।',
      ],
      helplinePhone: '1077 (जिला आपदा प्रबंधन प्राधिकरण)',
    },
    EARTHQUAKE: {
      title: 'भूकंप चेतावनी एवं सुरक्षा निर्देश',
      advisoryText: 'क्षेत्र में भूकंप के झटके महसूस किए गए हैं। तेज आफ्टरशॉक आने की संभावना है। इमारतों की जांच किए बिना अंदर न जाएं।',
      actionChecklist: [
        'झटके आने पर झुकें, ढकें और किसी मजबूत मेज के नीचे पकड़कर रहें (Drop, Cover, Hold)।',
        'बिजली के खंभों, खिड़कियों और कच्ची दीवारों से दूर रहें।',
        'इमारत से बाहर निकलते समय लिफ्ट का प्रयोग न करें, सीढ़ियों का उपयोग करें।',
      ],
      helplinePhone: '112 (राष्ट्रीय आपातकालीन नंबर)',
    },
    DROUGHT: {
      title: 'सूखा एवं जल संरक्षण निर्देश',
      advisoryText: 'मिट्टी में नमी की भारी कमी के कारण कृषि क्षेत्र में संकट की स्थिति है। जल संरक्षण एवं पशु चारा वितरण केंद्र सक्रिय किए गए हैं।',
      actionChecklist: [
        'फसल सिंचाई में ड्रिप और सूक्ष्म सिंचाई प्रणाली अपनाएं।',
        'पीने के पानी का विवेकपूर्ण उपयोग करें।',
        'ब्लॉक स्तर पर सरकारी चारा व राहत केंद्रों से संपर्क करें।',
      ],
      helplinePhone: '1800-180-1551 (किसान कॉल सेंटर)',
    },
    COMPOUND: {
      title: 'संयुक्त बहु-आपदा आपातकालीन चेतावनी',
      advisoryText: 'चक्रवात, भारी बाढ़ और भूस्खलन का एक साथ प्रकोप। नागरिक सेना और एनडीआरएफ के निर्देशों का पालन करें।',
      actionChecklist: [
        'बचाव दल के निर्देशों का पूर्णतः पालन करें।',
        'मोबाइल और आवश्यक उपकरणों को चार्ज रखें।',
      ],
      helplinePhone: '1078 / 112',
    }
  },
  bn: {
    FLOOD: {
      title: 'মারাত্মক বন্যা সতর্কতা ও জরুরি স্থানান্তর নির্দেশিকা',
      advisoryText: 'টানা ভারী বৃষ্টিপাতের কারণে নদীর জল বিপদসীমা অতিক্রম করেছে। নিচু এলাকাগুলো অবিলম্বে প্লাবিত হতে পারে। অবিলম্বে নিকটস্থ পাকা আশ্রয়কেন্দ্রে চলে যান।',
      actionChecklist: [
        'বাড়ি ছাড়ার আগে বিদ্যুতের মেইন সুইচ এবং রান্নার গ্যাস সিলিন্ডার বন্ধ করুন।',
        'সঙ্গে রাখুন পানীয় জল, শুকনো খাবার, টর্চ এবং প্রয়োজনীয় ওষুধপত্র।',
        'বন্যার জলের মধ্যে দিয়ে হাঁটা বা গাড়ি চালানোর চেষ্টা করবেন না।',
        'এনডিআরএফ নির্ধারিত নিরাপদ রাস্তা ব্যবহার করুন।',
      ],
      helplinePhone: '1078 / 112',
    },
    CYCLONE: {
      title: 'ঘূর্ণিঝড় সতর্কতা ও উপকূলবর্তী নির্দেশিকা',
      advisoryText: 'উপকূলের দিকে ধেয়ে আসছে অতি তীব্র ঘূর্ণিঝড়। বাতাসের গতিবেগ ঘণ্টায় ১৬০ কিমি পর্যন্ত পৌঁছাতে পারে। উপকূলবর্তী এলাকা খালি করার নির্দেশ জারি করা হয়েছে।',
      actionChecklist: [
        'দরজা-জানালা শক্ত করে বন্ধ রাখুন।',
        'পাকা সাইক্লোন সেন্টারে অবস্থান করুন।',
        'মৎস্যজীবীদের সমুদ্রে যেতে সম্পূর্ণ নিষেধ করা হচ্ছে।',
      ],
      helplinePhone: '1070 / 112',
    },
    WILDFIRE: {
      title: 'দাবানল জরুরি সতর্কতা',
      advisoryText: 'বনাঞ্চলে ভয়াবহ দাবানল ছড়িয়ে পড়েছে। সংলগ্ন এলাকার বাসিন্দারা নিরাপদ দূরত্বে সরে যান।',
      actionChecklist: [
        'ধোঁয়া থেকে বাঁচতে ভেজা কাপড় বা মাস্ক দিয়ে মুখ ঢাকুন।',
        'বন বিভাগের জরুরি নম্বরে যোগাযোগ করুন।',
      ],
      helplinePhone: '1926',
    },
    LANDSLIDE: {
      title: 'ভূমিধস সতর্কতা ও পাহাড় সংলগ্ন এলাকা খালি করার নির্দেশ',
      advisoryText: 'অতিবৃষ্টির কারণে পাহাড়ের ঢালে মারাত্মক ভূমিধসের আশঙ্কা দেখা দিয়েছে। পাহাড়ি বাড়িঘর অবিলম্বে খালি করুন।',
      actionChecklist: [
        'ধসপ্রবণ পাহাড়ি রাস্তা এড়িয়ে চলুন।',
        'বিপদের লক্ষণ দেখলেই নিরাপদ শিবিরে যান।',
      ],
      helplinePhone: '1077 / 112',
    },
    EARTHQUAKE: {
      title: 'ভূমিকম্প সতর্কতা ও আফটারশক নির্দেশিকা',
      advisoryText: 'অঞ্চলে ভূমিকম্প অনুভূত হয়েছে। সম্ভাব্য আফটারশকের জন্য প্রস্তুত থাকুন এবং খোলা মাঠে অবস্থান করুন।',
      actionChecklist: [
        'ড্রপ, কভার এবং শক্ত টেবিল ধরে থাকুন।',
        'লিফট ব্যবহার করবেন না, সিঁড়ি দিয়ে নামুন।',
      ],
      helplinePhone: '112',
    },
    DROUGHT: {
      title: 'খরা ও জল সংরক্ষণ নির্দেশিকা',
      advisoryText: 'তীব্র জলসংকট মোকাবেলায় জল সংরক্ষণের ব্যবস্থা নিন।',
      actionChecklist: ['কৃষিতে বিন্দু সেচ পদ্ধতি ব্যবহার করুন।'],
      helplinePhone: '1800-180-1551',
    },
    COMPOUND: {
      title: 'সম্মিলিত বহু-বিপর্যয় জরুরি সতর্কতা',
      advisoryText: 'প্রাকৃতিক বিপর্যয়ের কারণে সর্বোচ্চ সতর্কতা জারি করা হয়েছে। উদ্ধারকারী দলের নির্দেশ মেনে চলুন।',
      actionChecklist: ['উদ্ধারকারী দলের সাথে সম্পূর্ণ সহযোগিতা করুন।'],
      helplinePhone: '1078 / 112',
    }
  },
  ta: {
    FLOOD: {
      title: 'வெள்ள அபாய எச்சரிக்கை மற்றும் வெளியேற்ற அறிவுரை',
      advisoryText: 'தொடர் கனமழை காரணமாக ஆற்று நீர் அபாய அளவை தாண்டியுள்ளது. தாழ்வான பகுதிகளில் உள்ள மக்கள் உடனடியாக பாதுகாப்பான நிவாரண முகாம்களுக்கு செல்லவும்.',
      actionChecklist: [
        'வீட்டை விட்டு வெளியேறும் முன் மின்சாரம் மற்றும் எரிவாயு இணைப்புகளை அணைக்கவும்.',
        'குடிநீர், உலர் உணவு, டார்ச் மற்றும் மருந்துகளை எடுத்துச் செல்லவும்.',
        'வெள்ள நீரில் நடக்கவோ அல்லது வாகனம் ஓட்டவோ முயற்சிக்காதீர்கள்.',
      ],
      helplinePhone: '1078 / 112',
    },
    CYCLONE: {
      title: 'தீவிர புயல் எச்சரிக்கை மற்றும் கரையோர வழிகாட்டுதல்',
      advisoryText: '160 கி.மீ வேகத்தில் புயல் கரையை கடக்க உள்ளதால் மக்கள் பாதுகாப்பான கான்கிரீட் புயல் மையங்களில் தங்குமாறு அறிவுறுத்தப்படுகிறார்கள்.',
      actionChecklist: [
        'கதவு மற்றும் ஜன்னல்களை பாதுகாப்பாக மூடவும்.',
        'மீனவர்கள் எக்காரணம் கொண்டும் கடலுக்குச் செல்ல வேண்டாம்.',
      ],
      helplinePhone: '1070 / 112',
    },
    WILDFIRE: {
      title: 'காட்டுத்தீ அவசர எச்சரிக்கை',
      advisoryText: 'காட்டுத்தீ வேகமாக பரவி வருவதால் அருகில் உள்ள மக்கள் 5 கி.மீ சுற்றளவை விட்டு வெளியேறவும்.',
      actionChecklist: ['புகையிலிருந்து தப்பிக்க ஈரமான துணியால் முகத்தை மூடவும்.'],
      helplinePhone: '1926',
    },
    LANDSLIDE: {
      title: 'நிலச்சரிவு அபாய எச்சரிக்கை',
      advisoryText: 'கனமழையால் மலைச்சரிவுகளில் நிலச்சரிவு ஏற்படும் அபாயம் உள்ளது. மலைப்பகுதி மக்கள் உடனடியாக பாதுகாப்பான இடங்களுக்கு செல்லவும்.',
      actionChecklist: ['மலைப்பாதை பயணங்களை தவிர்க்கவும்.'],
      helplinePhone: '1077 / 112',
    },
    EARTHQUAKE: {
      title: 'நிலநடுக்க பாதுகாப்பு வழிகாட்டுதல்',
      advisoryText: 'நிலநடுக்க அதிர்வுகள் உணரப்பட்டுள்ளன. உறுதியான மேசையின் கீழ் சென்று தங்களை பாதுகாத்துக்கொள்ளவும்.',
      actionChecklist: ['மின்தூக்கியை (Lift) பயன்படுத்தாமல் படிக்கட்டுகளை பயன்படுத்தவும்.'],
      helplinePhone: '112',
    },
    DROUGHT: {
      title: 'வறட்சி மற்றும் நீர் மேலாண்மை வழிகாட்டுதல்',
      advisoryText: 'நீர் ஆதாரங்களை சிக்கனமாக பயன்படுத்த அரசு அறிவுறுத்துகிறது.',
      actionChecklist: ['சொட்டு நீர் பாசன முறையை பயன்படுத்தவும்.'],
      helplinePhone: '1800-180-1551',
    },
    COMPOUND: {
      title: 'கூட்டு அவசரகால பேரழிவு எச்சரிக்கை',
      advisoryText: 'மீட்புப் படையினரின் வழிகாட்டுதல்களை முழுமையாக பின்பற்றவும்.',
      actionChecklist: ['அவசர கால எண்களை தொடர்புகொள்ளவும்.'],
      helplinePhone: '1078 / 112',
    }
  },
  te: {
    FLOOD: {
      title: 'తీవ్ర వరద హెచ్చరిక మరియు పునరావాస సూచనలు',
      advisoryText: 'భారీ వర్షాల కారణంగా నదులు ప్రమాదకర స్థాయిని దాటాయి. లోతట్టు ప్రాంతాల ప్రజలు వెంటనే సురక్షిత పునరావాస కేంద్రాలకు వెళ్లాలి.',
      actionChecklist: [
        'ఇంటిని ఖాళీ చేసే ముందు విద్యుత్ మరియు గ్యాస్ కనెక్షన్లను ఆపివేయండి.',
        'త్రాగునీరు, డ్రై ఫుడ్, టార్చ్ మరియు అవసరమైన మందులను తీసుకెళ్లండి.',
        'వరద నీటిలో ప్రయాణించవద్దు.',
      ],
      helplinePhone: '1078 / 112',
    },
    CYCLONE: {
      title: 'తీవ్ర తుఫాను హెచ్చరిక - తీరప్రాంత రక్షణ సూచనలు',
      advisoryText: 'గంటకు 160 కి.మీ వేగంతో పెను తుఫాను తీరం దాటబోతోంది. తీరప్రాంతాల ప్రజలు వెంటనే తుఫాను సహాయక కేంద్రాలకు తరలివెళ్లాలి.',
      actionChecklist: [
        'మత్స్యకారులు వేటకు వెళ్లరాదు.',
        'భవనాల లోపలే సురక్షితంగా ఉండండి.',
      ],
      helplinePhone: '1070 / 112',
    },
    WILDFIRE: {
      title: 'అడవి మంటల అత్యవసర హెచ్చరిక',
      advisoryText: 'అటవీ ప్రాంతంలో మంటలు వ్యాపిస్తున్నాయి. సమీప గ్రామస్తులు అప్రమత్తంగా ఉండాలి.',
      actionChecklist: ['పొగ నుండి రక్షణకు తడి గుడ్డను ధరించండి.'],
      helplinePhone: '1926',
    },
    LANDSLIDE: {
      title: 'కొండచరియలు విరిగిపడే ప్రమాద హెచ్చరిక',
      advisoryText: 'ఎడతెరిపిలేని వర్షాల వల్ల కొండచరియలు విరిగిపడే అవకాశం ఉంది. కొండవాలు ప్రాంతాల ప్రజలు సురక్షిత ప్రాంతాలకు వెళ్లాలి.',
      actionChecklist: ['ఘాట్ రోడ్డు ప్రయాణాలు నిలిపివేయండి.'],
      helplinePhone: '1077 / 112',
    },
    EARTHQUAKE: {
      title: 'భూకంప భద్రతా మార్గదర్శకాలు',
      advisoryText: 'భూ ప్రకంపనలు సంభవించాయి. బలమైన వస్తువుల కింద తలదాచుకోండి.',
      actionChecklist: ['లిఫ్టులను ఉపయోగించవద్దు.'],
      helplinePhone: '112',
    },
    DROUGHT: {
      title: 'కరువు మరియు నీటి సంరక్షణ సూచనలు',
      advisoryText: 'తాగునీటిని పొదుపుగా వాడుకోండి.',
      actionChecklist: ['సూక్ష్మ సేద్యం విధానాలను అనుసరించండి.'],
      helplinePhone: '1800-180-1551',
    },
    COMPOUND: {
      title: 'బహుళ విపత్తు అత్యవసర హెచ్చరిక',
      advisoryText: 'ఎన్డీఆర్ఎఫ్ అధికారుల సూచనలను పాటించండి.',
      actionChecklist: ['అధికారిక హెల్ప్‌లైన్ నంబర్లను సంప్రదించండి.'],
      helplinePhone: '1078 / 112',
    }
  }
};

export function getEmergencyAdvisory(lang: string, category: DisasterCategory): EmergencyBroadcastContent {
  const langKey = EMERGENCY_TRANSLATIONS[lang] ? lang : 'en';
  const categoryKey = EMERGENCY_TRANSLATIONS[langKey][category] ? category : 'FLOOD';
  return EMERGENCY_TRANSLATIONS[langKey][categoryKey];
}
