'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {  
  Clock,  
  Camera,  
  Laptop,  
  Award,  
  Play,  
  Pause,
  RotateCcw,  
  CheckCircle2,  
  Sparkles,  
  ChevronRight,  
  XCircle,
  Video,
  X,
  ArrowRight,
  UserCheck,
  Check,
  TrendingUp,
  ShieldCheck,
  BarChart3
} from 'lucide-react';

// OFFICIAL 5 ACADEMIC TIERS
const CLASS_OPTIONS = [
  { id: 'CLASS_3_5', name: 'Classes 3 to 5 (Foundation Stage)', group: 'Group A' },
  { id: 'CLASS_6_8', name: 'Classes 6 to 8 (Foundation Plus)', group: 'Group B' },
  { id: 'CLASS_9_10', name: 'Classes 9 & 10 (Competitive Foundation)', group: 'Group C' },
  { id: 'CLASS_11_12', name: 'Classes 11 & 12 (Career Preparation)', group: 'Group D' },
  { id: 'COMPETITIVE', name: 'Competitive 12th & Above (Govt & Professional)', group: 'Group E' },
];

// TAILORED MULTILINGUAL QUESTION BANKS MATCHING OFFICIAL SYLLABUS
const QUESTION_BANKS = {
  CLASS_3_5: [
    {  
      id: 1,  
      question: { en: "Mathematics: What is 15 multiplied by 8?", hi: "गणित: 15 को 8 से गुणा करने पर क्या मिलता है?", mr: "गणित: 15 ला 8 ने गुणले असता उत्तर काय येते?" },  
      options: { en: ["100", "120", "130", "140"], hi: ["100", "120", "130", "140"], mr: ["100", "120", "130", "140"] },  
      correct: 1,  
      explanation: { en: "15 x 8 = 120.", hi: "15 x 8 = 120.", mr: "15 x 8 = 120." }  
    },
    {  
      id: 2,  
      question: { en: "Science: Which gas do plants absorb during photosynthesis?", hi: "विज्ञान: प्रकाश संश्लेषण के दौरान पौधे कौन सी गैस अवशोषित करते हैं?", mr: "विज्ञान: प्रकाशसंश्लेषणादरम्यान वनस्पती कोणती वायू शोषून घेतात?" },  
      options: { en: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], hi: ["ऑक्सीजन", "नाइट्रोजन", "कार्बन डाइऑक्साइड", "हाइड्रोजन"], mr: ["ऑक्सिजन", "नायट्रोजन", "कार्बन डायऑक्साइड", "हायड्रोजन"] },  
      correct: 2,  
      explanation: { en: "Plants absorb Carbon Dioxide to produce food.", hi: "पौधे भोजन बनाने के लिए कार्बन डाइऑक्साइड अवशोषित करते हैं.", mr: "वनस्पती अन्न तयार करण्यासाठी कार्बन डायऑक्साइड शोषून घेतात." }  
    },
    { id: 3, question: { en: "English: Choose the correct spelling:", hi: "अंग्रेजी: सही वर्तनी चुनें:", mr: "इंग्रजी: योग्य स्पेलिंग निवडा:" }, options: { en: ["Beautifull", "Beautiful", "Beautifil", "Beutiful"], hi: ["Beautifull", "Beautiful", "Beautifil", "Beutiful"], mr: ["Beautifull", "Beautiful", "Beautifil", "Beutiful"] }, correct: 1, explanation: { en: "The correct spelling is B-E-A-U-T-I-F-U-L.", hi: "सही वर्तनी B-E-A-U-T-I-F-U-L है.", mr: "योग्य स्पेलिंग B-E-A-U-T-I-F-U-L आहे." } },
    { id: 4, question: { en: "Mental Ability: Complete the pattern: 2, 4, 8, 16, __", hi: "मानसिक क्षमता: पैटर्न पूरा करें: 2, 4, 8, 16, __", mr: "मानसिक क्षमता: पॅटर्न पूर्ण करा: 2, 4, 8, 16, __" }, options: { en: ["20", "24", "32", "64"], hi: ["20", "24", "32", "64"], mr: ["20", "24", "32", "64"] }, correct: 2, explanation: { en: "Each number is doubled: 16 x 2 = 32.", hi: "प्रत्येक संख्या दोगुनी हो जाती है: 16 x 2 = 32.", mr: "प्रत्येक संख्या दुप्पट होते: 16 x 2 = 32." } },
    { id: 5, question: { en: "General Knowledge: Which is the largest animal on Earth?", hi: "सामान्य ज्ञान: पृथ्वी पर सबसे बड़ा जानवर कौन सा है?", mr: "सामान्य ज्ञान: पृथ्वीवरील सर्वात मोठा प्राणी कोणता आहे?" }, options: { en: ["Elephant", "Blue Whale", "Giraffe", "Shark"], hi: ["हाथी", "नीली व्हेल", "जिराफ", "शार्क"], mr: ["हत्ती", "ब्लू व्हेल", "जिराफ", "शार्क"] }, correct: 1, explanation: { en: "Blue Whale is the largest animal ever recorded.", hi: "नीली व्हेल अब तक का सबसे बड़ा ज्ञात जानवर है.", mr: "ब्लू व्हेल हा आजवरचा सर्वात मोठा प्राणी आहे." } },
    { id: 6, question: { en: "Marathi: 'सूर्य' या शब्दाचा समानार्थी शब्द कोणता?", hi: "मराठी: 'सूर्य' का पर्यायवाची शब्द क्या है?", mr: "मराठी: 'सूर्य' या शब्दाचा समानार्थी शब्द कोणता?" }, options: { en: ["चंद्र", "रवि", "मेघ", "पाणी"], hi: ["चंद्र", "रवि", "मेघ", "पानी"], mr: ["चंद्र", "रवि", "मेघ", "पाणी"] }, correct: 1, explanation: { en: "'रवि' is a synonym for Sun.", hi: "'रवि' सूर्य का पर्यायवाची है.", mr: "'रवि' हा सूर्याचा समानार्थी शब्द आहे." } },
    { id: 7, question: { en: "Logical Reasoning: How many days are there in a leap year?", hi: "तर्कशक्ति: लीप वर्ष में कितने दिन होते हैं?", mr: "तर्कशास्त्र: लीप वर्षात किती दिवस असतात?" }, options: { en: ["364", "365", "366", "367"], hi: ["364", "365", "366", "367"], mr: ["364", "365", "366", "367"] }, correct: 2, explanation: { en: "A leap year has 366 days.", hi: "लीप वर्ष में 366 दिन होते हैं.", mr: "लीप वर्षात 366 दिवस असतात." } },
    { id: 8, question: { en: "Mathematics: How many hours are in 2 days?", hi: "गणित: 2 दिनों में कितने घंटे होते हैं?", mr: "गणित: 2 दिवसांत किती तास असतात?" }, options: { en: ["24", "36", "48", "60"], hi: ["24", "36", "48", "60"], mr: ["24", "36", "48", "60"] }, correct: 2, explanation: { en: "24 hours x 2 = 48 hours.", hi: "24 घंटे x 2 = 48 घंटे.", mr: "24 तास x 2 = 48 तास." } },
    { id: 9, question: { en: "General Knowledge: National bird of India is:", hi: "सामान्य ज्ञान: भारत का राष्ट्रीय पक्षी है:", mr: "सामान्य ज्ञान: भारताचा राष्ट्रीय पक्षी कोणता:" }, options: { en: ["Sparrow", "Peacock", "Parrot", "Pigeon"], hi: ["गौरैया", "मोर", "तोता", "कबूतर"], mr: ["चिमणी", "मोर", "पोपट", "कबुतर"] }, correct: 1, explanation: { en: "Indian Peafowl (Peacock) is India's national bird.", hi: "मोर भारत का राष्ट्रीय पक्षी है.", mr: "मोर हा भारताचा राष्ट्रीय पक्षी आहे." } },
    { id: 10, question: { en: "Science: Which organ pumps blood in human body?", hi: "विज्ञान: मानव शरीर में कौन सा अंग रक्त पंप करता है?", mr: "विज्ञान: मानवी शरीरात कोणता अवयव रक्ताभिसरण पंप करतो?" }, options: { en: ["Lungs", "Heart", "Brain", "Kidney"], hi: ["फेफड़े", "हृदय", "मस्तिष्क", "गुर्दा"], mr: ["फुफ्फुस", "हृदय", "मेंदू", "मूत्रपिंड"] }, correct: 1, explanation: { en: "The heart pumps blood across the body.", hi: "हृदय पूरे शरीर में रक्त पंप करता है.", mr: "हृदय संपूर्ण शरीरात रक्त पंप करते." } }
  ],
  CLASS_6_8: [
    { id: 1, question: { en: "Mathematics: Simplify: (-12) + (-8) - (-10)", hi: "गणित: सरल करें: (-12) + (-8) - (-10)", mr: "गणित: सोपे करा: (-12) + (-8) - (-10)" }, options: { en: ["-10", "-30", "10", "0"], hi: ["-10", "-30", "10", "0"], mr: ["-10", "-30", "10", "0"] }, correct: 0, explanation: { en: "-12 - 8 + 10 = -10.", hi: "-12 - 8 + 10 = -10.", mr: "-12 - 8 + 10 = -10." } },
    { id: 2, question: { en: "Science: Which planet is known as the Red Planet?", hi: "विज्ञान: किस ग्रह को लाल ग्रह कहा जाता है?", mr: "विज्ञान: कोणत्या ग्रहाला लाल ग्रह म्हणून ओळखले जाते?" }, options: { en: ["Venus", "Mars", "Jupiter", "Saturn"], hi: ["शुक्र", "मंगल", "बृहस्पति", "शनि"], mr: ["शुक्र", "मंगळ", "गुरू", "शनी"] }, correct: 1, explanation: { en: "Mars is reddish due to iron oxide.", hi: "आयन ऑक्साइड के कारण मंगल लाल दिखता है.", mr: "आयन ऑक्साईडमुळे मंगळ लाल दिसतो." } },
    { id: 3, question: { en: "Basic Current Affairs: Who is the current ISRO Chairman (contextual baseline)?", hi: "करेंट अफेयर्स: वर्तमान इसरो अध्यक्ष कौन हैं?", mr: "चालू घडामोडी: वर्तमान ISRO अध्यक्ष कोण आहेत?" }, options: { en: ["Dr. S. Somanath", "K. Sivan", "A. P. J. Abdul Kalam", "Satish Dhawan"], hi: ["डॉ. एस. सोमनाथ", "के. सिवान", "ए. पी. जे. अब्दुल कलाम", "सतीश धवन"], mr: ["डॉ. एस. सोमनाथ", "के. सिवान", "ए. पी. जे. अब्दुल कलाम", "सतीश धवन"] }, correct: 0, explanation: { en: "Dr. S. Somanath leads ISRO.", hi: "डॉ. एस. सोमनाथ इसरो का नेतृत्व करते हैं.", mr: "डॉ. एस. सोमनाथ हे ISRO चे नेतृत्व करतात." } },
    { id: 4, question: { en: "Mathematics: What is the square root of 144?", hi: "गणित: 144 का वर्गमूल क्या है?", mr: "गणित: 144 चे वर्गमूळ किती आहे?" }, options: { en: ["11", "12", "14", "16"], hi: ["11", "12", "14", "16"], mr: ["11", "12", "14", "16"] }, correct: 1, explanation: { en: "12 x 12 = 144.", hi: "12 x 12 = 144.", mr: "12 x 12 = 144." } },
    { id: 5, question: { en: "Science: Which light color bends most through a prism?", hi: "विज्ञान: प्रिज्म से गुजरने पर कौन सा रंग सबसे अधिक झुकता है?", mr: "विज्ञान: प्रिझममधून जाताना कोणता रंगाचा प्रकाश सर्वात जास्त वाकतो?" }, options: { en: ["Red", "Yellow", "Violet", "Green"], hi: ["लाल", "पीला", "बैंगनी", "हरा"], mr: ["लाल", "पिवळा", "जांभळा", "हिरवा"] }, correct: 2, explanation: { en: "Violet bends the most due to shortest wavelength.", hi: "कम तरंगदैर्ध्य के कारण बैंगनी सबसे अधिक झुकता है.", mr: "कमी तरंग लांबीमुळे जांभळा प्रकाश सर्वात जास्त वाकतो." } },
    { id: 6, question: { en: "Logical Reasoning: Find missing number: 3, 6, 9, 12, __", hi: "तर्कशक्ति: लुप्त संख्या ज्ञात करें: 3, 6, 9, 12, __", mr: "तर्कशास्त्र: गाळलेली संख्या शोधा: 3, 6, 9, 12, __" }, options: { en: ["14", "15", "18", "20"], hi: ["14", "15", "18", "20"], mr: ["14", "15", "18", "20"] }, correct: 1, explanation: { en: "Sequence increases by +3: 12 + 3 = 15.", hi: "अनुक्रम +3 से बढ़ता है: 12 + 3 = 15.", mr: "मालिका +3 ने वाढते: 12 + 3 = 15." } },
    { id: 7, question: { en: "English: Choose proper adjective: 'He is a ___ boy.'", hi: "अंग्रेजी: उचित विशेषण चुनें: 'He is a ___ boy.'", mr: "इंग्रजी: योग्य विशेषण निवडा: 'He is a ___ boy.'" }, options: { en: ["run", "brave", "quickly", "and"], hi: ["run", "brave", "quickly", "and"], mr: ["run", "brave", "quickly", "and"] }, correct: 1, explanation: { en: "'Brave' is an adjective describing the boy.", hi: "'Brave' लड़के की विशेषता बताने वाला विशेषण है.", mr: "'Brave' हे मुलाचे वर्णन करणारे विशेषण आहे." } },
    { id: 8, question: { en: "Science: Chemical symbol for Sodium is:", hi: "विज्ञान: सोडियम का रासायनिक प्रतीक है:", mr: "विज्ञान: सोडियमचे रासायनिक चिन्ह काय आहे:" }, options: { en: ["So", "Na", "Sd", "S"], hi: ["So", "Na", "Sd", "S"], mr: ["So", "Na", "Sd", "S"] }, correct: 1, explanation: { en: "Sodium symbol is Na (Natrium).", hi: "सोडियम का प्रतीक Na है.", mr: "सोडियमचे चिन्ह Na आहे." } },
    { id: 9, question: { en: "Mathematics: Average of 10, 20, 30, 40, 50 is:", hi: "गणित: 10, 20, 30, 40, 50 का औसत है:", mr: "गणित: 10, 20, 30, 40, 50 ची सरासरी किती:" }, options: { en: ["25", "30", "35", "40"], hi: ["25", "30", "35", "40"], mr: ["25", "30", "35", "40"] }, correct: 1, explanation: { en: "Sum 150 / 5 = 30.", hi: "योग 150 / 5 = 30.", mr: "बेरीज 150 / 5 = 30." } },
    { id: 10, question: { en: "General Knowledge: Which instrument measures atmospheric pressure?", hi: "सामान्य ज्ञान: वायुमंडलीय दबाव किस यंत्र से मापा जाता है?", mr: "सामान्य ज्ञान: वातावरणीय दाब कोणत्या उपकरणाने मोजला जातो?" }, options: { en: ["Thermometer", "Barometer", "Ammeter", "Speedometer"], hi: ["थर्मामीटर", "बैरोमीटर", "एमीटर", "स्पीडोमीटर"], mr: ["थर्मामीटर", "बॅरोमीटर", "अॅमीटर", "स्पीडोमीटर"] }, correct: 1, explanation: { en: "Barometers measure air pressure.", hi: "बैरोमीटर वायुदाब मापता है.", mr: "बॅरोमीटर वातावरणीय दाब मोजतो." } }
  ],
  CLASS_9_10: [
    { id: 1, question: { en: "Mathematics (Board/CET): If a train travels 240 km in 4 hours, its speed is:", hi: "गणित: यदि एक ट्रेन 4 घंटे में 240 किमी चलती है, तो उसकी चाल है:", mr: "गणित: जर ट्रेन 4 तासांत 240 किमी अंतर पार करते, तर तिचा वेग किती:" }, options: { en: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"], hi: ["50 किमी/घंटा", "60 किमी/घंटा", "70 किमी/घंटा", "80 किमी/घंटा"], mr: ["50 किमी/तास", "60 किमी/तास", "70 किमी/तास", "80 किमी/तास"] }, correct: 1, explanation: { en: "Speed = 240 / 4 = 60 km/h.", hi: "चाल = 240 / 4 = 60 किमी/घंटा.", mr: "वेग = 240 / 4 = 60 किमी/तास." } },
    { id: 2, question: { en: "Science (JEE/NEET Found): What is the pH of pure distilled water?", hi: "विज्ञान: शुद्ध आसुत जल का pH मान कितना होता है?", mr: "विज्ञान: शुद्ध डिस्टिल्ड पाण्याचा pH मान किती असतो?" }, options: { en: ["5", "7", "9", "14"], hi: ["5", "7", "9", "14"], mr: ["5", "7", "9", "14"] }, correct: 1, explanation: { en: "Neutral water has pH 7.", hi: "तटस्थ पानी का pH 7 होता है.", mr: "तटस्थ पाण्याचा pH 7 असतो." } },
    { id: 3, question: { en: "Social Science: Which article guarantees Equality before Law in Indian Constitution?", hi: "सामाजिक विज्ञान: भारतीय संविधान का कौन सा अनुच्छेद कानून के समक्ष समानता देता है?", mr: "सामाजिक शास्त्र: भारतीय संविधानातील कोणते कलम कायद्यासमोर समानतेची हमी देते?" }, options: { en: ["Article 12", "Article 14", "Article 19", "Article 21"], hi: ["अनुच्छेद 12", "अनुच्छेद 14", "अनुच्छेद 19", "अनुच्छेद 21"], mr: ["कलम 12", "कलम 14", "कलम 19", "कलम 21"] }, correct: 1, explanation: { en: "Article 14 ensures equality before law.", hi: "अनुच्छेद 14 कानून के समक्ष समानता सुनिश्चित करता है.", mr: "कलम 14 कायद्यासमोर समानतेची हमी देते." } },
    { id: 4, question: { en: "Mathematics: Quadratic equation x² - 9 = 0 has roots:", hi: "गणित: द्विघात समीकरण x² - 9 = 0 के मूल हैं:", mr: "गणित: द्विघाती समीकरण x² - 9 = 0 ची मुळे काय आहेत:" }, options: { en: ["±3", "±9", "3 only", "9 only"], hi: ["±3", "±9", "केवल 3", "केवल 9"], mr: ["±3", "±9", "फक्त 3", "फक्त 9"] }, correct: 0, explanation: { en: "x² = 9 => x = +3 and -3.", hi: "x² = 9 => x = +3 और -3.", mr: "x² = 9 => x = +3 आणि -3." } },
    { id: 5, question: { en: "Science: Value of sin(30°) in trigonometry is:", hi: "विज्ञान/गणित: त्रिकोणमिति में sin(30°) का मान है:", mr: "गणित: त्रिकोणमितीमध्ये sin(30°) चे मूल्य किती आहे:" }, options: { en: ["0", "1/2", "1/√2", "1"], hi: ["0", "1/2", "1/√2", "1"], mr: ["0", "1/2", "1/√2", "1"] }, correct: 1, explanation: { en: "sin(30°) = 0.5 or 1/2.", hi: "sin(30°) = 0.5 या 1/2.", mr: "sin(30°) = 0.5 किंवा 1/2." } },
    { id: 6, question: { en: "Current Affairs: Headquarters of RBI is located in:", hi: "करेंट अफेयर्स: भारतीय रिजर्व बैंक का मुख्यालय कहाँ है?", mr: "चालू घडामोडी: RBI चे मुख्यालय कुठे आहे:" }, options: { en: ["New Delhi", "Mumbai", "Kolkata", "Chennai"], hi: ["नई दिल्ली", "मुंबई", "कोलकाता", "चेन्नई"], mr: ["नवी दिल्ली", "मुंबई", "कोलकाता", "चेन्नई"] }, correct: 1, explanation: { en: "RBI headquarters is in Mumbai.", hi: "RBI का मुख्यालय मुंबई में है.", mr: "RBI चे मुख्यालय मुंबईत आहे." } },
    { id: 7, question: { en: "Logical Reasoning: If CAT = 24 and DOG = 26, then PIG = ?", hi: "तर्कशक्ति: यदि CAT = 24 और DOG = 26, तो PIG = ?", mr: "तर्कशास्त्र: जर CAT = 24 आणि DOG = 26, तर PIG = ?" }, options: { en: ["32", "30", "36", "40"], hi: ["32", "30", "36", "40"], mr: ["32", "30", "36", "40"] }, correct: 0, explanation: { en: "P(16)+I(9)+G(7) = 32.", hi: "P(16)+I(9)+G(7) = 32.", mr: "P(16)+I(9)+G(7) = 32." } },
    { id: 8, question: { en: "Science: Which human organ filters blood to produce urine?", hi: "विज्ञान: मानव शरीर में कौन सा अंग रक्त को छानकर मूत्र बनाता है?", mr: "विज्ञान: मानवी शरीरातील कोणता अवयव रक्ताचे गाळण करून मूत्र तयार करतो?" }, options: { en: ["Heart", "Lungs", "Kidney", "Liver"], hi: ["हृदय", "फेफड़े", "गुर्दा (किडनी)", "यकृत"], mr: ["हृदय", "फुफ्फुस", "मूत्रपिंड (किडनी)", "यकृत"] }, correct: 2, explanation: { en: "Kidneys filter blood waste.", hi: "गुर्दे रक्त के अपशिष्ट को छानते हैं.", mr: "मूत्रपिंड रक्तातील टाकाऊ घटक गाळतात." } },
    { id: 9, question: { en: "English: Select synonym for 'PERSISTENT':", hi: "अंग्रेजी: 'PERSISTENT' का पर्यायवाची चुनें:", mr: "इंग्रजी: 'PERSISTENT' चा समानार्थी शब्द निवडा:" }, options: { en: ["Temporary", "Determined", "Lazy", "Uncertain"], hi: ["अस्थाई", "दृढ़/संकल्पित", "आलसी", "अनिश्चित"], mr: ["अस्थायी", "निश्चयी / दृढ", "आळशी", "अनिश्चित"] }, correct: 1, explanation: { en: "Persistent means determined and firm.", hi: "Persistent का अर्थ दृढ़ और संकल्पित होता है.", mr: "Persistent म्हणजे निश्चयी आणि दृढ." } },
    { id: 10, question: { en: "Mathematics: Find HCF of 24 and 36:", hi: "गणित: 24 और 36 का HCF ज्ञात कीजिए:", mr: "गणित: 24 आणि 36 चा मसावी (HCF) काढा:" }, options: { en: ["6", "8", "12", "18"], hi: ["6", "8", "12", "18"], mr: ["6", "8", "12", "18"] }, correct: 2, explanation: { en: "HCF of 24 and 36 is 12.", hi: "24 और 36 का HCF 12 है.", mr: "24 आणि 36 चा मसावी 12 आहे." } }
  ],
  CLASS_11_12: [
    { id: 1, question: { en: "Quantitative Aptitude: Derivative of sin(x) with respect to x is:", hi: "गणित (MHT-CET/JEE): x के सापेक्ष sin(x) का अवकलज है:", mr: "गणित (MHT-CET/JEE): x च्या संदर्भात sin(x) चा डेरिव्हेटिव्ह काय आहे:" }, options: { en: ["-cos(x)", "cos(x)", "tan(x)", "-sin(x)"], hi: ["-cos(x)", "cos(x)", "tan(x)", "-sin(x)"], mr: ["-cos(x)", "cos(x)", "tan(x)", "-sin(x)"] }, correct: 1, explanation: { en: "d/dx(sin x) = cos x.", hi: "d/dx(sin x) = cos x.", mr: "d/dx(sin x) = cos x." } },
    { id: 2, question: { en: "Subject Aptitude (Physics): SI unit of Electric Charge is:", hi: "भौतिकी: विद्युत आवेश का SI मात्रक है:", mr: "भौतिकशास्त्र: विद्युत चार्जचे SI एकक काय आहे:" }, options: { en: ["Farad", "Coulomb", "Tesla", "Weber"], hi: ["फैराड", "कूलम्ब", "टेस्ला", "वेबर"], mr: ["फॅरड", "कुलॉम्ब", "टेस्ला", "वेबर"] }, correct: 1, explanation: { en: "Charge is measured in Coulombs.", hi: "आवेश को कूलम्ब में मापा जाता है.", mr: "चार्ज कुलॉम्बमध्ये मोजला जातो." } },
    { id: 3, question: { en: "Logical Reasoning: Complete series: 2, 6, 12, 20, 30, __", hi: "तर्कशक्ति: श्रृंखला पूरी करें: 2, 6, 12, 20, 30, __", mr: "तर्कशास्त्र: मालिका पूर्ण करा: 2, 6, 12, 20, 30, __" }, options: { en: ["40", "42", "45", "48"], hi: ["40", "42", "45", "48"], mr: ["40", "42", "45", "48"] }, correct: 1, explanation: { en: "Differences increase by +2: +4, +6, +8, +10, +12 => 30 + 12 = 42.", hi: "अंतर +2 से बढ़ता है: 30 + 12 = 42.", mr: "फर्क +2 ने वाढतो: 30 + 12 = 42." } },
    { id: 4, question: { en: "Quantitative Aptitude: If log₁₀(x) = 3, then x equals:", hi: "मात्रात्मक योग्यता: यदि log₁₀(x) = 3, तो x का मान है:", mr: "परिमाण क्षमता: जर log₁₀(x) = 3, तर x ची किंमत किती:" }, options: { en: ["30", "100", "1000", "3000"], hi: ["30", "100", "1000", "3000"], mr: ["30", "100", "1000", "3000"] }, correct: 2, explanation: { en: "x = 10³ = 1000.", hi: "x = 10³ = 1000.", mr: "x = 10³ = 1000." } },
    { id: 5, question: { en: "Subject Aptitude (Chemistry): Oxidation state of Oxygen in H₂O is:", hi: "रसायन विज्ञान: H₂O में ऑक्सीजन की ऑक्सीकरण अवस्था है:", mr: "रसायनशास्त्र: H₂O मधील ऑक्सिजनची ऑक्सिडेशन स्टेट काय आहे:" }, options: { en: ["+2", "-2", "-1", "0"], hi: ["+2", "-2", "-1", "0"], mr: ["+2", "-2", "-1", "0"] }, correct: 1, explanation: { en: "Oxygen oxidation number in water is -2.", hi: "पानी में ऑक्सीजन की ऑक्सीकरण संख्या -2 है.", mr: "पाण्यात ऑक्सिजनचा ऑक्सिडेशन अंक -2 आहे." } },
    { id: 6, question: { en: "Current Affairs: Which institution conducts National Eligibility cum Entrance Test (NEET)?", hi: "करेंट अफेयर्स: NEET परीक्षा कौन सी संस्था आयोजित करती है?", mr: "चालू घडामोडी: NEET परीक्षा कोणती संस्था आयोजित करते?" }, options: { en: ["UPSC", "NTA", "CBSE", "AIIMS"], hi: ["UPSC", "NTA", "CBSE", "AIIMS"], mr: ["UPSC", "NTA", "CBSE", "AIIMS"] }, correct: 1, explanation: { en: "National Testing Agency (NTA) conducts NEET.", hi: "NTA NEET परीक्षा आयोजित करता है.", mr: "NTA द्वारे NEET परीक्षा घेतली जाते." } },
    { id: 7, question: { en: "English: Choose the correct active/passive form for: 'She wrote a letter.'", hi: "अंग्रेजी: 'She wrote a letter.' का सही रूप चुनें:", mr: "इंग्रजी: 'She wrote a letter.' चे योग्य रूप निवडा:" }, options: { en: ["A letter was written by her.", "A letter is written by her.", "A letter has been written.", "She is writing a letter."], hi: ["A letter was written by her.", "A letter is written by her.", "A letter has been written.", "She is writing a letter."], mr: ["A letter was written by her.", "A letter is written by her.", "A letter has been written.", "She is writing a letter."] }, correct: 0, explanation: { en: "Simple past active changes to 'was written by'.", hi: "भूतकाल का पैसिव 'was written by' बनता है.", mr: "भूतकाळात 'was written by' वापरले जाते." } },
    { id: 8, question: { en: "Quantitative Aptitude: Work done when displacement is perpendicular to force:", hi: "भौतिकी: जब विस्थापन बल के लंबवत हो तो किया गया कार्य:", mr: "भौतिकशास्त्र: जेव्हा विस्थापन बलाशी लंब असते तेव्हा केलेले कार्य:" }, options: { en: ["Maximum", "Zero", "Negative", "Infinite"], hi: ["अधिकतम", "शून्य", "ऋणात्मक", "अनंत"], mr: ["कमाल", "शून्य", "ऋणात्मक", "अनंत"] }, correct: 1, explanation: { en: "W = Fd cos(90°) = 0.", hi: "W = Fd cos(90°) = 0.", mr: "W = Fd cos(90°) = 0." } },
    { id: 9, question: { en: "General Knowledge: Light year is a unit of:", hi: "सामान्य ज्ञान: प्रकाश वर्ष किसकी इकाई है:", mr: "सामान्य ज्ञान: प्रकाश वर्ष कशाचे एकक आहे:" }, options: { en: ["Time", "Distance", "Speed", "Intensity"], hi: ["समय", "दूरी", "गति", "तीव्रता"], mr: ["वेळ", "अंतर", "वेग", "प्रखरता"] }, correct: 1, explanation: { en: "Light year measures astronomical distance.", hi: "प्रकाश वर्ष खगोलीय दूरी मापता है.", mr: "प्रकाश वर्ष खगोलीय अंतर मोजतो." } },
    { id: 10, question: { en: "Subject Aptitude: Which element has the highest electronegativity?", hi: "रसायन विज्ञान: किस तत्व की विद्युत ऋणात्मकता सबसे अधिक है?", mr: "रसायनशास्त्र: कोणत्या मूलद्रव्याची विद्युत ऋणात्मकता सर्वात जास्त आहे?" }, options: { en: ["Fluorine", "Chlorine", "Oxygen", "Nitrogen"], hi: ["फ्लोरिन", "क्लोरीन", "ऑक्सीजन", "नाइट्रोजन"], mr: ["फ्लुरिन", "क्लोरीन", "ऑक्सिजन", "नायट्रोजन"] }, correct: 0, explanation: { en: "Fluorine is the most electronegative element.", hi: "फ्लोरिन सबसे अधिक विद्युत ऋणात्मक है.", mr: "फ्लुरिन सर्वात जास्त विद्युत ऋणात्मक मूलद्रव्य आहे." } }
  ],
  COMPETITIVE: [
    { id: 1, question: { en: "Quantitative Aptitude (Govt/Banking): Simple interest on ₹5000 at 10% per annum for 2 years:", hi: "मात्रात्मक योग्यता: ₹5000 पर 10% वार्षिक दर से 2 वर्ष का साधारण ब्याज:", mr: "परिमाण क्षमता: ₹5000 वर दरसाल 10% ने 2 वर्षांचे सरळ व्याज किती:" }, options: { en: ["₹500", "₹1000", "₹1200", "₹1500"], hi: ["₹500", "₹1000", "₹1200", "₹1500"], mr: ["₹500", "₹1000", "₹1200", "₹1500"] }, correct: 1, explanation: { en: "SI = (5000 x 10 x 2)/100 = ₹1000.", hi: "SI = (5000 x 10 x 2)/100 = ₹1000.", mr: "SI = (5000 x 10 x 2)/100 = ₹1000." } },
    { id: 2, question: { en: "Reasoning: If A can do a job in 10 days and B in 15 days, together they take:", hi: "तर्कशक्ति: यदि A किसी काम को 10 दिन में और B 15 दिन में करे, तो दोनों मिलकर लेंगे:", mr: "तर्कशास्त्र: जर A एक काम 10 दिवसांत आणि B 15 दिवसांत करत असेल, तर दोघे मिळून किती दिवस घेतील:" }, options: { en: ["5 days", "6 days", "8 days", "12 days"], hi: ["5 दिन", "6 दिन", "8 दिन", "12 दिन"], mr: ["5 दिवस", "6 दिवस", "8 दिवस", "12 दिवस"] }, correct: 1, explanation: { en: "1/10 + 1/15 = 1/6 => 6 days.", hi: "1/10 + 1/15 = 1/6 => 6 दिन.", mr: "1/10 + 1/15 = 1/6 => 6 दिवस." } },
    { id: 3, question: { en: "General Knowledge: Capital of Maharashtra is:", hi: "सामान्य ज्ञान: महाराष्ट्र की राजधानी है:", mr: "सामान्य ज्ञान: महाराष्ट्राची राजधानी कोणती आहे:" }, options: { en: ["Pune", "Nagpur", "Mumbai", "Chhatrapati Sambhajinagar"], hi: ["पुणे", "नागपुर", "मुंबई", "छत्रपति संभाजीनगर"], mr: ["पुणे", "नागपूर", "मुंबई", "छत्रपती संभाजीनगर"] }, correct: 2, explanation: { en: "Mumbai is the capital of Maharashtra.", hi: "मुंबई महाराष्ट्र की राजधानी है.", mr: "मुंबई ही महाराष्ट्राची राजधानी आहे." } },
    { id: 4, question: { en: "Computer Awareness: What does CPU stand for?", hi: "कंप्यूटर ज्ञान: CPU का पूर्ण रूप क्या है?", mr: "संगणक ज्ञान: CPU चा अर्थ काय आहे:" }, options: { en: ["Central Processing Unit", "Core Power Utility", "Central Performance Unit", "Control Program Unit"], hi: ["Central Processing Unit", "Core Power Utility", "Central Performance Unit", "Control Program Unit"], mr: ["Central Processing Unit", "Core Power Utility", "Central Performance Unit", "Control Program Unit"] }, correct: 0, explanation: { en: "CPU stands for Central Processing Unit.", hi: "CPU का अर्थ Central Processing Unit है.", mr: "CPU म्हणजे Central Processing Unit होय." } },
    { id: 5, question: { en: "Current Affairs: Who is known as the Father of the Indian Constitution?", hi: "सामान्य ज्ञान: भारतीय संविधान के जनक के रूप में किसे जाना जाता है?", mr: "चालू घडामोडी / संविधान: भारतीय संविधानाचे जनक म्हणून कोणाला ओळखले जाते?" }, options: { en: ["Mahatma Gandhi", "Dr. B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"], hi: ["महात्मा गांधी", "डॉ. बी.आर. अम्बेडकर", "जवाहरलाल नेहरू", "सरदार पटेल"], mr: ["महात्मा गांधी", "डॉ. बी. आर. आंबेडकर", "जवाहरलाल नेहरू", "सरदार पटेल"] }, correct: 1, explanation: { en: "Dr. B.R. Ambedkar drafted the Constitution.", hi: "डॉ. बी.आर. अम्बेडकर ने संविधान का प्रारूप तैयार किया.", mr: "डॉ. बी. आर. आंबेडकर यांनी संविधानाचा मसुदा तयार केला." } },
    { id: 6, question: { en: "Reasoning: Look at series: 7, 10, 8, 11, 9, 12, __ What comes next?", hi: "तर्कशक्ति: श्रृंखला देखें: 7, 10, 8, 11, 9, 12, __ अगला क्या होगा?", mr: "तर्कशास्त्र: मालिका पहा: 7, 10, 8, 11, 9, 12, __ पुढे काय येईल?" }, options: { en: ["7", "10", "12", "13"], hi: ["7", "10", "12", "13"], mr: ["7", "10", "12", "13"] }, correct: 1, explanation: { en: "Alternating sequence pattern (-2): 12 - 2 = 10.", hi: "पैटर्न (-2): 12 - 2 = 10.", mr: "पॅटर्न (-2): 12 - 2 = 10." } },
    { id: 7, question: { en: "English: Choose antonym of 'ABUNDANT':", hi: "अंग्रेजी: 'ABUNDANT' का विलोम शब्द चुनें:", mr: "इंग्रजी: 'ABUNDANT' चा विरुद्धार्थी शब्द निवडा:" }, options: { en: ["Scarce", "Plentiful", "Ample", "Rich"], hi: ["दुर्लभ (Scarce)", "प्रचुर", "भरपूर", "अमीर"], mr: ["तुटवडा / अपुरे (Scarce)", "प्रचुर", "भरपूर", "श्रीमंत"] }, correct: 0, explanation: { en: "'Scarce' means insufficient or rare, opposite of abundant.", hi: "'Scarce' का अर्थ प्रचुर का विपरीत दुर्लभ है.", mr: "'Scarce' म्हणजे अपुरे, जे भरपूरच्या विरुद्ध आहे." } },
    { id: 8, question: { en: "General Knowledge: Which river basin is the largest in India?", hi: "सामान्य ज्ञान: भारत में सबसे बड़ा नदी बेसिन कौन सा है?", mr: "सामान्य ज्ञान: भारतातील सर्वात मोठे नदी खोरे कोणते आहे:" }, options: { en: ["Ganga", "Godavari", "Krishna", "Narmada"], hi: ["गंगा", "गोदावरी", "कृष्णा", "नर्मदा"], mr: ["गंगा", "गोदावरी", "कृष्णा", "नर्मदा"] }, correct: 0, explanation: { en: "Ganga basin is India's largest river basin.", hi: "गंगा बेसिन भारत का सबसे बड़ा नदी बेसिन है.", mr: "गंगा खोरे हे भारतातील सर्वात मोठे नदी खोरे आहे." } },
    { id: 9, question: { en: "Quantitative Aptitude: If a shirt marked at ₹800 is sold for ₹680, discount percentage is:", hi: "मात्रात्मक योग्यता: यदि ₹800 अंकित मूल्य की शर्ट ₹680 में बिके, तो छूट प्रतिशत है:", mr: "परिमाण क्षमता: जर ₹800 छापील किंमत असलेला शर्ट ₹680 ला विकला, तर सूट किती टक्के:" }, options: { en: ["10%", "12%", "15%", "20%"], hi: ["10%", "12%", "15%", "20%"], mr: ["10%", "12%", "15%", "20%"] }, correct: 2, explanation: { en: "Discount = 120 / 800 x 100 = 15%.", hi: "छूट = 120 / 800 x 100 = 15%.", mr: "सूट = 120 / 800 x 100 = 15%." } },
    { id: 10, question: { en: "Computer Awareness: Shortcut key for 'Copy' in Windows is:", hi: "कंप्यूटर ज्ञान: Windows में 'Copy' करने की शॉर्टकट की क्या है:", mr: "संगणक ज्ञान: Windows मध्ये 'Copy' करण्यासाठी शॉर्टकट की कोणती:" }, options: { en: ["Ctrl + C", "Ctrl + V", "Ctrl + X", "Ctrl + A"], hi: ["Ctrl + C", "Ctrl + V", "Ctrl + X", "Ctrl + A"], mr: ["Ctrl + C", "Ctrl + V", "Ctrl + X", "Ctrl + A"] }, correct: 0, explanation: { en: "Ctrl + C is used for copying selected content.", hi: "Ctrl + C का उपयोग कॉपी करने के लिए होता है.", mr: "Ctrl + C चा वापर सामग्री कॉपी करण्यासाठी होतो." } }
  ]
};

export default function FormatPage() {
  const [step, setStep] = useState(1);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [examLanguage, setExamLanguage] = useState('en');

  const [studentName, setStudentName] = useState('Rahul Sharma');
  const [mobileNumber, setMobileNumber] = useState('8956643326');
  const [selectedClassId, setSelectedClassId] = useState('CLASS_9_10');

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300);

  const currentQuestions = QUESTION_BANKS[selectedClassId] || QUESTION_BANKS.CLASS_9_10;

  const [simStep, setSimStep] = useState(0); 
  const [isSimPlaying, setIsSimPlaying] = useState(true);

  useEffect(() => {
    let timer;
    if (step === 3 && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && step === 3) {
      setStep(4);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  useEffect(() => {
    let simTimer;
    if (isVideoModalOpen && isSimPlaying) {
      simTimer = setInterval(() => {
        setSimStep((prev) => (prev < 6 ? prev + 1 : 0));
      }, 3500);
    }
    return () => clearInterval(simTimer);
  }, [isVideoModalOpen, isSimPlaying]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!studentName || !mobileNumber) return;
    setStep(2);
  };

  const handleStartExam = () => {
    setStep(3);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setTimeLeft(300);
  };

  const handleOptionSelect = (qIdx, optIdx) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const calculateScore = useCallback(() => {
    let correct = 0;
    currentQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) correct++;
    });
    return correct;
  }, [currentQuestions, selectedAnswers]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="py-12 min-h-screen bg-slate-50/50 px-4 md:px-6 animate-fade-in space-y-16">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* LANGUAGE SWITCHER BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-xs border border-slate-200 gap-4">
          <span className="text-xs font-black text-indigo-900 uppercase tracking-widest">
            🌐 {examLanguage === 'hi' ? 'भाषा चुनें (Select Language)' : examLanguage === 'mr' ? 'भाषा निवडा (Select Language)' : 'Select Exam Language'}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setExamLanguage('en')}
              className={`px-4 py-1.5 text-xs font-black rounded-xl transition cursor-pointer ${
                examLanguage === 'en' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setExamLanguage('hi')}
              className={`px-4 py-1.5 text-xs font-black rounded-xl transition cursor-pointer ${
                examLanguage === 'hi' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              हिंदी (Hindi)
            </button>
            <button
              onClick={() => setExamLanguage('mr')}
              className={`px-4 py-1.5 text-xs font-black rounded-xl transition cursor-pointer ${
                examLanguage === 'mr' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              मराठी (Marathi)
            </button>
          </div>
        </div>

        {/* 1. HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>EXAM ARCHITECTURE & SYLLABUS-ALIGNED DEMO</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            How Students Take the Exam
          </h1>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-normal">
            Experience our full student portal journey across English, Hindi, and Marathi—from student login to Group A through E tailored tier exams, professional certificates, and analytics.
          </p>
        </div>

        {/* 2. STEP-BY-STEP EXAM WORKFLOW + TUTORIAL VIDEO BANNER */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
            <div>
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">🔄 EXAM WORKFLOW</span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1 tracking-tight">Step-by-Step Student Experience</h2>
            </div>

            <button
              onClick={() => {
                setIsVideoModalOpen(true);
                setSimStep(0);
                setIsSimPlaying(true);
              }}
              className="bg-red-600 text-white font-black px-5 py-2.5 rounded-2xl text-xs md:text-sm hover:bg-red-700 transition shadow-md flex items-center gap-2 self-start sm:self-auto shrink-0 cursor-pointer"
              aria-label="Watch Walkthrough Video"
            >
              <Video className="w-4 h-4 fill-white" />
              <span>Watch Walkthrough Video</span>
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Log in at 8:00 PM", desc: "Students sign into their portal using their registered mobile number. The exam opens precisely at 8:00 PM.", icon: UserCheck },
              { step: "02", title: "AI Camera Verification", desc: "Browser camera permissions activate AI monitoring to ensure fair play and prevent malpractice during the test.", icon: Camera },
              { step: "03", title: "40-Min Timed Test", desc: "60 randomized MCQs appear one by one in English, Hindi or Marathi with live timers.", icon: Laptop },
              { step: "04", title: "Instant Marksheet & Rank", desc: "Upon test completion, verified certificates, subject analytics, and rankings are generated instantly.", icon: Award }
            ].map((stepItem, idx) => {
              const Icon = stepItem.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 relative overflow-hidden">
                  <span className="text-3xl font-black text-indigo-100 absolute top-4 right-4 pointer-events-none">
                    {stepItem.step}
                  </span>
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 mb-1">{stepItem.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{stepItem.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. SIMULATED EXAM ENGINE CONTAINER */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 md:p-10 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                  Live Test Simulator ({examLanguage.toUpperCase()})
                </span>
                <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">🧪 FULL STUDENT PORTAL DEMO</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">Practice Exam Engine</h2>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
              <span className={`px-3 py-1 rounded-full ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>1. Login</span>
              <span className="text-slate-300">•</span>
              <span className={`px-3 py-1 rounded-full ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>2. Class Tier</span>
              <span className="text-slate-300">•</span>
              <span className={`px-3 py-1 rounded-full ${step === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>3. Attempt Test</span>
              <span className="text-slate-300">•</span>
              <span className={`px-3 py-1 rounded-full ${step === 4 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>4. Certificate & Analytics</span>
            </div>
          </div>

          {/* STEP 1: STUDENT LOGIN BOARD SIMULATION */}
          {step === 1 && (
            <div className="max-w-md mx-auto bg-slate-50 p-8 rounded-3xl border border-slate-200/80 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Student Login Board</h3>
                <p className="text-xs text-slate-500">Sign in to start your scheduled daily 100-Day MCQ challenge</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-4 py-3 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Registered Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 8956643326"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full px-4 py-3 text-xs md:text-sm rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-black py-3.5 rounded-xl text-xs md:text-sm shadow-md hover:bg-indigo-700 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Select Academic Tier</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: CLASS SELECT SCREEN */}
          {step === 2 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100 flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900">Logged in as: <span className="font-black text-indigo-600">{studentName}</span> ({mobileNumber})</span>
                <button onClick={() => setStep(1)} className="text-[11px] font-bold text-indigo-600 underline cursor-pointer">Change Student</button>
              </div>

              <div className="space-y-2 text-center">
                <h3 className="text-xl md:text-2xl font-black text-slate-900">Select Your Academic Class / Category</h3>
                <p className="text-xs text-slate-500">Choose Group A through E category below to load tailored syllabus questions in {examLanguage.toUpperCase()}</p>
              </div>

              <div className="space-y-3">
                {CLASS_OPTIONS.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                      selectedClassId === cls.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.01]'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${selectedClassId === cls.id ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                        {cls.group}
                      </span>
                      <h4 className="text-xs md:text-sm font-black mt-1.5">{cls.name}</h4>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedClassId === cls.id ? 'border-white bg-white/20' : 'border-slate-300'}`}>
                      {selectedClassId === cls.id && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleStartExam}
                className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl text-sm shadow-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Tier Assessment ({examLanguage.toUpperCase()})</span>
              </button>
            </div>
          )}

          {/* STEP 3: 10-QUESTION EXAM ENGINE */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900 text-white p-4 rounded-2xl gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                  <span className="text-xs font-black text-amber-400">AI PROCTORING ACTIVE ({examLanguage.toUpperCase()})</span>
                  <span className="text-xs text-slate-400">| Student: {studentName}</span>
                </div>

                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 self-start sm:self-auto">
                  <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="text-xs text-slate-300 font-bold">Time Left:</span>
                  <span className="text-sm font-black text-amber-400 font-mono">{formatTime(timeLeft)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>Question {currentQIndex + 1} of {currentQuestions.length}</span>
                  <span className="text-indigo-600 font-black">{CLASS_OPTIONS.find(c => c.id === selectedClassId)?.name}</span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full transition-all duration-300"
                    style={{ width: `${((currentQIndex + 1) / currentQuestions.length) * 100}%` }}
                  ></div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {currentQuestions.map((_, idx) => {
                    const isAnswered = selectedAnswers[idx] !== undefined;
                    const isCurrent = currentQIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentQIndex(idx)}
                        className={`w-7 h-7 text-xs font-black rounded-lg transition border cursor-pointer ${
                          isCurrent 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                            : isAnswered 
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200/80 space-y-6">
                <h3 className="text-base md:text-lg font-black text-slate-900 leading-snug">
                  {currentQuestions[currentQIndex].id}. {currentQuestions[currentQIndex].question[examLanguage] || currentQuestions[currentQIndex].question.en}
                </h3>

                <div className="grid sm:grid-cols-2 gap-3">
                  {(currentQuestions[currentQIndex].options[examLanguage] || currentQuestions[currentQIndex].options.en).map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentQIndex] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleOptionSelect(currentQIndex, optIdx)}
                        className={`p-4 rounded-xl text-xs md:text-sm font-semibold border text-left transition flex items-center justify-between cursor-pointer ${
                          isSelected 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                            : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <span>{opt}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-white bg-white/20' : 'border-slate-300'}`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  disabled={currentQIndex === 0}
                  onClick={() => setCurrentQIndex((prev) => prev - 1)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-40 hover:bg-slate-100 transition cursor-pointer"
                >
                  Previous
                </button>

                {currentQIndex < currentQuestions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQIndex((prev) => prev + 1)}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-black hover:bg-indigo-700 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setStep(4)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 transition shadow-md cursor-pointer"
                  >
                    Submit Tier Assessment
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: CERTIFICATE, SCORECARD, SUBJECT ANALYTICS & FUTURE GROWTH */}
          {step === 4 && (
            <div className="space-y-10 animate-fade-in">
              <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-6 text-center border border-slate-800">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/30">
                  <Award className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-widest">Instant Result & Verified Certification</span>
                  <h3 className="text-2xl md:text-3xl font-black">Exam Evaluation Complete</h3>
                  <p className="text-xs text-slate-300">
                    Student: <span className="font-bold text-white">{studentName}</span> ({mobileNumber}) • Category: <span className="font-bold text-indigo-300">{CLASS_OPTIONS.find(c => c.id === selectedClassId)?.name}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-center border-t border-b border-white/10 py-6">
                  <div>
                    <div className="text-2xl md:text-3xl font-black text-emerald-400">{calculateScore()} / {currentQuestions.length}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Total Score</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-black text-amber-400">{Math.round((calculateScore() / currentQuestions.length) * 100)}%</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Accuracy</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-black text-indigo-300">{currentQuestions.length - calculateScore()}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Incorrect</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-black text-sky-300">#4 State</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">Estimated Rank</div>
                  </div>
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="bg-white/10 border border-white/20 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-white/20 transition inline-flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart Practice Portal</span>
                </button>
              </div>

              {/* 1. VERIFIED CERTIFICATE OF COMPLETION (PROFESSIONAL DISPLAY) */}
              <div className="bg-gradient-to-br from-slate-900 via-[#01295A] to-blue-950 text-white p-8 md:p-14 rounded-3xl shadow-2xl text-center relative overflow-hidden border-4 border-amber-400/40">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
                
                <div className="w-20 h-20 bg-amber-400/20 rounded-full flex items-center justify-center mx-auto border-2 border-amber-400 mb-4 shadow-lg animate-pulse">
                  <Award className="w-10 h-10 text-amber-400" />
                </div>

                <span className="text-xs tracking-widest uppercase font-black text-amber-400 bg-amber-400/10 px-4 py-1.5 rounded-full border border-amber-400/30">
                  TOPIQ Talent Test (TTT) • Certificate of Merit
                </span>

                <h3 className="text-3xl md:text-5xl font-black mt-6 mb-3 tracking-tight font-serif text-amber-200">Certificate of Excellence</h3>
                
                <p className="text-xs md:text-sm text-slate-300 uppercase tracking-widest font-bold mb-2">This is proudly presented to</p>
                
                <h4 className="text-2xl md:text-4xl font-extrabold text-white underline decoration-amber-400 decoration-2 underline-offset-8 mb-6 font-serif">
                  {studentName}
                </h4>

                <p className="text-xs md:text-sm text-slate-200 max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
                  For outstanding performance and successfully completing the TOPIQ Talent Test (TTT) Assessment in <strong className="text-amber-300 uppercase">{examLanguage}</strong> mode under rigorous AI proctoring standards.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-xl mx-auto text-xs text-slate-300 border-t border-white/20 pt-6">
                  <div>Issued by: <strong className="text-white block mt-0.5">TOPIQ Academic Board</strong></div>
                  <div>Accuracy Rate: <strong className="text-amber-400 block mt-0.5">{Math.round((calculateScore() / currentQuestions.length) * 100)}%</strong></div>
                  <div>Status: <strong className="text-emerald-400 block mt-0.5">Verified & Authenticated 🛡️</strong></div>
                </div>
              </div>

              {/* 2. OVERALL SCORECARD & 3. SUBJECT-WISE ANALYTICS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-[#01295A] uppercase tracking-wider flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-indigo-600" />
                      <span>Overall Scorecard</span>
                    </h4>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2.5 py-0.5 rounded-full uppercase">Passed</span>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-[#01295A] to-indigo-900 text-white rounded-2xl shadow-md">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">Performance Index</span>
                      <h3 className="text-3xl font-black text-[#FE7C02] mt-1">{Math.round((calculateScore() / currentQuestions.length) * 100)}% Score</h3>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-amber-400 flex items-center justify-center text-xl font-black text-amber-400 shadow-inner">
                      {calculateScore()}/{currentQuestions.length}
                    </div>
                  </div>

                  <div className="space-y-3 text-xs font-bold text-slate-700">
                    <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span>Correct Answers:</span> 
                      <strong className="text-emerald-600">{calculateScore()} Correct</strong>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span>Evaluation Time:</span> 
                      <strong className="text-slate-900">03:45 mins</strong>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span>State Percentile:</span> 
                      <strong className="text-indigo-700">94th Percentile 🚀</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-[#01295A] uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#FE7C02]" />
                      <span>Subject-Wise Analytics</span>
                    </h4>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 font-black px-2.5 py-0.5 rounded-full uppercase">AI Analyzed</span>
                  </div>

                  <div className="space-y-5 pt-2">
                    <div>
                      <div className="flex justify-between text-xs font-black mb-1.5 text-slate-800">
                        <span>Logical Reasoning / Mental Ability</span>
                        <span className="text-indigo-600">90% Accuracy</span>
                      </div>
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
                        <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 h-full rounded-full transition-all duration-1000" style={{ width: '90%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-black mb-1.5 text-slate-800">
                        <span>Core Mathematics / Quantitative Aptitude</span>
                        <span className="text-amber-600">80% Accuracy</span>
                      </div>
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
                        <div className="bg-gradient-to-r from-amber-500 to-[#FE7C02] h-full rounded-full transition-all duration-1000" style={{ width: '80%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-black mb-1.5 text-slate-800">
                        <span>Science & Subject Proficiency</span>
                        <span className="text-emerald-600">85% Accuracy</span>
                      </div>
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-1000" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-indigo-50/70 rounded-2xl border border-indigo-100 text-[11px] text-indigo-900 font-medium flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>Your strongest domain is Logical Reasoning. Keep practicing to reach top state rank across all 100 days.</span>
                  </div>
                </div>

              </div>

              {/* 4. OVERVIEW FOR FUTURE GROWTH */}
              <div className="bg-white p-6 md:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 bg-amber-100 text-[#FE7C02] rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-[#01295A]">Overview for Future Growth</h4>
                    <p className="text-xs text-slate-500 font-medium">Strategic 100-Day Challenge Development Roadmap</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-black bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full uppercase">Phase 1 (Days 1–30)</span>
                    <h5 className="text-xs font-black text-slate-900">Foundation Mastery</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">Focus on eliminating calculation errors and building bulletproof conceptual speed in Tier topics.</p>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full uppercase">Phase 2 (Days 31–70)</span>
                    <h5 className="text-xs font-black text-slate-900">Advanced Problem Solving</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">Engage with multi-disciplinary MCQ sets under strict AI timer constraints to build exam stamina.</p>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full uppercase">Phase 3 (Days 71–100)</span>
                    <h5 className="text-xs font-black text-slate-900">State Rank Optimization</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">Review daily official answer keys and fine-tune weak zones to secure top state rank credentials.</p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="px-8 py-3.5 bg-[#01295A] text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-blue-900 transition shadow-lg cursor-pointer flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retake Demo Exam</span>
                  </button>
                </div>
              </div>

              {/* ANSWER KEY REVIEW */}
              <div className="space-y-6 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">🔑 DAILY OFFICIAL ANSWER KEY</span>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-1">Question-by-Question Solution Review</h3>
                  </div>
                  <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200">
                    All 10 Solutions
                  </span>
                </div>

                <div className="space-y-4">
                  {currentQuestions.map((q, idx) => {
                    const userSel = selectedAnswers[idx];
                    const isCorrect = userSel === q.correct;
                    const isAttempted = userSel !== undefined;
                    const qText = q.question[examLanguage] || q.question.en;
                    const optList = q.options[examLanguage] || q.options.en;
                    const expText = q.explanation[examLanguage] || q.explanation.en;

                    return (
                      <div key={idx} className={`p-6 rounded-2xl border ${isCorrect ? 'bg-emerald-50/40 border-emerald-200' : isAttempted ? 'bg-rose-50/40 border-rose-200' : 'bg-slate-50 border-slate-200'} space-y-4`}>
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="text-sm font-black text-slate-900">
                            Q{idx + 1}. {qText}
                          </h4>

                          {isCorrect ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shrink-0">
                              <CheckCircle2 className="w-3 h-3" /> Correct (+1)
                            </span>
                          ) : isAttempted ? (
                            <span className="inline-flex items-center gap-1 bg-rose-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shrink-0">
                              <XCircle className="w-3 h-3" /> Incorrect (0)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shrink-0">
                              Unattempted
                            </span>
                          )}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-2 text-xs">
                          {optList.map((opt, optIdx) => {
                            const isThisCorrect = optIdx === q.correct;
                            const isThisUserSel = userSel === optIdx;

                            let btnStyle = "bg-white text-slate-700 border-slate-200";
                            if (isThisCorrect) {
                              btnStyle = "bg-emerald-600 text-white border-emerald-600 font-black shadow-xs";
                            } else if (isThisUserSel && !isCorrect) {
                              btnStyle = "bg-rose-600 text-white border-rose-600 font-black";
                            }

                            return (
                              <div key={optIdx} className={`p-3 rounded-xl border flex items-center justify-between ${btnStyle}`}>
                                <span>{opt}</span>
                                {isThisCorrect && <span className="text-[10px] font-black uppercase bg-white/20 px-2 py-0.5 rounded">Correct Answer</span>}
                                {isThisUserSel && !isThisCorrect && <span className="text-[10px] font-black uppercase bg-white/20 px-2 py-0.5 rounded">Your Answer</span>}
                              </div>
                            );
                          })}
                        </div>

                        <div className="p-3 bg-white/80 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium">
                          <span className="font-black text-indigo-900 block mb-0.5">💡 Solution & Explanation:</span>
                          {expText}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* 4. ANIMATED WALKTHROUGH VIDEO SIMULATOR MODAL POPUP */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 relative shadow-2xl border border-slate-100 overflow-hidden space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-red-600" />
                <h3 className="text-base md:text-lg font-black text-slate-900">Live Exam Portal Video Simulation</h3>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                aria-label="Close Video Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video rounded-2xl bg-slate-950 text-white p-4 md:p-6 flex flex-col justify-between overflow-hidden shadow-2xl border border-slate-800">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                    REC • STUDENT PORTAL VIDEO DEMO ({simStep + 1}/7)
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg">
                  {simStep * 3.5}s / 24.5s
                </span>
              </div>

              <div className="my-auto animate-fade-in space-y-3 max-w-xl mx-auto w-full">
                {simStep === 0 && (
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 text-center">
                    <UserCheck className="w-8 h-8 text-indigo-400 mx-auto" />
                    <div>
                      <span className="text-[10px] font-black text-indigo-400 uppercase">Stage 1: Student Login Board</span>
                      <h4 className="text-sm md:text-base font-black text-white mt-1">Student Entering Credentials...</h4>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
                      Rahul Sharma • Mobile: +91 8956643326
                    </div>
                  </div>
                )}

                {simStep === 1 && (
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 text-center">
                    <Laptop className="w-8 h-8 text-indigo-400 mx-auto" />
                    <div>
                      <span className="text-[10px] font-black text-indigo-400 uppercase">Stage 2: Category & Class Selection</span>
                      <h4 className="text-sm md:text-base font-black text-white mt-1">Classes 9 & 10 Selected</h4>
                    </div>
                    <div className="bg-indigo-600/30 border border-indigo-500/50 p-2.5 rounded-xl text-xs font-bold text-indigo-200">
                      Group C • Competitive Foundation Test Bank
                    </div>
                  </div>
                )}

                {simStep === 2 && (
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 text-left">
                    <div className="flex items-center justify-between text-[10px] font-bold text-amber-400 border-b border-slate-800 pb-2">
                      <span>Attempting Question 1 of 10</span>
                      <span>AI Proctoring: ACTIVE 🟢</span>
                    </div>
                    <p className="text-xs font-bold text-white">Q1. If a train travels 240 km in 4 hours, what is its average speed?</p>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400">A) 50 km/h</div>
                      <div className="p-2 bg-emerald-600 text-white font-black rounded-lg border border-emerald-500 flex items-center justify-between">
                        <span>B) 60 km/h</span>
                        <Check className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                )}

                {simStep === 3 && (
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 text-left">
                    <div className="flex items-center justify-between text-[10px] font-bold text-amber-400 border-b border-slate-800 pb-2">
                      <span>Attempting Question 2 of 10</span>
                      <span>Time Remaining: 04:45</span>
                    </div>
                    <p className="text-xs font-bold text-white">Q2. Which organ in the human body filters blood to produce urine?</p>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400">A) Heart</div>
                      <div className="p-2 bg-emerald-600 text-white font-black rounded-lg border border-emerald-500 flex items-center justify-between">
                        <span>C) Kidney</span>
                        <Check className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                )}

                {simStep === 4 && (
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 text-left">
                    <div className="flex items-center justify-between text-[10px] font-bold text-amber-400 border-b border-slate-800 pb-2">
                      <span>Attempting Question 3 of 10</span>
                      <span>Submitting Answers...</span>
                    </div>
                    <p className="text-xs font-bold text-white">Q3. Select the synonym for 'PERSISTENT':</p>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 bg-emerald-600 text-white font-black rounded-lg border border-emerald-500 flex items-center justify-between">
                        <span>B) Determined</span>
                        <Check className="w-3 h-3" />
                      </div>
                      <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400">C) Lazy</div>
                    </div>
                  </div>
                )}

                {simStep === 5 && (
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 text-center">
                    <Award className="w-8 h-8 text-amber-400 mx-auto" />
                    <div>
                      <span className="text-[10px] font-black text-amber-400 uppercase">Stage 4: Instant Evaluation & Rank</span>
                      <h4 className="text-sm md:text-base font-black text-white mt-1">Evaluation Score: 10 / 10</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[11px] border-t border-slate-800 pt-2">
                      <div className="text-emerald-400 font-bold">100% Accuracy</div>
                      <div className="text-indigo-300 font-bold">0 Incorrect</div>
                      <div className="text-sky-300 font-bold">#4 State Rank</div>
                    </div>
                  </div>
                )}

                {simStep === 6 && (
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 text-left">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-[10px] font-black text-indigo-400 uppercase">Stage 5: Official Solution Review</span>
                      <span className="text-[10px] text-emerald-400 font-bold">Correct Solution (+1)</span>
                    </div>
                    <p className="text-xs font-bold text-white">Q1 Solution Explanation:</p>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                      💡 Speed = Distance / Time = 240 km / 4 hrs = 60 km/h.
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1 z-10">
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-amber-400 h-full transition-all duration-300" 
                    style={{ width: `${((simStep + 1) / 7) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSimPlaying(!isSimPlaying)}
                  className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition cursor-pointer"
                  aria-label={isSimPlaying ? "Pause Walkthrough" : "Play Walkthrough"}
                >
                  {isSimPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>
                <button
                  onClick={() => {
                    setSimStep(0);
                    setIsSimPlaying(true);
                  }}
                  className="p-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition cursor-pointer"
                  aria-label="Restart Walkthrough"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <span className="text-xs font-bold text-slate-500">
                Stage {simStep + 1} of 7
              </span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}