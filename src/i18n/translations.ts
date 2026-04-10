export type Language = "en" | "hi" | "bn" | "ta" | "te" | "mr";

export type TranslationKey =
  | "common.back"
  | "common.profile"
  | "common.logout"
  | "common.phone"
  | "common.notAvailable"
  | "common.language"
  | "common.english"
  | "common.hindi"
  | "common.bengali"
  | "common.tamil"
  | "common.telugu"
  | "common.marathi"
  | "auth.invalidNumberTitle"
  | "auth.invalidNumberMessage"
  | "auth.errorTitle"
  | "auth.invalidOtpTitle"
  | "auth.invalidOtpMessage"
  | "auth.unregisteredMessage"
  | "auth.blockedTitle"
  | "auth.blockedMessage"
  | "auth.invalidAccountState"
  | "auth.phoneSubtitle"
  | "auth.codeLabel"
  | "auth.phoneNumberLabel"
  | "auth.phonePlaceholder"
  | "auth.sendCode"
  | "auth.sending"
  | "auth.verifyTitle"
  | "auth.verifySubtitle"
  | "auth.verifyButton"
  | "profile.earningsTitle"
  | "profile.earningsSubtitle"
  | "profile.historyTitle"
  | "profile.historySubtitle"
  | "profile.coursesTitle"
  | "profile.coursesSubtitle"
  | "profile.heroSubtitle"
  | "profile.workspace"
  | "home.goodMorning"
  | "home.workerFallback"
  | "home.servicePartner"
  | "home.todaysEarnings"
  | "home.onDuty"
  | "home.offline"
  | "home.acceptingTasks"
  | "home.notAcceptingJobs"
  | "jobs.waitingTitle"
  | "jobs.waitingSubtitle"
  | "jobs.acceptNow"
  | "jobs.acceptJob";

