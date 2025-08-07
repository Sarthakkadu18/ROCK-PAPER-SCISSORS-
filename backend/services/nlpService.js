const natural = require('natural');
const sentiment = require('sentiment');
const compromise = require('compromise');
const WisdomText = require('../models/WisdomText');

class NLPService {
  constructor() {
    this.sentimentAnalyzer = new sentiment();
    this.stemmer = natural.PorterStemmer;
    this.tokenizer = new natural.WordTokenizer();
    
    // Initialize emotional keywords mapping
    this.emotionalKeywords = {
      anxious: ['anxious', 'worried', 'nervous', 'stressed', 'tense', 'uneasy', 'restless', 'panic', 'fear', 'scared'],
      sad: ['sad', 'depressed', 'down', 'blue', 'melancholy', 'gloomy', 'dejected', 'despondent', 'heartbroken', 'grief'],
      angry: ['angry', 'mad', 'furious', 'irritated', 'annoyed', 'frustrated', 'rage', 'resentful', 'bitter', 'hostile'],
      confused: ['confused', 'lost', 'uncertain', 'doubtful', 'perplexed', 'bewildered', 'puzzled', 'unclear', 'mixed up'],
      overwhelmed: ['overwhelmed', 'swamped', 'buried', 'drowning', 'too much', 'overloaded', 'stressed out', 'exhausted'],
      lonely: ['lonely', 'alone', 'isolated', 'abandoned', 'rejected', 'left out', 'solitary', 'friendless'],
      hopeless: ['hopeless', 'desperate', 'helpless', 'powerless', 'defeated', 'lost cause', 'no way out', 'giving up'],
      guilty: ['guilty', 'ashamed', 'regretful', 'sorry', 'remorseful', 'fault', 'blame', 'wrong'],
      fearful: ['afraid', 'scared', 'terrified', 'frightened', 'petrified', 'alarmed', 'worried', 'anxious'],
      insecure: ['insecure', 'self-doubt', 'uncertain', 'inadequate', 'unworthy', 'not good enough', 'inferior']
    };
    
    // Problem category keywords
    this.problemCategories = {
      relationship_issues: ['relationship', 'partner', 'boyfriend', 'girlfriend', 'spouse', 'marriage', 'love', 'breakup', 'divorce'],
      family_conflicts: ['family', 'parents', 'mother', 'father', 'siblings', 'brother', 'sister', 'children', 'kids'],
      work_stress: ['work', 'job', 'career', 'boss', 'colleague', 'office', 'workplace', 'employment', 'salary'],
      financial_problems: ['money', 'financial', 'debt', 'bills', 'income', 'salary', 'expenses', 'budget', 'poor', 'broke'],
      health_concerns: ['health', 'sick', 'illness', 'disease', 'pain', 'medical', 'doctor', 'hospital', 'medicine'],
      academic_pressure: ['school', 'college', 'university', 'studies', 'exam', 'grades', 'homework', 'assignment', 'student'],
      social_anxiety: ['social', 'people', 'public', 'speaking', 'crowd', 'friends', 'party', 'meeting', 'presentation'],
      self_doubt: ['confidence', 'self-esteem', 'worth', 'value', 'ability', 'skill', 'talent', 'good enough', 'failure']
    };
    
    // Theme keywords
    this.themeKeywords = {
      courage: ['courage', 'brave', 'strength', 'bold', 'fearless', 'confident'],
      patience: ['patience', 'wait', 'endure', 'persevere', 'time', 'slow'],
      forgiveness: ['forgive', 'mercy', 'compassion', 'understanding', 'let go'],
      wisdom: ['wisdom', 'knowledge', 'understanding', 'insight', 'truth', 'learn'],
      peace: ['peace', 'calm', 'tranquil', 'serenity', 'quiet', 'stillness'],
      love: ['love', 'affection', 'care', 'kindness', 'heart', 'compassion'],
      faith: ['faith', 'belief', 'trust', 'hope', 'divine', 'god', 'spiritual'],
      detachment: ['detachment', 'letting go', 'release', 'surrender', 'accept']
    };
  }

