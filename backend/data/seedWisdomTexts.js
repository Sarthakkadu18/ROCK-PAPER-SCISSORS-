const WisdomText = require('../models/WisdomText');

const wisdomTexts = [
  // BHAGAVAD GITA
  {
    source: 'bhagavad_gita',
    sourceDisplayName: 'Bhagavad Gita',
    tradition: 'hinduism',
    book: 'Chapter 2',
    chapter: '2',
    verse: '47',
    originalText: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
    originalLanguage: 'sanskrit',
    translations: {
      english: 'You have a right to perform your prescribed duty, but not to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.',
      hindi: 'तुम्हारा अधिकार केवल कर्म में है, फल में कभी नहीं। कर्म के फल का कारण अपने को मत मानो और अकर्म में भी आसक्ति न रखो।'
    },
    speaker: 'Krishna',
    audience: 'Arjuna',
    context: 'During the great battle of Kurukshetra, when Arjuna was overwhelmed by duty and moral conflict',
    situation: 'Arjuna was confused about fighting in the war against his own relatives and teachers',
    primaryThemes: ['duty', 'detachment', 'work', 'anxiety', 'dharma'],
    emotionalKeywords: [
      { emotion: 'anxious', relevanceScore: 9 },
      { emotion: 'overwhelmed', relevanceScore: 8 },
      { emotion: 'confused', relevanceScore: 8 },
      { emotion: 'stressed', relevanceScore: 7 }
    ],
    problemCategories: ['work_stress', 'moral_dilemma', 'decision_making', 'career_confusion'],
    keywords: ['duty', 'action', 'detachment', 'results', 'work', 'dharma']
  },
  {
    source: 'bhagavad_gita',
    sourceDisplayName: 'Bhagavad Gita',
    tradition: 'hinduism',
    book: 'Chapter 2',
    chapter: '2',
    verse: '14',
    originalText: 'मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः। आगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत॥',
    originalLanguage: 'sanskrit',
    translations: {
      english: 'O son of Kunti, the contact between the senses and sense objects gives rise to fleeting perceptions of happiness and distress. These are impermanent, and come and go like the winter and summer seasons. O descendant of Bharata, one must learn to tolerate them without being disturbed.',
      hindi: 'हे कुन्तीपुत्र! सर्दी-गर्मी और सुख-दुःख देने वाले इन्द्रिय और विषयों के संयोग तो आने-जाने वाले और अनित्य हैं, इसलिए हे भारत! इनको सहन कर।'
    },
    speaker: 'Krishna',
    audience: 'Arjuna',
    context: 'Teaching about the temporary nature of worldly experiences',
    situation: 'Explaining how to deal with life\'s ups and downs',
    primaryThemes: ['patience', 'perseverance', 'detachment', 'inner-peace', 'emotional-balance'],
    emotionalKeywords: [
      { emotion: 'sad', relevanceScore: 8 },
      { emotion: 'disappointed', relevanceScore: 7 },
      { emotion: 'hurt', relevanceScore: 7 },
      { emotion: 'overwhelmed', relevanceScore: 6 }
    ],
    problemCategories: ['emotional_instability', 'life_challenges', 'change_and_transition'],
    keywords: ['temporary', 'seasons', 'endurance', 'patience', 'impermanent']
  },
  {
    source: 'bhagavad_gita',
    sourceDisplayName: 'Bhagavad Gita',
    tradition: 'hinduism',
    book: 'Chapter 6',
    chapter: '6',
    verse: '5',
    originalText: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्। आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥',
    originalLanguage: 'sanskrit',
    translations: {
      english: 'One must elevate oneself by one\'s own mind, not degrade oneself. The mind is the friend of the conditioned soul, and his enemy as well.',
      hindi: 'अपने द्वारा अपना उद्धार करना चाहिए, अपना पतन नहीं करना चाहिए क्योंकि यह आत्मा ही आत्मा का मित्र है और यही आत्मा ही आत्मा का शत्रु है।'
    },
    speaker: 'Krishna',
    audience: 'Arjuna',
    context: 'Teaching about self-discipline and mental control',
    situation: 'Explaining the importance of self-improvement and mental mastery',
    primaryThemes: ['self-realization', 'mental-clarity', 'self-improvement', 'inner-strength'],
    emotionalKeywords: [
      { emotion: 'self-doubt', relevanceScore: 9 },
      { emotion: 'depressed', relevanceScore: 8 },
      { emotion: 'hopeless', relevanceScore: 7 },
      { emotion: 'confident', relevanceScore: 8 }
    ],
    problemCategories: ['self_doubt', 'depression', 'personal_growth'],
    keywords: ['self-elevation', 'mind', 'friend', 'enemy', 'self-control']
  },

  // QURAN
  {
    source: 'quran',
    sourceDisplayName: 'Holy Quran',
    tradition: 'islam',
    book: 'Surah Al-Baqarah',
    chapter: '2',
    verse: '286',
    originalText: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
    originalLanguage: 'arabic',
    translations: {
      english: 'Allah does not burden a soul beyond that it can bear.',
      hindi: 'अल्लाह किसी भी आत्मा पर उसकी सामर्थ्य से अधिक बोझ नहीं डालता।',
      arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا'
    },
    speaker: 'Allah',
    audience: 'All believers',
    context: 'Divine assurance about human capacity and divine mercy',
    situation: 'Comforting believers about life\'s challenges and their ability to overcome them',
    primaryThemes: ['hope', 'divine-connection', 'strength', 'faith', 'perseverance'],
    emotionalKeywords: [
      { emotion: 'overwhelmed', relevanceScore: 10 },
      { emotion: 'hopeless', relevanceScore: 9 },
      { emotion: 'anxious', relevanceScore: 8 },
      { emotion: 'stressed', relevanceScore: 8 }
    ],
    problemCategories: ['overwhelming_challenges', 'despair', 'faith_crisis'],
    keywords: ['burden', 'capacity', 'divine_mercy', 'strength', 'endurance']
  },
  {
    source: 'quran',
    sourceDisplayName: 'Holy Quran',
    tradition: 'islam',
    book: 'Surah Ash-Sharh',
    chapter: '94',
    verse: '5-6',
    originalText: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    originalLanguage: 'arabic',
    translations: {
      english: 'So indeed, with hardship comes ease. Indeed, with hardship comes ease.',
      hindi: 'निश्चय ही कठिनाई के साथ आसानी है। निश्चय ही कठिनाई के साथ आसानी है।',
      arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا إِنَّ مَعَ الْعُسْرِ يُسْرًا'
    },
    speaker: 'Allah',
    audience: 'Prophet Muhammad and all believers',
    context: 'Divine promise of relief after difficulty',
    situation: 'Encouraging patience during hardships with promise of relief',
    primaryThemes: ['hope', 'patience', 'faith', 'perseverance', 'divine-mercy'],
    emotionalKeywords: [
      { emotion: 'hopeless', relevanceScore: 10 },
      { emotion: 'sad', relevanceScore: 9 },
      { emotion: 'depressed', relevanceScore: 9 },
      { emotion: 'hopeful', relevanceScore: 10 }
    ],
    problemCategories: ['depression', 'hopelessness', 'life_challenges', 'grief'],
    keywords: ['hardship', 'ease', 'relief', 'patience', 'hope']
  },

  // BIBLE - NEW TESTAMENT
  {
    source: 'bible',
    sourceDisplayName: 'Holy Bible',
    tradition: 'christianity',
    book: 'Matthew',
    chapter: '6',
    verse: '26',
    originalText: 'Look at the birds of the air; they do not sow or reap or store away in barns, and yet your heavenly Father feeds them. Are you not much more valuable than they?',
    originalLanguage: 'greek',
    translations: {
      english: 'Look at the birds of the air; they do not sow or reap or store away in barns, and yet your heavenly Father feeds them. Are you not much more valuable than they?',
      hindi: 'आकाश के पक्षियों को देखो: वे न बोते हैं, न काटते हैं, और न खलिहानों में इकट्ठा करते हैं; फिर भी तुम्हारा स्वर्गीय पिता उन्हें खिलाता है। क्या तुम उनसे अधिक मूल्यवान नहीं हो?'
    },
    speaker: 'Jesus Christ',
    audience: 'Disciples and followers',
    context: 'Sermon on the Mount, teaching about trust in divine providence',
    situation: 'Teaching about freedom from anxiety and worry about material needs',
    primaryThemes: ['faith', 'divine-connection', 'trust', 'peace', 'anxiety'],
    emotionalKeywords: [
      { emotion: 'worried', relevanceScore: 10 },
      { emotion: 'anxious', relevanceScore: 9 },
      { emotion: 'fearful', relevanceScore: 8 },
      { emotion: 'peaceful', relevanceScore: 9 }
    ],
    problemCategories: ['financial_problems', 'anxiety', 'worry', 'trust_issues'],
    keywords: ['birds', 'provision', 'worry', 'value', 'heavenly_father']
  },
  {
    source: 'bible',
    sourceDisplayName: 'Holy Bible',
    tradition: 'christianity',
    book: 'Philippians',
    chapter: '4',
    verse: '13',
    originalText: 'I can do all things through Christ who strengthens me.',
    originalLanguage: 'greek',
    translations: {
      english: 'I can do all things through Christ who strengthens me.',
      hindi: 'मैं उसके द्वारा जो मुझे सामर्थ्य देता है, सब कुछ कर सकता हूँ।'
    },
    speaker: 'Apostle Paul',
    audience: 'Philippian Christians',
    context: 'Paul\'s letter while imprisoned, showing contentment in all circumstances',
    situation: 'Encouraging believers about inner strength through faith',
    primaryThemes: ['strength', 'faith', 'confidence', 'divine-connection', 'perseverance'],
    emotionalKeywords: [
      { emotion: 'doubtful', relevanceScore: 9 },
      { emotion: 'insecure', relevanceScore: 8 },
      { emotion: 'fearful', relevanceScore: 7 },
      { emotion: 'confident', relevanceScore: 10 }
    ],
    problemCategories: ['self_doubt', 'challenges', 'fear_of_failure'],
    keywords: ['strength', 'all_things', 'Christ', 'empowerment', 'ability']
  },

  // DHAMMAPADA (BUDDHISM)
  {
    source: 'dhammapada',
    sourceDisplayName: 'Dhammapada',
    tradition: 'buddhism',
    book: 'Chapter 1',
    chapter: '1',
    verse: '1',
    originalText: 'मनोपुब्बङ्गमा धम्मा मनोसेट्ठा मनोमया। मनसा चे पदुट्ठेन भासति वा करोति वा। ततो नं दुक्खमन्वेति चक्कंव वहतो पदं॥',
    originalLanguage: 'pali',
    translations: {
      english: 'All mental phenomena have mind as their forerunner; they have mind as their chief; they are mind-made. If one speaks or acts with a serene mind, happiness (sukha) follows, as surely as one\'s shadow.',
      hindi: 'सभी धर्म मन से आगे चलने वाले हैं, मन ही श्रेष्ठ है, मन से ही बने हैं। यदि कोई दूषित मन से बोलता या करता है, तो दुःख उसका पीछा करता है जैसे बैलगाड़ी का पहिया बैल के पैर का।'
    },
    speaker: 'Buddha',
    audience: 'Monks and followers',
    context: 'Teaching about the fundamental role of mind in creating experience',
    situation: 'Explaining how mental states determine our experience of life',
    primaryThemes: ['mindfulness', 'mental-clarity', 'inner-peace', 'wisdom', 'emotional-balance'],
    emotionalKeywords: [
      { emotion: 'angry', relevanceScore: 8 },
      { emotion: 'bitter', relevanceScore: 7 },
      { emotion: 'resentful', relevanceScore: 7 },
      { emotion: 'peaceful', relevanceScore: 9 }
    ],
    problemCategories: ['anger_management', 'negative_thinking', 'emotional_instability'],
    keywords: ['mind', 'thoughts', 'actions', 'consequences', 'mental_state']
  },
  {
    source: 'dhammapada',
    sourceDisplayName: 'Dhammapada',
    tradition: 'buddhism',
    book: 'Chapter 15',
    chapter: '15',
    verse: '197',
    originalText: 'सुखिनो वत जीवाम यस्या नो नत्थि किञ्चनं। पीतिभक्खा भविस्साम देवा आभस्सरा यथा॥',
    originalLanguage: 'pali',
    translations: {
      english: 'Happy indeed we live, we who possess nothing. Feeders on joy we shall be, like the radiant gods.',
      hindi: 'हम कितने सुखी जीवन जीते हैं, हमारे पास कुछ भी नहीं है। हम आनंद के भक्षक होंगे, उन तेजस्वी देवताओं की तरह।'
    },
    speaker: 'Buddha',
    audience: 'Monks and spiritual seekers',
    context: 'Teaching about contentment and detachment from material possessions',
    situation: 'Explaining true happiness through non-attachment',
    primaryThemes: ['contentment', 'detachment', 'joy', 'simplicity', 'inner-peace'],
    emotionalKeywords: [
      { emotion: 'envious', relevanceScore: 8 },
      { emotion: 'greedy', relevanceScore: 7 },
      { emotion: 'dissatisfied', relevanceScore: 8 },
      { emotion: 'content', relevanceScore: 10 }
    ],
    problemCategories: ['materialism', 'envy', 'dissatisfaction', 'greed'],
    keywords: ['happiness', 'possession', 'contentment', 'joy', 'detachment']
  },

  // TAO TE CHING
  {
    source: 'tao_te_ching',
    sourceDisplayName: 'Tao Te Ching',
    tradition: 'taoism',
    book: 'Chapter 8',
    chapter: '8',
    verse: '1',
    originalText: '上善若水。水善利万物而不争，处众人之所恶，故几于道。',
    originalLanguage: 'chinese',
    translations: {
      english: 'The highest good is like water, which nourishes all things and does not compete. It dwells in places that others disdain. This is why it is so near to the Tao.',
      hindi: 'सर्वोच्च अच्छाई पानी के समान है, जो सभी चीजों का पोषण करता है और प्रतिस्पर्धा नहीं करता। यह उन स्थानों में रहता है जिन्हें दूसरे तुच्छ समझते हैं। यही कारण है कि यह ताओ के इतने निकट है।'
    },
    speaker: 'Laozi',
    audience: 'Seekers of wisdom',
    context: 'Teaching about the virtue of humility and non-competition',
    situation: 'Explaining the way of the Tao through the metaphor of water',
    primaryThemes: ['humility', 'compassion', 'wisdom', 'peace', 'service'],
    emotionalKeywords: [
      { emotion: 'competitive', relevanceScore: 8 },
      { emotion: 'proud', relevanceScore: 7 },
      { emotion: 'aggressive', relevanceScore: 6 },
      { emotion: 'peaceful', relevanceScore: 9 }
    ],
    problemCategories: ['ego_issues', 'competition_stress', 'pride'],
    keywords: ['water', 'humility', 'nourish', 'compete', 'tao']
  },

  // GURU GRANTH SAHIB
  {
    source: 'guru_granth_sahib',
    sourceDisplayName: 'Guru Granth Sahib',
    tradition: 'sikhism',
    book: 'Japji Sahib',
    chapter: '1',
    verse: '1',
    originalText: 'ਇਕ ਓਅੰਕਾਰ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ ਅਕਾਲ ਮੂਰਤਿ ਅਜੂਨੀ ਸੈਭੰ ਗੁਰ ਪ੍ਰਸਾਦਿ ॥',
    originalLanguage: 'punjabi',
    translations: {
      english: 'There is one God. Truth is His name. He is the Creator. He is without fear and without hate. He is timeless and formless. He is beyond birth and death. He is self-existent. He is realized by the Guru\'s grace.',
      hindi: 'एक ओंकार सत नाम, कर्ता पुरुष, निर्भय, निर्वैर, अकाल मूर्ति, अजूनी, सैभं, गुर प्रसाद।'
    },
    speaker: 'Guru Nanak',
    audience: 'All humanity',
    context: 'Opening verse of Sikh scripture, fundamental teaching about the nature of God',
    situation: 'Establishing the core belief about the divine nature',
    primaryThemes: ['divine-connection', 'faith', 'unity', 'fearlessness', 'truth'],
    emotionalKeywords: [
      { emotion: 'fearful', relevanceScore: 9 },
      { emotion: 'anxious', relevanceScore: 8 },
      { emotion: 'lost', relevanceScore: 8 },
      { emotion: 'peaceful', relevanceScore: 10 }
    ],
    problemCategories: ['spiritual_crisis', 'fear', 'existential_questions'],
    keywords: ['one_god', 'truth', 'creator', 'fearless', 'eternal']
  },

  // UPANISHADS
  {
    source: 'upanishads',
    sourceDisplayName: 'Upanishads',
    tradition: 'hinduism',
    book: 'Isha Upanishad',
    chapter: '1',
    verse: '1',
    originalText: 'ईशावास्यमिदं सर्वं यत्किञ्च जगत्यां जगत्। तेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम्॥',
    originalLanguage: 'sanskrit',
    translations: {
      english: 'The entire universe is pervaded by the Lord. Renouncing it, enjoy it. Do not covet anyone\'s wealth.',
      hindi: 'इस जगत में जो कुछ भी जगत्रूप है, वह सब ईश्वर से व्याप्त है। उसे त्यागकर भोग करो, किसी के धन की लालसा मत करो।'
    },
    speaker: 'Ancient Sages',
    audience: 'Spiritual seekers',
    context: 'Teaching about seeing the divine in everything and living with detachment',
    situation: 'Guidance on how to live in the world while maintaining spiritual perspective',
    primaryThemes: ['divine-connection', 'detachment', 'contentment', 'wisdom', 'non-attachment'],
    emotionalKeywords: [
      { emotion: 'greedy', relevanceScore: 9 },
      { emotion: 'envious', relevanceScore: 8 },
      { emotion: 'dissatisfied', relevanceScore: 7 },
      { emotion: 'content', relevanceScore: 9 }
    ],
    problemCategories: ['greed', 'materialism', 'envy', 'spiritual_seeking'],
    keywords: ['divine_presence', 'renunciation', 'enjoyment', 'wealth', 'contentment']
  },

  // TORAH
  {
    source: 'torah',
    sourceDisplayName: 'Torah',
    tradition: 'judaism',
    book: 'Deuteronomy',
    chapter: '31',
    verse: '6',
    originalText: 'חִזְקוּ וְאִמְצוּ אַל־תִּירְאוּ וְאַל־תַּעַרְצוּ מִפְּנֵיהֶם כִּי יְהוָה אֱלֹהֶיךָ הוּא הַהֹלֵךְ עִמָּךְ לֹא יַרְפְּךָ וְלֹא יַעַזְבֶךָּ',
    originalLanguage: 'hebrew',
    translations: {
      english: 'Be strong and courageous. Do not be afraid or terrified because of them, for the LORD your God goes with you; he will never leave you nor forsake you.',
      hindi: 'मजबूत और साहसी बनो। उनसे डरो मत और न ही घबराओ, क्योंकि तुम्हारा परमेश्वर यहोवा तुम्हारे साथ चलता है; वह तुम्हें कभी नहीं छोड़ेगा और न ही त्यागेगा।'
    },
    speaker: 'Moses',
    audience: 'Israelites',
    context: 'Moses\' final words to the Israelites before entering the Promised Land',
    situation: 'Encouraging the people to be brave in facing challenges ahead',
    primaryThemes: ['courage', 'faith', 'divine-connection', 'strength', 'fearlessness'],
    emotionalKeywords: [
      { emotion: 'fearful', relevanceScore: 10 },
      { emotion: 'anxious', relevanceScore: 9 },
      { emotion: 'insecure', relevanceScore: 8 },
      { emotion: 'courageous', relevanceScore: 10 }
    ],
    problemCategories: ['fear', 'insecurity', 'challenges', 'faith_crisis'],
    keywords: ['strength', 'courage', 'fear', 'divine_presence', 'support']
  },

  // HADITH
  {
    source: 'hadith',
    sourceDisplayName: 'Hadith',
    tradition: 'islam',
    book: 'Sahih Bukhari',
    chapter: 'Book of Faith',
    verse: '1',
    originalText: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    originalLanguage: 'arabic',
    translations: {
      english: 'Actions are but by intention and every man shall have only that which he intended.',
      hindi: 'कार्य केवल नीयत से होते हैं और हर व्यक्ति को केवल वही मिलता है जिसकी उसने नीयत की है।',
      arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى'
    },
    speaker: 'Prophet Muhammad',
    audience: 'All believers',
    context: 'Teaching about the importance of intention in all actions',
    situation: 'Fundamental principle about the spiritual value of actions',
    primaryThemes: ['intention', 'sincerity', 'purpose', 'wisdom', 'spiritual-growth'],
    emotionalKeywords: [
      { emotion: 'confused', relevanceScore: 8 },
      { emotion: 'lost', relevanceScore: 7 },
      { emotion: 'purposeless', relevanceScore: 9 },
      { emotion: 'determined', relevanceScore: 8 }
    ],
    problemCategories: ['life_purpose', 'moral_dilemma', 'spiritual_seeking'],
    keywords: ['intention', 'actions', 'purpose', 'sincerity', 'spiritual_value']
  }
];

const seedWisdomTexts = async () => {
  try {
    console.log('🌱 Seeding wisdom texts...');
    
    // Clear existing data
    await WisdomText.deleteMany({});
    console.log('🗑️ Cleared existing wisdom texts');
    
    // Insert new data
    const insertedTexts = await WisdomText.insertMany(wisdomTexts);
    console.log(`✅ Successfully seeded ${insertedTexts.length} wisdom texts`);
    
    // Display summary by tradition
    const summary = await WisdomText.aggregate([
      {
        $group: {
          _id: '$tradition',
          count: { $sum: 1 },
          sources: { $addToSet: '$sourceDisplayName' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    console.log('\n📊 Wisdom Texts Summary:');
    summary.forEach(item => {
      console.log(`${item._id}: ${item.count} texts from ${item.sources.join(', ')}`);
    });
    
    return insertedTexts;
  } catch (error) {
    console.error('❌ Error seeding wisdom texts:', error);
    throw error;
  }
};

module.exports = { wisdomTexts, seedWisdomTexts };