export const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    "common.back": "Back",
    "common.profile": "Profile",
    "common.logout": "Logout",
    "common.phone": "Phone",
    "common.notAvailable": "Not available",
    "common.language": "Language",
    "common.english": "English",
    "common.hindi": "Hindi",
    "common.bengali": "Bengali",
    "common.tamil": "Tamil",
    "common.telugu": "Telugu",
    "common.marathi": "Marathi",
    "auth.invalidNumberTitle": "Invalid number",
    "auth.invalidNumberMessage": "Enter a valid 10-digit phone number",
    "auth.errorTitle": "Error",
    "auth.invalidOtpTitle": "Invalid OTP",
    "auth.invalidOtpMessage": "Enter the 6-digit OTP",
    "auth.unregisteredMessage": "You are not registered",
    "auth.blockedTitle": "Blocked",
    "auth.blockedMessage": "Please contact admin",
    "auth.invalidAccountState": "Invalid account state",
    "auth.phoneSubtitle":
      "Enter your phone number to receive a verification code.",
    "auth.codeLabel": "Code",
    "auth.phoneNumberLabel": "Phone Number",
    "auth.phonePlaceholder": "Enter phone number",
    "auth.sendCode": "Send Code",
    "auth.sending": "Sending...",
    "auth.verifyTitle": "Verify",
    "auth.verifySubtitle": "We sent a 6-digit code to your mobile device.",
    "auth.verifyButton": "Verify",
    "profile.earningsTitle": "Earnings",
    "profile.earningsSubtitle":
      "Track payouts, balance, and completed work income.",
    "profile.historyTitle": "Job History",
    "profile.historySubtitle":
      "Look back at completed and cancelled service requests.",
    "profile.coursesTitle": "Courses",
    "profile.coursesSubtitle":
      "Keep building your skills and unlock more XP.",
    "profile.heroSubtitle":
      "Manage your account, earnings, and work tools from one place.",
    "profile.workspace": "Workspace",
    "home.goodMorning": "Good Morning",
    "home.workerFallback": "Worker",
    "home.servicePartner": "Service Partner",
    "home.todaysEarnings": "Today's Earnings",
    "home.onDuty": "On Duty",
    "home.offline": "Offline",
    "home.acceptingTasks": "Accepting new tasks",
    "home.notAcceptingJobs": "Not accepting jobs",
    "jobs.waitingTitle": "Waiting for nearby jobs",
    "jobs.waitingSubtitle":
      "Stay online. Jobs around your location will appear instantly.",
    "jobs.acceptNow": "Accept Now",
    "jobs.acceptJob": "Accept Job",
  },
  hi: {
    "common.back": "वापस",
    "common.profile": "प्रोफाइल",
    "common.logout": "लॉग आउट",
    "common.phone": "फोन",
    "common.notAvailable": "उपलब्ध नहीं",
    "common.language": "भाषा",
    "common.english": "अंग्रेज़ी",
    "common.hindi": "हिंदी",
    "common.bengali": "बंगाली",
    "common.tamil": "तमिल",
    "common.telugu": "तेलुगु",
    "common.marathi": "मराठी",
    "auth.invalidNumberTitle": "अमान्य नंबर",
    "auth.invalidNumberMessage": "कृपया सही 10 अंकों का फोन नंबर दर्ज करें",
    "auth.errorTitle": "त्रुटि",
    "auth.invalidOtpTitle": "अमान्य OTP",
    "auth.invalidOtpMessage": "कृपया 6 अंकों का OTP दर्ज करें",
    "auth.unregisteredMessage": "आप पंजीकृत नहीं हैं",
    "auth.blockedTitle": "ब्लॉक किया गया",
    "auth.blockedMessage": "कृपया एडमिन से संपर्क करें",
    "auth.invalidAccountState": "अमान्य खाता स्थिति",
    "auth.phoneSubtitle":
      "सत्यापन कोड पाने के लिए अपना फोन नंबर दर्ज करें।",
    "auth.codeLabel": "कोड",
    "auth.phoneNumberLabel": "फोन नंबर",
    "auth.phonePlaceholder": "फोन नंबर दर्ज करें",
    "auth.sendCode": "कोड भेजें",
    "auth.sending": "भेजा जा रहा है...",
    "auth.verifyTitle": "सत्यापित करें",
    "auth.verifySubtitle": "हमने आपके मोबाइल पर 6 अंकों का कोड भेजा है।",
    "auth.verifyButton": "सत्यापित करें",
    "profile.earningsTitle": "कमाई",
    "profile.earningsSubtitle":
      "भुगतान, बैलेंस और पूरे हुए काम की आय देखें।",
    "profile.historyTitle": "जॉब हिस्ट्री",
    "profile.historySubtitle":
      "पूरी और रद्द की गई सर्विस रिक्वेस्ट्स देखें।",
    "profile.coursesTitle": "कोर्स",
    "profile.coursesSubtitle":
      "अपनी स्किल बढ़ाइए और अधिक XP अनलॉक कीजिए।",
    "profile.heroSubtitle":
      "एक ही जगह से अपना खाता, कमाई और काम के टूल संभालें।",
    "profile.workspace": "वर्कस्पेस",
    "home.goodMorning": "सुप्रभात",
    "home.workerFallback": "वर्कर",
    "home.servicePartner": "सर्विस पार्टनर",
    "home.todaysEarnings": "आज की कमाई",
    "home.onDuty": "ड्यूटी पर",
    "home.offline": "ऑफलाइन",
    "home.acceptingTasks": "नए काम स्वीकार किए जा रहे हैं",
    "home.notAcceptingJobs": "अभी काम स्वीकार नहीं किए जा रहे",
    "jobs.waitingTitle": "पास के जॉब का इंतजार है",
    "jobs.waitingSubtitle":
      "ऑनलाइन रहें। आपके आसपास के जॉब तुरंत दिखाई देंगे।",
    "jobs.acceptNow": "अभी स्वीकार करें",
    "jobs.acceptJob": "जॉब स्वीकार करें",
  },
  bn: {
    "common.back": "ফিরে যান",
    "common.profile": "প্রোফাইল",
    "common.logout": "লগ আউট",
    "common.phone": "ফোন",
    "common.notAvailable": "উপলব্ধ নয়",
    "common.language": "ভাষা",
    "common.english": "ইংরেজি",
    "common.hindi": "হিন্দি",
    "common.bengali": "বাংলা",
    "common.tamil": "তামিল",
    "common.telugu": "তেলুগু",
    "common.marathi": "মারাঠি",
    "auth.invalidNumberTitle": "অবৈধ নম্বর",
    "auth.invalidNumberMessage": "সঠিক ১০ সংখ্যার ফোন নম্বর লিখুন",
    "auth.errorTitle": "ত্রুটি",
    "auth.invalidOtpTitle": "অবৈধ OTP",
    "auth.invalidOtpMessage": "৬ সংখ্যার OTP লিখুন",
    "auth.unregisteredMessage": "আপনি নিবন্ধিত নন",
    "auth.blockedTitle": "ব্লক করা হয়েছে",
    "auth.blockedMessage": "অনুগ্রহ করে অ্যাডমিনের সাথে যোগাযোগ করুন",
    "auth.invalidAccountState": "অবৈধ অ্যাকাউন্ট অবস্থা",
    "auth.phoneSubtitle":
      "যাচাইকরণ কোড পেতে আপনার ফোন নম্বর লিখুন।",
    "auth.codeLabel": "কোড",
    "auth.phoneNumberLabel": "ফোন নম্বর",
    "auth.phonePlaceholder": "ফোন নম্বর লিখুন",
    "auth.sendCode": "কোড পাঠান",
    "auth.sending": "পাঠানো হচ্ছে...",
    "auth.verifyTitle": "যাচাই করুন",
    "auth.verifySubtitle": "আমরা আপনার মোবাইলে ৬ সংখ্যার কোড পাঠিয়েছি।",
    "auth.verifyButton": "যাচাই করুন",
    "profile.earningsTitle": "আয়",
    "profile.earningsSubtitle":
      "পেআউট, ব্যালেন্স এবং সম্পন্ন কাজের আয় দেখুন।",
    "profile.historyTitle": "জব হিস্ট্রি",
    "profile.historySubtitle":
      "সম্পন্ন ও বাতিল হওয়া সার্ভিস রিকোয়েস্ট দেখুন।",
    "profile.coursesTitle": "কোর্স",
    "profile.coursesSubtitle":
      "নিজের স্কিল বাড়ান এবং আরও XP আনলক করুন।",
    "profile.heroSubtitle":
      "এক জায়গা থেকে আপনার অ্যাকাউন্ট, আয় এবং কাজের টুলস সামলান।",
    "profile.workspace": "ওয়ার্কস্পেস",
    "home.goodMorning": "সুপ্রভাত",
    "home.workerFallback": "ওয়ার্কার",
    "home.servicePartner": "সার্ভিস পার্টনার",
    "home.todaysEarnings": "আজকের আয়",
    "home.onDuty": "ডিউটিতে",
    "home.offline": "অফলাইন",
    "home.acceptingTasks": "নতুন কাজ গ্রহণ করা হচ্ছে",
    "home.notAcceptingJobs": "এখন কাজ নেওয়া হচ্ছে না",
    "jobs.waitingTitle": "কাছাকাছি জবের অপেক্ষায়",
    "jobs.waitingSubtitle":
      "অনলাইনে থাকুন। আপনার আশেপাশের জব সঙ্গে সঙ্গে দেখাবে।",
    "jobs.acceptNow": "এখনই গ্রহণ করুন",
    "jobs.acceptJob": "জব গ্রহণ করুন",
  },
  ta: {
    "common.back": "திரும்ப",
    "common.profile": "சுயவிவரம்",
    "common.logout": "வெளியேறு",
    "common.phone": "தொலைபேசி",
    "common.notAvailable": "கிடைக்கவில்லை",
    "common.language": "மொழி",
    "common.english": "ஆங்கிலம்",
    "common.hindi": "ஹிந்தி",
    "common.bengali": "பெங்காலி",
    "common.tamil": "தமிழ்",
    "common.telugu": "தெலுங்கு",
    "common.marathi": "மராத்தி",
    "auth.invalidNumberTitle": "தவறான எண்",
    "auth.invalidNumberMessage": "சரியான 10 இலக்க தொலைபேசி எண்ணை உள்ளிடுங்கள்",
    "auth.errorTitle": "பிழை",
    "auth.invalidOtpTitle": "தவறான OTP",
    "auth.invalidOtpMessage": "6 இலக்க OTP ஐ உள்ளிடுங்கள்",
    "auth.unregisteredMessage": "நீங்கள் பதிவு செய்யப்படவில்லை",
    "auth.blockedTitle": "தடை செய்யப்பட்டது",
    "auth.blockedMessage": "தயவுசெய்து நிர்வாகியை தொடர்பு கொள்ளுங்கள்",
    "auth.invalidAccountState": "தவறான கணக்கு நிலை",
    "auth.phoneSubtitle":
      "சரிபார்ப்பு குறியீட்டை பெற உங்கள் தொலைபேசி எண்ணை உள்ளிடுங்கள்.",
    "auth.codeLabel": "குறியீடு",
    "auth.phoneNumberLabel": "தொலைபேசி எண்",
    "auth.phonePlaceholder": "தொலைபேசி எண்ணை உள்ளிடுங்கள்",
    "auth.sendCode": "குறியீட்டை அனுப்பு",
    "auth.sending": "அனுப்பப்படுகிறது...",
    "auth.verifyTitle": "சரிபார்",
    "auth.verifySubtitle": "உங்கள் மொபைலுக்கு 6 இலக்க குறியீட்டை அனுப்பியுள்ளோம்.",
    "auth.verifyButton": "சரிபார்",
    "profile.earningsTitle": "வருமானம்",
    "profile.earningsSubtitle":
      "பேஅவுட், இருப்பு மற்றும் முடித்த வேலை வருமானத்தைப் பாருங்கள்.",
    "profile.historyTitle": "வேலை வரலாறு",
    "profile.historySubtitle":
      "முடிந்த மற்றும் ரத்து செய்யப்பட்ட சேவை கோரிக்கைகளைப் பாருங்கள்.",
    "profile.coursesTitle": "பாடங்கள்",
    "profile.coursesSubtitle":
      "உங்கள் திறன்களை வளர்த்து மேலும் XP பெறுங்கள்.",
    "profile.heroSubtitle":
      "ஒரே இடத்தில் உங்கள் கணக்கு, வருமானம் மற்றும் வேலை கருவிகளை நிர்வகிக்கவும்.",
    "profile.workspace": "பணிமிடம்",
    "home.goodMorning": "காலை வணக்கம்",
    "home.workerFallback": "பணியாளர்",
    "home.servicePartner": "சேவை கூட்டாளர்",
    "home.todaysEarnings": "இன்றைய வருமானம்",
    "home.onDuty": "பணியில்",
    "home.offline": "ஆஃப்லைன்",
    "home.acceptingTasks": "புதிய பணிகள் ஏற்கப்படுகின்றன",
    "home.notAcceptingJobs": "இப்போது வேலைகள் ஏற்கப்படவில்லை",
    "jobs.waitingTitle": "அருகிலுள்ள வேலைகளை காத்திருக்கிறது",
    "jobs.waitingSubtitle":
      "ஆன்லைனில் இருங்கள். உங்கள் இடத்தைச் சுற்றிய வேலைகள் உடனே தோன்றும்.",
    "jobs.acceptNow": "இப்போது ஏற்கவும்",
    "jobs.acceptJob": "வேலையை ஏற்கவும்",
  },
  te: {
    "common.back": "వెనుకకు",
    "common.profile": "ప్రొఫైల్",
    "common.logout": "లాగ్ అవుట్",
    "common.phone": "ఫోన్",
    "common.notAvailable": "అందుబాటులో లేదు",
    "common.language": "భాష",
    "common.english": "ఇంగ్లీష్",
    "common.hindi": "హిందీ",
    "common.bengali": "బెంగాలీ",
    "common.tamil": "తమిళం",
    "common.telugu": "తెలుగు",
    "common.marathi": "మరాఠీ",
    "auth.invalidNumberTitle": "చెల్లని నంబర్",
    "auth.invalidNumberMessage": "సరైన 10 అంకెల ఫోన్ నంబర్ నమోదు చేయండి",
    "auth.errorTitle": "లోపం",
    "auth.invalidOtpTitle": "చెల్లని OTP",
    "auth.invalidOtpMessage": "6 అంకెల OTP నమోదు చేయండి",
    "auth.unregisteredMessage": "మీరు నమోదు కాలేదు",
    "auth.blockedTitle": "బ్లాక్ చేయబడింది",
    "auth.blockedMessage": "దయచేసి అడ్మిన్‌ను సంప్రదించండి",
    "auth.invalidAccountState": "చెల్లని ఖాతా స్థితి",
    "auth.phoneSubtitle":
      "ధృవీకరణ కోడ్ పొందడానికి మీ ఫోన్ నంబర్ నమోదు చేయండి.",
    "auth.codeLabel": "కోడ్",
    "auth.phoneNumberLabel": "ఫోన్ నంబర్",
    "auth.phonePlaceholder": "ఫోన్ నంబర్ నమోదు చేయండి",
    "auth.sendCode": "కోడ్ పంపండి",
    "auth.sending": "పంపిస్తోంది...",
    "auth.verifyTitle": "ధృవీకరించండి",
    "auth.verifySubtitle": "మీ మొబైల్‌కు 6 అంకెల కోడ్ పంపించాం.",
    "auth.verifyButton": "ధృవీకరించండి",
    "profile.earningsTitle": "ఆదాయం",
    "profile.earningsSubtitle":
      "పేఅవుట్లు, బ్యాలెన్స్ మరియు పూర్తి చేసిన పనుల ఆదాయం చూడండి.",
    "profile.historyTitle": "జాబ్ చరిత్ర",
    "profile.historySubtitle":
      "పూర్తైన మరియు రద్దు చేసిన సర్వీస్ రిక్వెస్టులను చూడండి.",
    "profile.coursesTitle": "కోర్సులు",
    "profile.coursesSubtitle":
      "మీ నైపుణ్యాలను పెంచుకుని మరిన్ని XP అన్లాక్ చేయండి.",
    "profile.heroSubtitle":
      "ఒకే చోట మీ ఖాతా, ఆదాయం మరియు పని సాధనాలను నిర్వహించండి.",
    "profile.workspace": "వర్క్‌స్పేస్",
    "home.goodMorning": "శుభోదయం",
    "home.workerFallback": "వర్కర్",
    "home.servicePartner": "సర్వీస్ పార్ట్నర్",
    "home.todaysEarnings": "ఈ రోజు ఆదాయం",
    "home.onDuty": "డ్యూటీలో",
    "home.offline": "ఆఫ్‌లైన్",
    "home.acceptingTasks": "కొత్త పనులు స్వీకరిస్తున్నారు",
    "home.notAcceptingJobs": "ప్రస్తుతం పనులు స్వీకరించడం లేదు",
    "jobs.waitingTitle": "సమీప జాబ్‌ల కోసం వేచి ఉంది",
    "jobs.waitingSubtitle":
      "ఆన్‌లైన్‌లో ఉండండి. మీ దగ్గర్లోని జాబ్‌లు వెంటనే కనిపిస్తాయి.",
    "jobs.acceptNow": "ఇప్పుడే అంగీకరించండి",
    "jobs.acceptJob": "జాబ్ అంగీకరించండి",
  },
  mr: {
    "common.back": "मागे",
    "common.profile": "प्रोफाइल",
    "common.logout": "लॉग आउट",
    "common.phone": "फोन",
    "common.notAvailable": "उपलब्ध नाही",
    "common.language": "भाषा",
    "common.english": "इंग्रजी",
    "common.hindi": "हिंदी",
    "common.bengali": "बंगाली",
    "common.tamil": "तमिळ",
    "common.telugu": "तेलुगू",
    "common.marathi": "मराठी",
    "auth.invalidNumberTitle": "अवैध नंबर",
    "auth.invalidNumberMessage": "योग्य 10 अंकी फोन नंबर टाका",
    "auth.errorTitle": "त्रुटी",
    "auth.invalidOtpTitle": "अवैध OTP",
    "auth.invalidOtpMessage": "6 अंकी OTP टाका",
    "auth.unregisteredMessage": "आपण नोंदणीकृत नाही",
    "auth.blockedTitle": "ब्लॉक केले आहे",
    "auth.blockedMessage": "कृपया अॅडमिनशी संपर्क करा",
    "auth.invalidAccountState": "अवैध खाते स्थिती",
    "auth.phoneSubtitle":
      "पडताळणी कोड मिळवण्यासाठी तुमचा फोन नंबर टाका.",
    "auth.codeLabel": "कोड",
    "auth.phoneNumberLabel": "फोन नंबर",
    "auth.phonePlaceholder": "फोन नंबर टाका",
    "auth.sendCode": "कोड पाठवा",
    "auth.sending": "पाठवले जात आहे...",
    "auth.verifyTitle": "पडताळा",
    "auth.verifySubtitle": "आम्ही तुमच्या मोबाईलवर 6 अंकी कोड पाठवला आहे.",
    "auth.verifyButton": "पडताळा",
    "profile.earningsTitle": "कमाई",
    "profile.earningsSubtitle":
      "पेआउट, बॅलन्स आणि पूर्ण कामाची कमाई पाहा.",
    "profile.historyTitle": "जॉब हिस्ट्री",
    "profile.historySubtitle":
      "पूर्ण आणि रद्द झालेल्या सर्व्हिस रिक्वेस्ट्स पाहा.",
    "profile.coursesTitle": "कोर्सेस",
    "profile.coursesSubtitle":
      "आपली स्किल वाढवा आणि अधिक XP अनलॉक करा.",
    "profile.heroSubtitle":
      "एकाच ठिकाणी तुमचे खाते, कमाई आणि कामाची साधने व्यवस्थापित करा.",
    "profile.workspace": "वर्कस्पेस",
    "home.goodMorning": "शुभ प्रभात",
    "home.workerFallback": "वर्कर",
    "home.servicePartner": "सर्व्हिस पार्टनर",
    "home.todaysEarnings": "आजची कमाई",
    "home.onDuty": "ड्युटीवर",
    "home.offline": "ऑफलाइन",
    "home.acceptingTasks": "नवीन कामे स्वीकारली जात आहेत",
    "home.notAcceptingJobs": "सध्या कामे स्वीकारली जात नाहीत",
    "jobs.waitingTitle": "जवळच्या जॉबची वाट पाहत आहे",
    "jobs.waitingSubtitle":
      "ऑनलाइन रहा. तुमच्या आसपासचे जॉब लगेच दिसतील.",
    "jobs.acceptNow": "आत्ताच स्वीकारा",
    "jobs.acceptJob": "जॉब स्वीकारा",
  },
};