  // Main analysis function
  async analyzeUserInput(text, selectedBooks = []) {
    try {
      console.log('🔍 Analyzing user input:', text.substring(0, 100) + '...');
      
      // Clean and preprocess text
      const cleanText = this.preprocessText(text);
      
      // Perform various analyses
      const sentimentAnalysis = this.analyzeSentiment(cleanText);
      const emotions = this.detectEmotions(cleanText);
      const problemCategories = this.categorizeProblems(cleanText);
      const themes = this.extractThemes(cleanText);
      const keywords = this.extractKeywords(cleanText);
      
      // Find relevant wisdom texts
      const wisdomTexts = await this.findRelevantWisdom({
        emotions,
        problemCategories,
        themes,
        keywords,
        selectedBooks
      });
      
      // Generate personalized guidance
      const guidance = await this.generateGuidance({
        originalText: text,
        sentimentAnalysis,
        emotions,
        problemCategories,
        themes,
        wisdomTexts
      });
      
      return {
        analysis: {
          sentiment: sentimentAnalysis,
          emotions,
          problemCategories,
          themes,
          keywords
        },
        wisdomTexts,
        guidance,
        metadata: {
          processedAt: new Date(),
          textLength: text.length,
          confidenceScore: this.calculateConfidenceScore(sentimentAnalysis, emotions, themes)
        }
      };
      
    } catch (error) {
      console.error('❌ Error in NLP analysis:', error);
      throw new Error('Failed to analyze user input');
    }
  }

  // Preprocess text for analysis
  preprocessText(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Analyze sentiment using multiple approaches
  analyzeSentiment(text) {
    const sentimentResult = this.sentimentAnalyzer.analyze(text);
    const doc = compromise(text);
    
    // Get emotional adjectives and adverbs
    const adjectives = doc.adjectives().out('array');
    const adverbs = doc.adverbs().out('array');
    
    return {
      score: sentimentResult.score,
      comparative: sentimentResult.comparative,
      calculation: sentimentResult.calculation,
      tokens: sentimentResult.tokens,
      words: sentimentResult.words,
      positive: sentimentResult.positive,
      negative: sentimentResult.negative,
      polarity: sentimentResult.score > 0 ? 'positive' : sentimentResult.score < 0 ? 'negative' : 'neutral',
      intensity: Math.abs(sentimentResult.comparative),
      emotionalWords: {
        adjectives,
        adverbs
      }
    };
  }

  // Detect emotions from text
  detectEmotions(text) {
    const detectedEmotions = [];
    const tokens = this.tokenizer.tokenize(text);
    
    for (const [emotion, keywords] of Object.entries(this.emotionalKeywords)) {
      let score = 0;
      let matchedWords = [];
      
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = text.match(regex);
        if (matches) {
          score += matches.length;
          matchedWords.push(...matches);
        }
      });
      
      if (score > 0) {
        detectedEmotions.push({
          emotion,
          score,
          confidence: Math.min(score / tokens.length * 10, 1),
          matchedWords: [...new Set(matchedWords)]
        });
      }
    }
    
    // Sort by score and return top emotions
    return detectedEmotions
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  // Categorize problems
  categorizeProblems(text) {
    const categories = [];
    
    for (const [category, keywords] of Object.entries(this.problemCategories)) {
      let score = 0;
      let matchedWords = [];
      
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = text.match(regex);
        if (matches) {
          score += matches.length;
          matchedWords.push(...matches);
        }
      });
      
