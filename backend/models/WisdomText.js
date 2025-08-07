const mongoose = require('mongoose');

const wisdomTextSchema = new mongoose.Schema({
  // Source Information
  source: {
    type: String,
    required: [true, 'Source text is required'],
    enum: [
      'bhagavad_gita',
      'quran',
      'bible',
      'dhammapada',
      'tao_te_ching',
      'guru_granth_sahib',
      'upanishads',
      'ramayana',
      'mahabharata',
      'yoga_sutras',
      'tripitaka',
      'torah',
      'talmud',
      'hadith',
      'avesta',
      'book_of_mormon'
    ],
    index: true
  },
  sourceDisplayName: {
    type: String,
    required: true
  },
  tradition: {
    type: String,
    required: true,
    enum: ['hinduism', 'islam', 'christianity', 'buddhism', 'judaism', 'sikhism', 'taoism', 'zoroastrianism'],
    index: true
  },
  
  // Text Structure
  book: String, // e.g., "Genesis", "Surah Al-Baqarah", "Chapter 2"
  chapter: String,
  verse: String,
  section: String, // For longer texts
  
  // Content
  originalText: {
    type: String,
    required: [true, 'Original text is required']
  },
  originalLanguage: {
    type: String,
    required: true,
    enum: ['sanskrit', 'arabic', 'hebrew', 'pali', 'chinese', 'punjabi', 'avestan', 'greek', 'aramaic']
  },
  
  // Translations
  translations: {
    english: {
      type: String,
      required: true
    },
    hindi: String,
    spanish: String,
    french: String,
    german: String,
    arabic: String,
    sanskrit: String,
    urdu: String
  },
  
  // Context and Attribution
  speaker: String, // e.g., "Krishna", "Prophet Muhammad", "Jesus", "Buddha"
  audience: String, // e.g., "Arjuna", "Disciples", "Followers"
  context: {
    type: String,
    maxlength: 500
  },
  situation: String, // Brief description of when/why this was said
  
  // Thematic Classification
  primaryThemes: [{
    type: String,
    enum: [
      'courage', 'fear', 'anxiety', 'depression', 'anger', 'forgiveness',
      'love', 'compassion', 'wisdom', 'duty', 'dharma', 'righteousness',
      'detachment', 'surrender', 'faith', 'hope', 'patience', 'perseverance',
      'humility', 'gratitude', 'peace', 'contentment', 'mindfulness',
      'self-realization', 'spiritual-growth', 'divine-connection',
      'relationships', 'family', 'friendship', 'marriage', 'parenting',
      'work', 'career', 'money', 'success', 'failure', 'loss', 'grief',
      'healing', 'health', 'death', 'afterlife', 'purpose', 'meaning',
      'justice', 'truth', 'honesty', 'integrity', 'service', 'charity',
      'prayer', 'meditation', 'worship', 'devotion', 'surrender',
      'inner-peace', 'mental-clarity', 'emotional-balance'
    ],
    index: true
  }],
  
  // Emotional Relevance
  emotionalKeywords: [{
    emotion: {
      type: String,
      enum: [
        'anxious', 'worried', 'fearful', 'scared', 'nervous', 'stressed',
        'sad', 'depressed', 'lonely', 'hopeless', 'grief-stricken',
        'angry', 'frustrated', 'irritated', 'resentful', 'bitter',
        'confused', 'lost', 'uncertain', 'doubtful', 'overwhelmed',
        'guilty', 'ashamed', 'regretful', 'disappointed', 'hurt',
        'jealous', 'envious', 'insecure', 'rejected', 'abandoned',
        'peaceful', 'calm', 'content', 'joyful', 'grateful',
        'hopeful', 'confident', 'determined', 'courageous', 'loving'
      ]
    },
    relevanceScore: {
      type: Number,
      min: 1,
      max: 10,
      default: 5
    }
  }],
  
  // Problem Categories
  problemCategories: [{
    type: String,
    enum: [
      'relationship_issues', 'family_conflicts', 'work_stress', 'financial_problems',
      'health_concerns', 'academic_pressure', 'career_confusion', 'life_purpose',
      'spiritual_crisis', 'moral_dilemma', 'decision_making', 'addiction',
      'loss_and_grief', 'betrayal', 'rejection', 'failure', 'success_pressure',
      'social_anxiety', 'loneliness', 'self_doubt', 'perfectionism',
      'change_and_transition', 'aging', 'parenting_challenges', 'marriage_issues'
    ],
    index: true
  }],
  
  // Semantic Analysis
  keywords: [String], // Extracted important words for matching
  semanticVector: [Number], // For advanced semantic search (if using embeddings)
  
  // Usage Statistics
  usage: {
    timesRetrieved: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalRatings: {
      type: Number,
      default: 0
    },
    lastUsed: Date
  },
  
  // Metadata
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  length: {
    type: String,
    enum: ['short', 'medium', 'long'],
    default: 'medium'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Admin fields
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'verified'
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full reference
wisdomTextSchema.virtual('fullReference').get(function() {
  let ref = this.sourceDisplayName;
  if (this.book) ref += `, ${this.book}`;
  if (this.chapter) ref += `, Chapter ${this.chapter}`;
  if (this.verse) ref += `, Verse ${this.verse}`;
  return ref;
});

// Virtual for speaker-audience context
wisdomTextSchema.virtual('contextualAttribution').get(function() {
  if (this.speaker && this.audience) {
    return `${this.speaker} to ${this.audience}`;
  } else if (this.speaker) {
    return `Words of ${this.speaker}`;
  } else {
    return `From ${this.sourceDisplayName}`;
  }
});

// Instance method to increment usage
wisdomTextSchema.methods.incrementUsage = function() {
  this.usage.timesRetrieved += 1;
  this.usage.lastUsed = new Date();
  return this.save();
};

// Instance method to add rating
wisdomTextSchema.methods.addRating = function(rating) {
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }
  
  const currentTotal = this.usage.averageRating * this.usage.totalRatings;
  this.usage.totalRatings += 1;
  this.usage.averageRating = (currentTotal + rating) / this.usage.totalRatings;
  
  return this.save();
};

// Static method to find by themes
wisdomTextSchema.statics.findByThemes = function(themes, limit = 10) {
  return this.find({
    primaryThemes: { $in: themes },
    isActive: true
  })
  .sort({ 'usage.averageRating': -1, 'usage.timesRetrieved': -1 })
  .limit(limit);
};

// Static method to find by emotions
wisdomTextSchema.statics.findByEmotions = function(emotions, limit = 10) {
  return this.find({
    'emotionalKeywords.emotion': { $in: emotions },
    isActive: true
  })
  .sort({ 'emotionalKeywords.relevanceScore': -1, 'usage.averageRating': -1 })
  .limit(limit);
};

// Static method to find by problem categories
wisdomTextSchema.statics.findByProblemCategories = function(categories, limit = 10) {
  return this.find({
    problemCategories: { $in: categories },
    isActive: true
  })
  .sort({ 'usage.averageRating': -1 })
  .limit(limit);
};

// Static method to find by source
wisdomTextSchema.statics.findBySource = function(sources, limit = 10) {
  return this.find({
    source: { $in: sources },
    isActive: true
  })
  .sort({ 'usage.averageRating': -1 })
  .limit(limit);
};

// Text search index
wisdomTextSchema.index({
  originalText: 'text',
  'translations.english': 'text',
  'translations.hindi': 'text',
  keywords: 'text'
});

// Compound indexes for better query performance
wisdomTextSchema.index({ source: 1, primaryThemes: 1 });
wisdomTextSchema.index({ 'emotionalKeywords.emotion': 1, 'usage.averageRating': -1 });
wisdomTextSchema.index({ problemCategories: 1, tradition: 1 });
wisdomTextSchema.index({ isActive: 1, 'usage.averageRating': -1 });

module.exports = mongoose.model('WisdomText', wisdomTextSchema);