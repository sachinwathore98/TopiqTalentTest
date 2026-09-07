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
  Check
} from 'lucide-react';

// CLASS CATEGORIES
const CLASS_OPTIONS = [
  { id: 'CLASS_3_5', name: 'Classes 3 to 5 (Foundation Stage)', group: 'Group A' },
  { id: 'CLASS_6_8', name: 'Classes 6 to 8 (Foundation Plus)', group: 'Group B' },
  { id: 'CLASS_9_10', name: 'Classes 9 & 10 (Competitive Foundation)', group: 'Group C' },
  { id: 'CLASS_11_12', name: 'Classes 11 & 12 (Career Prep)', group: 'Group D' },
  { id: 'COMPETITIVE', name: 'Competitive Exams (12th & Above)', group: 'Group E' },
];

// SAMPLE 10-QUESTION BANKS PER CLASS TIER (Multilingual Support: en, hi, mr)
const QUESTION_BANKS = {
  CLASS_3_5: [
    { 
      id: 1, 
      question: { en: "What is 15 multiplied by 8?", hi: "15 को 8 से गुणा करने पर क्या मिलता है?", mr: "15 ला 8 ने गुणले असता उत्तर काय येते?" }, 
      options: { en: ["100", "120", "130", "140"], hi: ["100", "120", "130", "140"], mr: ["100", "120", "130", "140"] }, 
      correct: 1, 
      explanation: { en: "15 x 8 = 120.", hi: "15 x 8 = 120.", mr: "15 x 8 = 120." } 
    },
    { 
      id: 2, 
      question: { en: "Which is the largest land animal in the world?", hi: "दुनिया का सबसे बड़ा स्थलीय जानवर कौन सा है?", mr: "जगातील सर्वात मोठा भूचर प्राणी कोणता आहे?" }, 
      options: { en: ["Giraffe", "Blue Whale", "African Elephant", "Hippopotamus"], hi: ["जिराफ", "नीली व्हेल", "अफ्रीकी हाथी", "हिप्पोपोटामस"], mr: ["जिराफ", "ब्लू व्हेल", "आफ्रिकन हत्ती", "हिप्पोपोटॅमस"] }, 
      correct: 2, 
      explanation: { en: "African Elephant is the largest land mammal.", hi: "अफ्रीकी हाथी सबसे बड़ा स्थलीय स्तनधारी है.", mr: "आफ्रिकन हत्ती हा सर्वात मोठा भूचर सस्तन प्राणी आहे." } 
    },
    { id: 3, question: { en: "Choose the correct spelling:", hi: "सही वर्तनी चुनें:", mr: "योग्य स्पेलिंग निवडा:" }, options: { en: ["Beautifull", "Beautiful", "Beautifil", "Beutiful"], hi: ["Beautifull", "Beautiful", "Beautifil", "Beutiful"], mr: ["Beautifull", "Beautiful", "Beautifil", "Beutiful"] }, correct: 1, explanation: { en: "The correct spelling is B-E-A-U-T-I-F-U-L.", hi: "सही वर्तनी B-E-A-U-T-I-F-U-L है.", mr: "योग्य स्पेलिंग B-E-A-U-T-I-F-U-L आहे." } },
    { id: 4, question: { en: "How many sides does a hexagon have?", hi: "षट्कोण की कितनी भुजाएँ होती हैं?", mr: "षटकोनाला किती बाजू असतात?" }, options: { en: ["5", "6", "7", "8"], hi: ["5", "6", "7", "8"], mr: ["5", "6", "7", "8"] }, correct: 1, explanation: { en: "A hexagon has 6 sides.", hi: "षट्कोण में 6 भुजाएँ होती हैं.", mr: "षटकोनाला 6 बाजू असतात." } },
    { id: 5, question: { en: "Which gas do plants absorb during photosynthesis?", hi: "प्रकाश संश्लेषण के दौरान पौधे कौन सी गैस अवशोषित करते हैं?", mr: "प्रकाशसंश्लेषणादरम्यान वनस्पती कोणती वायू शोषून घेतात?" }, options: { en: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], hi: ["ऑक्सीजन", "नाइट्रोजन", "कार्बन डाइऑक्साइड", "हाइड्रोजन"], mr: ["ऑक्सिजन", "नायट्रोजन", "कार्बन डायऑक्साइड", "हायड्रोजन"] }, correct: 2, explanation: { en: "Plants take in Carbon Dioxide to make food.", hi: "पौधे भोजन बनाने के लिए कार्बन डाइऑक्साइड लेते हैं.", mr: "वनस्पती अन्न तयार करण्यासाठी कार्बन डायऑक्साइड शोषतात." } },
    { id: 6, question: { en: "If 1 kg = 1000 grams, how many grams are in 3.5 kg?", hi: "यदि 1 kg = 1000 ग्राम, तो 3.5 kg में कितने ग्राम होंगे?", mr: "जर 1 kg = 1000 ग्रॅम, तर 3.5 kg मध्ये किती ग्रॅम असतात?" }, options: { en: ["3000g", "3500g", "3050g", "350g"], hi: ["3000g", "3500g", "3050g", "350g"], mr: ["3000g", "3500g", "3050g", "350g"] }, correct: 1, explanation: { en: "3.5 x 1000 = 3500 grams.", hi: "3.5 x 1000 = 3500 ग्राम.", mr: "3.5 x 1000 = 3500 ग्रॅम." } },
    { id: 7, question: { en: "Complete the pattern: 2, 4, 8, 16, __", hi: "पैटर्न पूरा करें: 2, 4, 8, 16, __", mr: "पॅटर्न पूर्ण करा: 2, 4, 8, 16, __" }, options: { en: ["20", "24", "32", "64"], hi: ["20", "24", "32", "64"], mr: ["20", "24", "32", "64"] }, correct: 2, explanation: { en: "Each number is multiplied by 2. 16 x 2 = 32.", hi: "प्रत्येक संख्या को 2 से गुणा किया जाता है. 16 x 2 = 32.", mr: "प्रत्येक संख्याला 2 ने गुणले आहे. 16 x 2 = 32." } },
    { id: 8, question: { en: "Which organ controls all functions of the human body?", hi: "मानव शरीर के सभी कार्यों को कौन सा अंग नियंत्रित करता है?", mr: "मानवी शरीराची सर्व कार्ये कोणता अवयव नियंत्रित करतो?" }, options: { en: ["Heart", "Lungs", "Brain", "Stomach"], hi: ["हृदय", "फेफड़े", "मस्तिष्क", "पेट"], mr: ["हृदय", "फुफ्फुस", "मेंदू", "पोट"] }, correct: 2, explanation: { en: "The brain is the control center of the body.", hi: "मस्तिष्क शरीर का नियंत्रण केंद्र है.", mr: "मेंदू हा शरीराचा नियंत्रण केंद्र आहे." } },
    { id: 9, question: { en: "Antonym of 'ANCIENT' is:", hi: "'ANCIENT' (प्राचीन) का विलोम शब्द है:", mr: "'ANCIENT' (प्राचीन) चा विरुद्धार्थी शब्द:" }, options: { en: ["Old", "Modern", "Historic", "Past"], hi: ["पुराना", "आधुनिक", "ऐतिहासिक", "अतीत"], mr: ["जुना", "आधुनिक", "ऐतिहासिक", "भूतकाळ"] }, correct: 1, explanation: { en: "Modern is the opposite of Ancient.", hi: "प्राचीन का विलोम आधुनिक है.", mr: "प्राचीनच्या विरुद्ध आधुनिक आहे." } },
    { id: 10, question: { en: "How many hours are there in 2 days?", hi: "2 दिनों में कितने घंटे होते हैं?", mr: "2 दिवसांत किती तास असतात?" }, options: { en: ["24", "36", "48", "60"], hi: ["24", "36", "48", "60"], mr: ["24", "36", "48", "60"] }, correct: 2, explanation: { en: "24 hours/day x 2 = 48 hours.", hi: "24 घंटे/दिन x 2 = 48 घंटे.", mr: "24 तास/दिवस x 2 = 48 तास." } }
  ],
  CLASS_6_8: [
    { id: 1, question: { en: "Simplify: (-12) + (-8) - (-10)", hi: "सरल करें: (-12) + (-8) - (-10)", mr: "सोपे करा: (-12) + (-8) - (-10)" }, options: { en: ["-10", "-30", "10", "0"], hi: ["-10", "-30", "10", "0"], mr: ["-10", "-30", "10", "0"] }, correct: 0, explanation: { en: "-12 - 8 + 10 = -10.", hi: "-12 - 8 + 10 = -10.", mr: "-12 - 8 + 10 = -10." } },
    { id: 2, question: { en: "Which planet is known as the Red Planet?", hi: "किस ग्रह को लाल ग्रह के रूप में जाना जाता है?", mr: "कोणत्या ग्रहाला लाल ग्रह म्हणून ओळखले जाते?" }, options: { en: ["Venus", "Mars", "Jupiter", "Saturn"], hi: ["शुक्र", "मंगल", "बृहस्पति", "शनि"], mr: ["शुक्र", "मंगळ", "गुरू", "शनी"] }, correct: 1, explanation: { en: "Mars appears red due to iron oxide on its surface.", hi: "मंगल अपनी सतह पर आयरन ऑक्साइड के कारण लाल दिखाई देता है.", mr: "मंगळाच्या पृष्ठभागावर आयर्न ऑक्साईड असल्यामुळे तो लाल दिसतो." } },
    { id: 3, question: { en: "Identify the pronoun in: 'She sings melodiously.'", hi: "'She sings melodiously.' में सर्वनाम पहचानिए:", mr: "'She sings melodiously.' मधील सर्वनाम ओळखा:" }, options: { en: ["She", "Sings", "Melodiously", "None"], hi: ["She", "Sings", "Melodiously", "कोई नहीं"], mr: ["She", "Sings", "Melodiously", "काहीही नाही"] }, correct: 0, explanation: { en: "'She' is a pronoun.", hi: "'She' एक सर्वनाम है.", mr: "'She' हे सर्वनाम आहे." } },
    { id: 4, question: { en: "What is the square root of 144?", hi: "144 का वर्गमूल क्या है?", mr: "144 चे वर्गमूळ किती आहे?" }, options: { en: ["11", "12", "14", "16"], hi: ["11", "12", "14", "16"], mr: ["11", "12", "14", "16"] }, correct: 1, explanation: { en: "12 x 12 = 144.", hi: "12 x 12 = 144.", mr: "12 x 12 = 144." } },
    { id: 5, question: { en: "Which light color bends the most through a glass prism?", hi: "कांच के प्रिज्म से गुजरने पर कौन सा प्रकाश सबसे अधिक झुकता है?", mr: "काचेच्या प्रिझममधून जाताना कोणता प्रकाश सर्वात जास्त वाकतो?" }, options: { en: ["Red", "Yellow", "Violet", "Green"], hi: ["लाल", "पीला", "बैंगनी", "हरा"], mr: ["लाल", "पिवळा", "जांभळा", "हिरवा"] }, correct: 2, explanation: { en: "Violet light has the shortest wavelength and bends the most.", hi: "बैंगनी प्रकाश की तरंग दैर्ध्य सबसे कम होती है और यह सबसे अधिक झुकता है.", mr: "जांभळ्या प्रकाशाची तरंग लांबी सर्वात कमी असते आणि तो सर्वात जास्त वाकतो." } },
    { id: 6, question: { en: "An angle measuring 90° is called:", hi: "90° माप वाले कोण को क्या कहते हैं:", mr: "90° च्या कोनाला काय म्हणतात:" }, options: { en: ["Acute Angle", "Obtuse Angle", "Right Angle", "Reflex Angle"], hi: ["न्यून कोण", "अधिक कोण", "समकोण", "प्रतिवर्ती कोण"], mr: ["लघूकोन", "विशालकोन", "काटकोन", "प्रविशालकोन"] }, correct: 2, explanation: { en: "A 90-degree angle is a Right Angle.", hi: "90 डिग्री का कोण समकोण होता है.", mr: "90 अंशाचा कोन हा काटकोन असतो." } },
    { id: 7, question: { en: "Which is the smallest prime number?", hi: "सबसे छोटी अभाज्य संख्या कौन सी है?", mr: "सर्वात लहान मूळ संख्या कोणती आहे?" }, options: { en: ["0", "1", "2", "3"], hi: ["0", "1", "2", "3"], mr: ["0", "1", "2", "3"] }, correct: 2, explanation: { en: "2 is the smallest prime number.", hi: "2 सबसे छोटी अभाज्य संख्या है.", mr: "2 ही सर्वात लहान मूळ संख्या आहे." } },
    { id: 8, question: { en: "Chemical symbol for Sodium is:", hi: "सोडियम का रासायनिक प्रतीक है:", mr: "सोडियमचे रासायनिक चिन्ह काय आहे:" }, options: { en: ["So", "Na", "Sd", "S"], hi: ["So", "Na", "Sd", "S"], mr: ["So", "Na", "Sd", "S"] }, correct: 1, explanation: { en: "Sodium symbol is Na.", hi: "सोडियम का प्रतीक Na है.", mr: "सोडियमचे चिन्ह Na आहे." } },
    { id: 9, question: { en: "Find the average of 10, 20, 30, 40, and 50:", hi: "10, 20, 30, 40 और 50 का औसत ज्ञात कीजिए:", mr: "10, 20, 30, 40 आणि 50 ची सरासरी काढा:" }, options: { en: ["25", "30", "35", "40"], hi: ["25", "30", "35", "40"], mr: ["25", "30", "35", "40"] }, correct: 1, explanation: { en: "Sum = 150 / 5 = 30.", hi: "योग = 150 / 5 = 30.", mr: "बेरीज = 150 / 5 = 30." } },
    { id: 10, question: { en: "Which instrument measures atmospheric pressure?", hi: "वायुमंडलीय दबाव किस यंत्र से मापा जाता है?", mr: "वातावरणीय दाब कोणत्या उपकरणाने मोजला जातो?" }, options: { en: ["Thermometer", "Barometer", "Ammeter", "Speedometer"], hi: ["थर्मामीटर", "बैरोमीटर", "एमीटर", "स्पीडोमीटर"], mr: ["थर्मामीटर", "बॅरोमीटर", "अॅमीटर", "स्पीडोमीटर"] }, correct: 1, explanation: { en: "Barometers measure atmospheric pressure.", hi: "बैरोमीटर वायुमंडलीय दबाव मापता है.", mr: "बॅरोमीटर वातावरणीय दाब मोजतो." } }
  ],
  CLASS_9_10: [
    { id: 1, question: { en: "If a train travels 240 km in 4 hours, what is its average speed?", hi: "यदि एक ट्रेन 4 घंटे में 240 किमी चलती है, तो उसकी औसत गति क्या है?", mr: "जर ट्रेन 4 तासांत 240 किमी अंतर पार करते, तर तिचा सरासरी वेग किती?" }, options: { en: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"], hi: ["50 किमी/घंटा", "60 किमी/घंटा", "70 किमी/घंटा", "80 किमी/घंटा"], mr: ["50 किमी/तास", "60 किमी/तास", "70 किमी/तास", "80 किमी/तास"] }, correct: 1, explanation: { en: "Speed = Distance/Time = 240/4 = 60 km/h.", hi: "गति = दूरी/समय = 240/4 = 60 किमी/घंटा.", mr: "वेग = अंतर/वेळ = 240/4 = 60 किमी/तास." } },
    { id: 2, question: { en: "Which organ in the human body filters blood to produce urine?", hi: "मानव शरीर में कौन सा अंग रक्त को छानकर मूत्र बनाता है?", mr: "मानवी शरीरातील कोणता अवयव रक्ताचे गाळण करून मूत्र तयार करतो?" }, options: { en: ["Heart", "Lungs", "Kidney", "Liver"], hi: ["हृदय", "फेफड़े", "गुर्दा (किडनी)", "यकृत"], mr: ["हृदय", "फुफ्फुस", "मूत्रपिंड (किडनी)", "यकृत"] }, correct: 2, explanation: { en: "Kidneys filter waste products from the blood.", hi: "गुर्दे रक्त से अपशिष्ट उत्पादों को फ़िल्टर करते हैं.", mr: "मूत्रपिंड रक्तातील टाकाऊ पदार्थ गाळतात." } },
    { id: 3, question: { en: "Select the synonym for 'PERSISTENT':", hi: "'PERSISTENT' का पर्यायवाची चुनें:", mr: "'PERSISTENT' चा समानार्थी शब्द निवडा:" }, options: { en: ["Temporary", "Determined", "Lazy", "Uncertain"], hi: ["अस्थाई", "दृढ़/संकल्पित", "आलसी", "अनिश्चित"], mr: ["अस्थायी", "निश्चयी / दृढ", "आळशी", "अनिश्चित"] }, correct: 1, explanation: { en: "Persistent means continuing firmly.", hi: "Persistent का अर्थ है दृढ़ता से लगे रहना.", mr: "Persistent म्हणजे दृढ निश्चयाने टिकून राहणे." } },
    { id: 4, question: { en: "What is the pH value of pure distilled water?", hi: "शुद्ध आसुत जल का pH मान कितना होता है?", mr: "शुद्ध डिस्टिल्ड पाण्याचा pH मान किती असतो?" }, options: { en: ["5", "7", "9", "14"], hi: ["5", "7", "9", "14"], mr: ["5", "7", "9", "14"] }, correct: 1, explanation: { en: "Pure water is neutral with a pH of 7.", hi: "शुद्ध पानी 7 के pH के साथ तटस्थ होता है.", mr: "शुद्ध पाणी 7 pH सह तटस्थ असते." } },
    { id: 5, question: { en: "Value of sin(30°) is:", hi: "sin(30°) का मान है:", mr: "sin(30°) चे मूल्य किती आहे:" }, options: { en: ["0", "1/2", "1/√2", "1"], hi: ["0", "1/2", "1/√2", "1"], mr: ["0", "1/2", "1/√2", "1"] }, correct: 1, explanation: { en: "sin(30°) = 0.5 or 1/2.", hi: "sin(30°) = 0.5 या 1/2.", mr: "sin(30°) = 0.5 किंवा 1/2." } },
    { id: 6, question: { en: "Unit of electrical resistance is:", hi: "विद्युत प्रतिरोध की इकाई है:", mr: "विद्युत रोधाचे (Resistance) एकक काय आहे:" }, options: { en: ["Volt", "Ampere", "Ohm", "Watt"], hi: ["वोल्ट", "एम्पीयर", "ओम", "वाट"], mr: ["व्होल्ट", "अँपिअर", "ओम", "वॉट"] }, correct: 2, explanation: { en: "Resistance is measured in Ohms (Ω).", hi: "प्रतिरोध को ओम (Ω) में मापा जाता है.", mr: "रोध ओम (Ω) मध्ये मोजला जातो." } },
    { id: 7, question: { en: "Which metal is liquid at room temperature?", hi: "कमरे के तापमान पर कौन सी धातु तरल होती है?", mr: "खोलीच्या तापमानाला कोणती धातू द्रव अवस्थेत असते?" }, options: { en: ["Mercury", "Sodium", "Lead", "Aluminum"], hi: ["पारा (मर्करी)", "सोडियम", "लेड", "एल्युमिनियम"], mr: ["पारा (मर्क्यूरी)", "सोडियम", "लेड", "ॲल्युमिनियम"] }, correct: 0, explanation: { en: "Mercury (Hg) is liquid at room temperature.", hi: "पारा कमरे के तापमान पर तरल होता है.", mr: "पारा खोलीच्या तापमानाला द्रव असतो." } },
    { id: 8, question: { en: "Quadratic equation x² - 9 = 0 has roots:", hi: "द्विघात समीकरण x² - 9 = 0 के मूल हैं:", mr: "द्विघाती समीकरण x² - 9 = 0 ची मुळे काय आहेत:" }, options: { en: ["±3", "±9", "3 only", "9 only"], hi: ["±3", "±9", "केवल 3", "केवल 9"], mr: ["±3", "±9", "फक्त 3", "फक्त 9"] }, correct: 0, explanation: { en: "x² = 9 => x = +3 and -3.", hi: "x² = 9 => x = +3 और -3.", mr: "x² = 9 => x = +3 आणि -3." } },
    { id: 9, question: { en: "Who formulated the Laws of Motion?", hi: "गति के नियमों का प्रतिपादन किसने किया?", mr: "गतीचे नियम कोणी मांडले?" }, options: { en: ["Albert Einstein", "Isaac Newton", "Galileo Galilei", "Nikola Tesla"], hi: ["अल्बर्ट आइंस्टीन", "आइजैक न्यूटन", "गैलीलियो गैलीली", "निकोला टेस्ला"], mr: ["अल्बर्ट आइनस्टाइन", "आयझॅक न्यूटन", "गॅलीलियो गॅिलेली", "निकोला टेस्ला"] }, correct: 1, explanation: { en: "Sir Isaac Newton formulated the three laws of motion.", hi: "सर आइजैक न्यूटन ने गति के तीन नियम प्रतिपादित किए.", mr: "सर आयझॅक न्यूटन यांनी गतीचे तीन नियम प्रतिपादित केले." } },
    { id: 10, question: { en: "Find HCF of 24 and 36:", hi: "24 और 36 का HCF ज्ञात कीजिए:", mr: "24 आणि 36 चा मसावी (HCF) काढा:" }, options: { en: ["6", "8", "12", "18"], hi: ["6", "8", "12", "18"], mr: ["6", "8", "12", "18"] }, correct: 2, explanation: { en: "12 is the highest common factor of 24 and 36.", hi: "24 और 36 का महत्तम समापवर्तक 12 है.", mr: "24 आणि 36 चा सर्वात मोठा सामायिक विभाषक 12 आहे." } }
  ],
  CLASS_11_12: [
    { id: 1, question: { en: "Derivative of sin(x) with respect to x is:", hi: "x के सापेक्ष sin(x) का अवकलज (derivative) है:", mr: "x च्या संदर्भात sin(x) चा डेरिव्हेटिव्ह काय आहे:" }, options: { en: ["-cos(x)", "cos(x)", "tan(x)", "-sin(x)"], hi: ["-cos(x)", "cos(x)", "tan(x)", "-sin(x)"], mr: ["-cos(x)", "cos(x)", "tan(x)", "-sin(x)"] }, correct: 1, explanation: { en: "d/dx(sin x) = cos x.", hi: "d/dx(sin x) = cos x.", mr: "d/dx(sin x) = cos x." } },
    { id: 2, question: { en: "SI unit of Electric Charge is:", hi: "विद्युत आवेश (Electric Charge) की SI इकाई है:", mr: "विद्युत चार्जचे SI एकक काय आहे:" }, options: { en: ["Farad", "Coulomb", "Tesla", "Weber"], hi: ["फैराड", "कूलम्ब", "टेस्ला", "वेबर"], mr: ["फॅरड", "कुलॉम्ब", "टेस्ला", "वेबर"] }, correct: 1, explanation: { en: "Charge is measured in Coulombs (C).", hi: "आवेश को कूलम्ब (C) में मापा जाता है.", mr: "चार्ज कुलॉम्ब (C) मध्ये मोजला जातो." } },
    { id: 3, question: { en: "Which gas obeys PV = nRT under ideal conditions?", hi: "आदर्श परिस्थितियों में कौन सी गैस PV = nRT का पालन करती है?", mr: "आदर्श परिस्थितीत कोणती वायू PV = nRT चे पालन करते?" }, options: { en: ["Ideal Gas", "Real Gas", "Noble Gas", "Heavy Gas"], hi: ["आदर्श गैस", "वास्तविक गैस", "उत्कृष्ट गैस", "भारी गैस"], mr: ["आदर्श वायू", "वास्तविक वायू", "उत्कृष्ट वायू", "जड वायू"] }, correct: 0, explanation: { en: "Ideal gases strictly follow the Ideal Gas Law.", hi: "आदर्श गैसें आदर्श गैस नियम का सख्ती से पालन करती हैं.", mr: "आदर्श वायू आदर्श वायू नियमाचे तंतोतंत पालन करतात." } },
    { id: 4, question: { en: "Oxidation state of Oxygen in H₂O is:", hi: "H₂O में ऑक्सीजन की ऑक्सीकरण अवस्था है:", mr: "H₂O मधील ऑक्सिजनची ऑक्सिडेशन स्टेट काय आहे:" }, options: { en: ["+2", "-2", "-1", "0"], hi: ["+2", "-2", "-1", "0"], mr: ["+2", "-2", "-1", "0"] }, correct: 1, explanation: { en: "In H₂O, Oxygen is -2.", hi: "H₂O में ऑक्सीजन -2 है.", mr: "H₂O मध्ये ऑक्सिजन -2 आहे." } },
    { id: 5, question: { en: "If log₁₀(x) = 3, then x equals:", hi: "यदि log₁₀(x) = 3, तो x का मान है:", mr: "जर log₁₀(x) = 3, तर x ची किंमत किती:" }, options: { en: ["30", "100", "1000", "3000"], hi: ["30", "100", "1000", "3000"], mr: ["30", "100", "1000", "3000"] }, correct: 2, explanation: { en: "x = 10³ = 1000.", hi: "x = 10³ = 1000.", mr: "x = 10³ = 1000." } },
    { id: 6, question: { en: "Work done by a force when displacement is perpendicular to force:", hi: "बल द्वारा किया गया कार्य जब विस्थापन बल के लंबवत हो:", mr: "जेव्हा विस्थापन बलाशी लंब असते तेव्हा बलाद्वारे केलेले कार्य:" }, options: { en: ["Maximum", "Zero", "Negative", "Infinite"], hi: ["अधिकतम", "शून्य", "ऋणात्मक", "अनंत"], mr: ["कमाल", "शून्य", "ऋणात्मक", "अनंत"] }, correct: 1, explanation: { en: "W = F·d·cos(90°) = 0.", hi: "W = F·d·cos(90°) = 0.", mr: "W = F·d·cos(90°) = 0." } },
    { id: 7, question: { en: "Which structure produces ribosomes in a cell?", hi: "कोशिका में कौन सी संरचना राइबोसोम का उत्पादन करती है?", mr: "पेशीमध्ये कोणती रचना रायबोसोम तयार करते?" }, options: { en: ["Mitochondria", "Nucleolus", "Golgi Body", "Lysosome"], hi: ["माइटोकॉन्ड्रिया", "केंद्रिका (Nucleolus)", "गोल्गी बॉडी", "लाइसोसोम"], mr: ["मायटोकाँड्रिया", "न्युक्लिओलस (केंद्रिका)", "गोल्गी बॉडी", "लायसोसोम"] }, correct: 1, explanation: { en: "The nucleolus synthesizes ribosomes.", hi: "केंद्रिका राइबोसोम का संश्लेषण करती है.", mr: "न्युक्लिओलस रायबोसोमचे संश्लेषण करते." } },
    { id: 8, question: { en: "Integral of 1/x dx is:", hi: "1/x dx का समाकलन (integral) है:", mr: "1/x dx चे समाकलन (integral) काय आहे:" }, options: { en: ["x²", "ln|x| + C", "eˣ", "1/x²"], hi: ["x²", "ln|x| + C", "eˣ", "1/x²"], mr: ["x²", "ln|x| + C", "eˣ", "1/x²"] }, correct: 1, explanation: { en: "∫(1/x)dx = ln|x| + C.", hi: "∫(1/x)dx = ln|x| + C.", mr: "∫(1/x)dx = ln|x| + C." } },
    { id: 9, question: { en: "Light year is a unit of:", hi: "प्रकाश वर्ष किसकी इकाई है:", mr: "प्रकाश वर्ष कशाचे एकक आहे:" }, options: { en: ["Time", "Distance", "Speed", "Intensity"], hi: ["समय", "दूरी", "गति", "तीव्रता"], mr: ["वेळ", "अंतर", "वेग", "प्रखरता"] }, correct: 1, explanation: { en: "Light year measures astronomical distance.", hi: "प्रकाश वर्ष खगोलीय दूरी को मापता है.", mr: "प्रकाश वर्ष खगोलीय अंतर मोजतो." } },
    { id: 10, question: { en: "Which element has highest electronegativity?", hi: "किस तत्व की विद्युत ऋणात्मकता (electronegativity) सबसे अधिक है?", mr: "कोणत्या मूलद्रव्याची विद्युत ऋणात्मकता (electronegativity) सर्वात जास्त आहे?" }, options: { en: ["Fluorine", "Chlorine", "Oxygen", "Nitrogen"], hi: ["फ्लोरिन", "क्लोरीन", "ऑक्सीजन", "नाइट्रोजन"], mr: ["फ्लुरिन", "क्लोरीन", "ऑक्सिजन", "नायट्रोजन"] }, correct: 0, explanation: { en: "Fluorine has the highest electronegativity.", hi: "फ्लोरिन की विद्युत ऋणात्मकता सबसे अधिक है.", mr: "फ्लुरिनची विद्युत ऋणात्मकता सर्वात जास्त आहे." } }
  ],
  COMPETITIVE: [
    { id: 1, question: { en: "If A can do a job in 10 days and B in 15 days, together they complete it in:", hi: "यदि A किसी काम को 10 दिन में और B 15 दिन में कर सकता है, तो दोनों मिलकर इसे कितने दिन में पूरा करेंगे:", mr: "जर A एक काम 10 दिवसांत आणि B 15 दिवसांत करू शकत असेल, तर दोघे मिळून ते किती दिवसांत पूर्ण करतील:" }, options: { en: ["5 days", "6 days", "8 days", "12 days"], hi: ["5 दिन", "6 दिन", "8 दिन", "12 दिन"], mr: ["5 दिवस", "6 दिवस", "8 दिवस", "12 दिवस"] }, correct: 1, explanation: { en: "Work rate = 1/10 + 1/15 = 1/6 => 6 days.", hi: "कार्य दर = 1/10 + 1/15 = 1/6 => 6 दिन.", mr: "काम दर = 1/10 + 1/15 = 1/6 => 6 दिवस." } },
    { id: 2, question: { en: "Capital of Maharashtra is:", hi: "महाराष्ट्र की राजधानी है:", mr: "महाराष्ट्राची राजधानी कोणती आहे:" }, options: { en: ["Pune", "Nagpur", "Mumbai", "Chhatrapati Sambhajinagar"], hi: ["पुणे", "नागपुर", "मुंबई", "छत्रपति संभाजीनगर"], mr: ["पुणे", "नागपूर", "मुंबई", "छत्रपती संभाजीनगर"] }, correct: 2, explanation: { en: "Mumbai is the state capital.", hi: "मुंबई राज्य की राजधानी है.", mr: "मुंबई ही राज्याची राजधानी आहे." } },
    { id: 3, question: { en: "Who is known as the Father of the Indian Constitution?", hi: "भारतीय संविधान के पिता के रूप में किसे जाना जाता है?", mr: "भारतीय संविधानाचे जनक म्हणून कोणाला ओळखले जाते?" }, options: { en: ["Mahatma Gandhi", "Dr. B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"], hi: ["महात्मा गांधी", "डॉ. बी.आर. अम्बेडकर", "जवाहरलाल नेहरू", "सरदार पटेल"], mr: ["महात्मा गांधी", "डॉ. बी. आर. आंबेडकर", "जवाहरलाल नेहरू", "सरदार पटेल"] }, correct: 1, explanation: { en: "Dr. B.R. Ambedkar chaired the drafting committee.", hi: "डॉ. बी.आर. अम्बेडकर ने प्रारूप समिति की अध्यक्षता की.", mr: "डॉ. बी. आर. आंबेडकर यांनी मसुदा समितीचे अध्यक्षपद भूषवले." } },
    { id: 4, question: { en: "Simple interest on ₹5000 at 10% per annum for 2 years is:", hi: "₹5000 पर 10% वार्षिक ब्याज की दर से 2 वर्षों का साधारण ब्याज है:", mr: "₹5000 वर दरसाल 10% ने 2 वर्षांचे सरळ व्याज किती होईल:" }, options: { en: ["₹500", "₹1000", "₹1200", "₹1500"], hi: ["₹500", "₹1000", "₹1200", "₹1500"], mr: ["₹500", "₹1000", "₹1200", "₹1500"] }, correct: 1, explanation: { en: "SI = (5000 x 10 x 2)/100 = ₹1000.", hi: "SI = (5000 x 10 x 2)/100 = ₹1000.", mr: "SI = (5000 x 10 x 2)/100 = ₹1000." } },
    { id: 5, question: { en: "Look at the series: 7, 10, 8, 11, 9, 12, __ What comes next?", hi: "श्रृंखला को देखें: 7, 10, 8, 11, 9, 12, __ अगला क्या होगा?", mr: "मालिका पहा: 7, 10, 8, 11, 9, 12, __ पुढे काय येईल?" }, options: { en: ["7", "10", "12", "13"], hi: ["7", "10", "12", "13"], mr: ["7", "10", "12", "13"] }, correct: 1, explanation: { en: "Series pattern (-2): 12 - 2 = 10.", hi: "श्रृंखला पैटर्न (-2): 12 - 2 = 10.", mr: "मालिका पॅटर्न (-2): 12 - 2 = 10." } },
    { id: 6, question: { en: "Which article of Indian Constitution deals with Equality before law?", hi: "भारतीय संविधान का कौन सा अनुच्छेद कानून के समक्ष समानता से संबंधित है?", mr: "भारतीय संविधानातील कोणते कलमानुसार कायद्यासमोर समानता दिलेली आहे?" }, options: { en: ["Article 12", "Article 14", "Article 19", "Article 21"], hi: ["अनुच्छेद 12", "अनुच्छेद 14", "अनुच्छेद 19", "अनुच्छेद 21"], mr: ["कलम 12", "कलम 14", "कलम 19", "कलम 21"] }, correct: 1, explanation: { en: "Article 14 guarantees equality before law.", hi: "अनुच्छेद 14 कानून के समक्ष समानता की गारंटी देता है.", mr: "कलम 14 कायद्यासमोर समानतेची हमी देते." } },
    { id: 7, question: { en: "Headquarters of Reserve Bank of India (RBI) is located in:", hi: "भारतीय रिजर्व बैंक (RBI) का मुख्यालय कहाँ स्थित है?", mr: "भारतीय रिझर्व्ह बँक (RBI) चे मुख्यालये कुठे आहे:" }, options: { en: ["New Delhi", "Mumbai", "Kolkata", "Chennai"], hi: ["नई दिल्ली", "मुंबई", "कोलकाता", "चेन्नई"], mr: ["नवी दिल्ली", "मुंबई", "कोलकाता", "चेन्नई"] }, correct: 1, explanation: { en: "RBI head office is in Mumbai.", hi: "RBI का मुख्य कार्यालय मुंबई में है.", mr: "RBI चे मुख्य कार्यालय मुंबईत आहे." } },
    { id: 8, question: { en: "If CAT = 24 and DOG = 26, then PIG = ?", hi: "यदि CAT = 24 और DOG = 26, तो PIG = ?", mr: "जर CAT = 24 आणि DOG = 26, तर PIG = ?" }, options: { en: ["32", "30", "36", "40"], hi: ["32", "30", "36", "40"], mr: ["32", "30", "36", "40"] }, correct: 0, explanation: { en: "P(16) + I(9) + G(7) = 32.", hi: "P(16) + I(9) + G(7) = 32.", mr: "P(16) + I(9) + G(7) = 32." } },
    { id: 9, question: { en: "Largest river basin in India is:", hi: "भारत में सबसे बड़ा नदी बेसिन है:", mr: "भारतातील सर्वात मोठे नदी खोरे कोणते आहे:" }, options: { en: ["Ganga", "Godavari", "Krishna", "Narmada"], hi: ["गंगा", "गोदावरी", "कृष्णा", "नर्मदा"], mr: ["गंगा", "गोदावरी", "कृष्णा", "नर्मदा"] }, correct: 0, explanation: { en: "Ganga basin is the largest.", hi: "गंगा बेसिन सबसे बड़ा है.", mr: "गंगा खोरे सर्वात मोठे आहे." } },
    { id: 10, question: { en: "Computer CPU stands for:", hi: "कंप्यूटर CPU का पूर्ण रूप है:", mr: "संगणक CPU चा अर्थ काय:" }, options: { en: ["Central Processing Unit", "Core Power Utility", "Central Performance Unit", "Control Program Unit"], hi: ["Central Processing Unit", "Core Power Utility", "Central Performance Unit", "Control Program Unit"], mr: ["Central Processing Unit", "Core Power Utility", "Central Performance Unit", "Control Program Unit"] }, correct: 0, explanation: { en: "CPU = Central Processing Unit.", hi: "CPU = Central Processing Unit.", mr: "CPU = Central Processing Unit." } }
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
            <span>EXAM ARCHITECTURE & MULTILINGUAL DEMO</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            How Students Take the Exam
          </h1>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-normal">
            Experience our full student portal journey across English, Hindi, and Marathi—from student login to live multi-tier testing, verified digital certificates, subject-wise analytics, and future growth roadmaps.
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
              <span className={`px-3 py-1 rounded-full ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>2. Class</span>
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
                  <span>Proceed to Select Class</span>
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
                <p className="text-xs text-slate-500">Choose a class category below to load a tailored 10-question practice test in {examLanguage.toUpperCase()}</p>
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
                <span>Start 10-Question Test ({examLanguage.toUpperCase()})</span>
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
                    Submit 10-Question Test
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

              {/* 1. VERIFIED CERTIFICATE OF COMPLETION */}
              <div className="bg-gradient-to-r from-blue-950 via-[#01295A] to-indigo-950 text-white p-8 md:p-12 rounded-3xl shadow-2xl text-center relative overflow-hidden border border-[#FE7C02]/30">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <span className="text-[10px] tracking-widest uppercase font-black text-[#FE7C02] bg-white/10 px-4 py-1.5 rounded-full border border-white/15">
                  TOPIQ Talent Test (TTT) Official Credential
                </span>
                <h3 className="text-3xl md:text-4xl font-black mt-6 mb-3">Certificate of Excellence</h3>
                <p className="text-xs md:text-sm text-slate-200 max-w-xl mx-auto mb-8 font-medium leading-relaxed">
                  This is proudly presented to <strong className="text-white underline">{studentName}</strong> for successfully completing the TOPIQ Talent Test (TTT) Sample Assessment in {examLanguage.toUpperCase()} mode.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-xs text-slate-300 border-t border-white/15 pt-6">
                  <div>Issued by: <strong className="text-white">TOPIQ Academic Board</strong></div>
                  <div>Status: <strong className="text-green-400">Verified & Authenticated</strong></div>
                </div>
                <div className="mt-8">
                  <button
                    onClick={() => window.print()}
                    className="px-8 py-3 bg-[#FE7C02] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-xl hover:bg-orange-600 transition cursor-pointer"
                  >
                    Download / Print Certificate
                  </button>
                </div>
              </div>

              {/* 2. OVERALL SCORECARD & 3. SUBJECT-WISE ANALYTICS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 shadow-md">
                  <h4 className="text-sm font-black text-[#01295A] mb-6 uppercase tracking-wider">Overall Scorecard</h4>
                  <div className="flex items-center justify-between p-5 bg-blue-900 text-white rounded-2xl mb-6 shadow-inner">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Total Score</span>
                    <span className="text-3xl font-black text-[#FE7C02]">{Math.round((calculateScore() / currentQuestions.length) * 100)}%</span>
                  </div>
                  <div className="space-y-3 text-xs font-bold text-slate-700">
                    <div className="flex justify-between p-2 bg-white rounded-xl border border-slate-200"><span>Correct Answers:</span> <strong className="text-green-600">{calculateScore()} / {currentQuestions.length}</strong></div>
                    <div className="flex justify-between p-2 bg-white rounded-xl border border-slate-200"><span>Time Taken:</span> <strong className="text-slate-900">03:45 mins</strong></div>
                    <div className="flex justify-between p-2 bg-white rounded-xl border border-slate-200"><span>Percentile Rank:</span> <strong className="text-blue-700">94th Percentile</strong></div>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 shadow-md">
                  <h4 className="text-sm font-black text-[#01295A] mb-6 uppercase tracking-wider">Subject-Wise Performance Analytics</h4>
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between text-xs font-black mb-1.5 text-slate-800">
                        <span>Logical Reasoning</span><span>90%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-[#01295A] h-full rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-black mb-1.5 text-slate-800">
                        <span>Quantitative Aptitude</span><span>80%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-[#FE7C02] h-full rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-black mb-1.5 text-slate-800">
                        <span>Conceptual Problem Solving</span><span>85%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. OVERVIEW FOR FUTURE GROWTH */}
              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 shadow-md">
                <h4 className="text-sm font-black text-[#01295A] mb-3 uppercase tracking-wider">Overview for Future Growth</h4>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium mb-6">
                  Based on your sample assessment performance, your logical foundation and cognitive processing speed are strong. To maximize future growth during the 100-Day Challenge, we recommend adhering to daily 40-minute practice sessions and maintaining steady focus on multi-disciplinary analytical problem solving.
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 bg-[#01295A] text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-blue-900 transition shadow cursor-pointer"
                  >
                    Retake Demo Exam
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