      if (score > 0) {
        categories.push({
          category,
          score,
          confidence: Math.min(score / keywords.length, 1),
          matchedWords: [...new Set(matchedWords)]
        });
      }
    }
    
    return categories
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  // Extract themes
  extractThemes(text) {
    const themes = [];
    
    for (const [theme, keywords] of Object.entries(this.themeKeywords)) {
      let score = 0;
      let matchedWords = [];
      
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = text.match(regex);
        if (matches) {
          score += matches.length;
          matchedWords.push(...matches);
        }
      });
      
      if (score > 0) {
        themes.push({
          theme,
          score,
          relevance: Math.min(score / keywords.length, 1),
          matchedWords: [...new Set(matchedWords)]
        });
      }
    }
    
    return themes
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  // Extract important keywords
  extractKeywords(text) {
    const tokens = this.tokenizer.tokenize(text);
    const doc = compromise(text);
    
    // Get nouns, verbs, and adjectives
    const nouns = doc.nouns().out('array');
    const verbs = doc.verbs().out('array');
    const adjectives = doc.adjectives().out('array');
    
    // Calculate TF-IDF-like scores for important terms
    const allWords = [...nouns, ...verbs, ...adjectives];
    const wordFreq = {};
    
    allWords.forEach(word => {
      const cleanWord = word.toLowerCase();
      if (cleanWord.length > 3 && !this.isStopWord(cleanWord)) {
        wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
      }
    });
    
    // Sort by frequency and return top keywords
    return Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word, freq]) => ({ word, frequency: freq }));
  }

  // Check if word is a stop word
  isStopWord(word) {
    const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    return stopWords.includes(word.toLowerCase());
  }

  // Find relevant wisdom texts based on analysis
  async findRelevantWisdom({ emotions, problemCategories, themes, keywords, selectedBooks }) {
    try {
      const query = { isActive: true };
      
      // If user selected specific books, filter by those
      if (selectedBooks && selectedBooks.length > 0) {
        query.source = { $in: selectedBooks };
      }
      
      // Build search criteria based on analysis
      const searchCriteria = [];
      
      // Search by emotions
      if (emotions.length > 0) {
        const emotionNames = emotions.map(e => e.emotion);
        searchCriteria.push({
          'emotionalKeywords.emotion': { $in: emotionNames }
        });
      }
      
      // Search by problem categories
      if (problemCategories.length > 0) {
        const categoryNames = problemCategories.map(c => c.category);
        searchCriteria.push({
          problemCategories: { $in: categoryNames }
        });
      }
      
      // Search by themes
      if (themes.length > 0) {
        const themeNames = themes.map(t => t.theme);
        searchCriteria.push({
          primaryThemes: { $in: themeNames }
        });
      }
      
      // Search by keywords
      if (keywords.length > 0) {
        const keywordList = keywords.map(k => k.word);
        searchCriteria.push({
          keywords: { $in: keywordList }
        });
      }
      
      // Combine search criteria
      if (searchCriteria.length > 0) {
        query.$or = searchCriteria;
      }
      
      // Execute search with scoring
      let wisdomTexts = await WisdomText.find(query)
        .sort({ 'usage.averageRating': -1, 'usage.timesRetrieved': -1 })
        .limit(5);
      
      // If no results with specific criteria, get some general wisdom
      if (wisdomTexts.length === 0) {
        const fallbackQuery = { isActive: true };
        if (selectedBooks && selectedBooks.length > 0) {
          fallbackQuery.source = { $in: selectedBooks };
        }
        
        wisdomTexts = await WisdomText.find(fallbackQuery)
          .sort({ 'usage.averageRating': -1 })
          .limit(3);
      }
      
      // Calculate relevance scores
      const scoredTexts = wisdomTexts.map(text => {
        let relevanceScore = 0;
        
        // Score based on emotional relevance
        emotions.forEach(emotion => {
          const emotionalKeyword = text.emotionalKeywords.find(
            ek => ek.emotion === emotion.emotion
          );
          if (emotionalKeyword) {
            relevanceScore += emotionalKeyword.relevanceScore * emotion.confidence;
          }
        });
        
        // Score based on problem categories
        problemCategories.forEach(category => {
          if (text.problemCategories.includes(category.category)) {
            relevanceScore += 5 * category.confidence;
          }
        });
        
        // Score based on themes
        themes.forEach(theme => {
          if (text.primaryThemes.includes(theme.theme)) {
            relevanceScore += 3 * theme.relevance;
          }
        });
        
        return {
          ...text.toObject(),
          relevanceScore: Math.round(relevanceScore * 100) / 100
        };
      });
      
      // Sort by relevance score
      return scoredTexts.sort((a, b) => b.relevanceScore - a.relevanceScore);
      
    } catch (error) {
      console.error('❌ Error finding relevant wisdom:', error);
      throw new Error('Failed to find relevant wisdom texts');
    }
  }

  // Generate personalized guidance
  async generateGuidance({ originalText, sentimentAnalysis, emotions, problemCategories, themes, wisdomTexts }) {
    try {
      if (!wisdomTexts || wisdomTexts.length === 0) {
        return {
          message: "I understand you're going through a challenging time. While I couldn't find specific wisdom texts that match your situation perfectly, remember that every difficulty is temporary and you have the strength within you to overcome it.",
          wisdomReference: null,
          personalizedAdvice: "Take some time for self-reflection, practice patience with yourself, and consider seeking support from trusted friends, family, or professionals."
        };
      }
      
      const primaryWisdom = wisdomTexts[0];
      const primaryEmotion = emotions[0]?.emotion || 'challenged';
      const primaryCategory = problemCategories[0]?.category || 'life_challenges';
      
      // Generate contextual guidance based on the wisdom text and user's situation
      let guidance = this.generateContextualGuidance(
        primaryWisdom,
        primaryEmotion,
        primaryCategory,
        sentimentAnalysis
      );
      
      // Add personalized advice
      const personalizedAdvice = this.generatePersonalizedAdvice(
        emotions,
        problemCategories,
        themes,
        sentimentAnalysis
      );
      
      return {
        message: guidance,
        wisdomReference: {
          text: primaryWisdom.translations.english,
          source: primaryWisdom.sourceDisplayName,
          reference: primaryWisdom.fullReference,
          attribution: primaryWisdom.contextualAttribution,
          originalText: primaryWisdom.originalText,
          context: primaryWisdom.context
        },
        personalizedAdvice,
        additionalWisdom: wisdomTexts.slice(1, 3).map(text => ({
          text: text.translations.english,
          source: text.sourceDisplayName,
          reference: text.fullReference
        })),
        emotionalSupport: this.generateEmotionalSupport(primaryEmotion, sentimentAnalysis),
        actionableSteps: this.generateActionableSteps(problemCategories, themes)
      };
      
    } catch (error) {
      console.error('❌ Error generating guidance:', error);
      throw new Error('Failed to generate personalized guidance');
    }
  }

  // Generate contextual guidance based on wisdom text
  generateContextualGuidance(wisdomText, emotion, category, sentiment) {
    const templates = {
      anxious: [
        `The ancient wisdom reminds us: "${wisdomText.translations.english}" This profound teaching from ${wisdomText.contextualAttribution} speaks directly to your current feelings of anxiety. Just as ${wisdomText.speaker} guided ${wisdomText.audience}, you too can find peace by understanding that your current worries are temporary and manageable.`,
        `In times of anxiety, the wisdom of ${wisdomText.sourceDisplayName} offers us comfort: "${wisdomText.translations.english}" This teaching, shared by ${wisdomText.speaker}, reminds us that our anxious thoughts need not define us or our future.`
      ],
      sad: [
        `During moments of sadness, we can find solace in these words: "${wisdomText.translations.english}" This wisdom from ${wisdomText.sourceDisplayName}, spoken by ${wisdomText.speaker}, reminds us that even in our darkest moments, there is light and hope to be found.`,
        `The profound teaching "${wisdomText.translations.english}" from ${wisdomText.contextualAttribution} speaks to the universal experience of sorrow and offers a path toward healing and renewal.`
      ],
      angry: [
        `When anger fills our hearts, ancient wisdom guides us: "${wisdomText.translations.english}" These words from ${wisdomText.speaker} in ${wisdomText.sourceDisplayName} teach us that anger, while natural, need not control our actions or poison our peace.`,
        `The teaching "${wisdomText.translations.english}" from ${wisdomText.contextualAttribution} offers us a way to transform our anger into understanding and our frustration into wisdom.`
      ],
      confused: [
        `In times of confusion, clarity comes through wisdom: "${wisdomText.translations.english}" This guidance from ${wisdomText.speaker} in ${wisdomText.sourceDisplayName} illuminates the path forward when we feel lost or uncertain.`,
        `The ancient teaching "${wisdomText.translations.english}" from ${wisdomText.contextualAttribution} reminds us that confusion is often the beginning of deeper understanding.`
      ]
    };
    
    const defaultTemplate = `The timeless wisdom "${wisdomText.translations.english}" from ${wisdomText.contextualAttribution} offers guidance for your current situation. This teaching reminds us that challenges are opportunities for growth and that inner strength can be found even in difficult times.`;
    
    const emotionTemplates = templates[emotion] || [defaultTemplate];
    return emotionTemplates[Math.floor(Math.random() * emotionTemplates.length)];
  }

  // Generate personalized advice
  generatePersonalizedAdvice(emotions, problemCategories, themes, sentiment) {
    let advice = [];
    
    // Advice based on primary emotion
    if (emotions.length > 0) {
      const primaryEmotion = emotions[0].emotion;
      const emotionAdvice = {
        anxious: "Practice deep breathing exercises and mindfulness. Remember that most of our worries never actually happen. Focus on what you can control today.",
        sad: "Allow yourself to feel these emotions without judgment. Sadness is a natural part of life's journey. Reach out to supportive friends or family members.",
        angry: "Take time to cool down before making decisions. Channel your energy into positive action. Consider what this anger is trying to teach you.",
        confused: "Break down complex problems into smaller, manageable parts. Seek advice from trusted mentors or counselors. Trust that clarity will come with time.",
        overwhelmed: "Prioritize your tasks and focus on one thing at a time. It's okay to ask for help or delegate responsibilities.",
        lonely: "Reach out to old friends or consider joining communities with shared interests. Loneliness is temporary, and connection is always possible.",
        hopeless: "Remember that this feeling is temporary. Consider speaking with a mental health professional who can provide additional support and perspective."
      };
      
      advice.push(emotionAdvice[primaryEmotion] || "Be gentle with yourself during this challenging time.");
    }
    
    // Advice based on problem category
    if (problemCategories.length > 0) {
      const primaryCategory = problemCategories[0].category;
      const categoryAdvice = {
        relationship_issues: "Open and honest communication is key. Consider couples counseling if needed. Remember that healthy relationships require effort from both parties.",
        work_stress: "Set clear boundaries between work and personal life. Communicate with your supervisor about workload concerns. Consider stress management techniques.",
        financial_problems: "Create a budget and prioritize essential expenses. Consider seeking advice from a financial counselor. Remember that financial situations can improve with time and effort.",
        family_conflicts: "Practice active listening and try to understand different perspectives. Sometimes family therapy can help improve communication patterns.",
        health_concerns: "Don't hesitate to seek professional medical advice. Focus on what you can control: nutrition, exercise, and stress management."
      };
      
      if (categoryAdvice[primaryCategory]) {
        advice.push(categoryAdvice[primaryCategory]);
      }
    }
    
    return advice.join(' ');
  }

  // Generate emotional support
  generateEmotionalSupport(emotion, sentiment) {
    const supportMessages = {
      anxious: "Your feelings of anxiety are valid, and you're not alone in experiencing them. Many people face similar challenges, and there are effective ways to manage anxiety.",
      sad: "It's okay to feel sad. These emotions are part of being human, and they will pass. You have the strength to get through this difficult time.",
      angry: "Your anger is understandable given your situation. These feelings can be channeled into positive change and growth.",
      confused: "Feeling confused is natural when facing complex situations. With time and reflection, clarity will emerge.",
      overwhelmed: "It's completely normal to feel overwhelmed sometimes. You don't have to handle everything at once."
    };
    
    return supportMessages[emotion] || "You are stronger than you realize, and this challenging time will pass.";
  }

  // Generate actionable steps
  generateActionableSteps(problemCategories, themes) {
    const steps = [];
    
    // Add general mindfulness step
    steps.push("Take 5 minutes today for quiet reflection or meditation");
    
    // Add category-specific steps
    if (problemCategories.length > 0) {
      const category = problemCategories[0].category;
      const categorySteps = {
        relationship_issues: "Have an honest conversation with your partner about your feelings",
        work_stress: "Identify the top 3 stressors at work and create a plan to address them",
        financial_problems: "List all your expenses and identify areas where you can reduce spending",
        family_conflicts: "Reach out to a family member you trust to discuss the situation",
        health_concerns: "Schedule an appointment with a healthcare professional"
      };
      
      if (categorySteps[category]) {
        steps.push(categorySteps[category]);
      }
    }
    
    // Add theme-based steps
    if (themes.length > 0) {
      const theme = themes[0].theme;
      const themeSteps = {
        courage: "Identify one small brave action you can take today",
        patience: "Practice waiting without judgment for 10 minutes today",
        forgiveness: "Write down one thing you're ready to forgive (yourself or others)",
        wisdom: "Read or listen to something that inspires you",
        peace: "Create a peaceful space in your home for reflection"
      };
      
      if (themeSteps[theme]) {
        steps.push(themeSteps[theme]);
      }
    }
    
    return steps;
  }

  // Calculate confidence score for the analysis
  calculateConfidenceScore(sentiment, emotions, themes) {
    let score = 0;
    
    // Sentiment confidence
    score += Math.min(Math.abs(sentiment.comparative) * 10, 3);
    
    // Emotion detection confidence
    if (emotions.length > 0) {
      score += emotions[0].confidence * 3;
    }
    
    // Theme extraction confidence
    if (themes.length > 0) {
      score += themes[0].relevance * 2;
    }
    
    return Math.min(Math.round(score * 10) / 10, 10);
  }
}

module.exports = new NLPService();