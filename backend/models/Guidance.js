const mongoose = require('mongoose');

const guidanceSchema = new mongoose.Schema({
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // User input
  problemText: {
    type: String,
    required: [true, 'Problem text is required'],
    maxlength: [2000, 'Problem text cannot exceed 2000 characters']
  },
  selectedBooks: [{
    type: String,
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
    ]
  }],
  userEmotions: [String], // User-specified emotions
  
  // NLP Analysis Results
  analysis: {
    sentiment: {
      score: Number,
      comparative: Number,
      polarity: {
        type: String,
        enum: ['positive', 'negative', 'neutral']
      },
      intensity: Number,
      tokens: [String],
      words: [String],
      positive: [String],
      negative: [String]
    },
    emotions: [{
      emotion: String,
      score: Number,
      confidence: Number,
      matchedWords: [String]
    }],
    problemCategories: [{
      category: String,
      score: Number,
      confidence: Number,
      matchedWords: [String]
    }],
    themes: [{
      theme: String,
      score: Number,
      relevance: Number,
      matchedWords: [String]
    }],
    keywords: [{
      word: String,
      frequency: Number
    }]
  },
  
  // Wisdom texts used
  wisdomTexts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WisdomText'
  }],
  
  // Generated guidance
  guidance: {
    message: {
      type: String,
      required: true
    },
    wisdomReference: {
      text: String,
      source: String,
      reference: String,
      attribution: String,
      originalText: String,
      context: String
    },
    personalizedAdvice: String,
    additionalWisdom: [{
      text: String,
      source: String,
      reference: String
    }],
    emotionalSupport: String,
    actionableSteps: [String]
  },
  
  // User feedback
  userRating: {
    type: Number,
    min: 1,
    max: 5
  },
  userFeedback: {
    type: String,
    maxlength: 1000
  },
  
  // System metadata
  karmaCost: {
    type: Number,
    required: true,
    default: 15
  },
  metadata: {
    processedAt: Date,
    textLength: Number,
    confidenceScore: Number,
    processingTimeMs: Number
  },
  
  // Flags
  isBookmarked: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
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

// Virtual for primary emotion
guidanceSchema.virtual('primaryEmotion').get(function() {
  if (this.analysis && this.analysis.emotions && this.analysis.emotions.length > 0) {
    return this.analysis.emotions[0].emotion;
  }
  return null;
});

// Virtual for primary theme
guidanceSchema.virtual('primaryTheme').get(function() {
  if (this.analysis && this.analysis.themes && this.analysis.themes.length > 0) {
    return this.analysis.themes[0].theme;
  }
  return null;
});

// Virtual for primary wisdom source
guidanceSchema.virtual('primaryWisdomSource').get(function() {
  if (this.guidance && this.guidance.wisdomReference) {
    return this.guidance.wisdomReference.source;
  }
  return null;
});

// Virtual for sentiment label
guidanceSchema.virtual('sentimentLabel').get(function() {
  if (!this.analysis || !this.analysis.sentiment) return 'neutral';
  
  const { polarity, intensity } = this.analysis.sentiment;
  if (polarity === 'positive') {
    return intensity > 0.5 ? 'very positive' : 'positive';
  } else if (polarity === 'negative') {
    return intensity > 0.5 ? 'very negative' : 'negative';
  }
  return 'neutral';
});

// Instance method to get summary
guidanceSchema.methods.getSummary = function() {
  return {
    id: this._id,
    problemText: this.problemText.substring(0, 100) + (this.problemText.length > 100 ? '...' : ''),
    primaryEmotion: this.primaryEmotion,
    primaryTheme: this.primaryTheme,
    wisdomSource: this.primaryWisdomSource,
    sentiment: this.sentimentLabel,
    rating: this.userRating,
    karmaCost: this.karmaCost,
    createdAt: this.createdAt
  };
};

// Instance method to check if guidance can be edited
guidanceSchema.methods.canBeEdited = function() {
  const hoursSinceCreation = (Date.now() - this.createdAt) / (1000 * 60 * 60);
  return hoursSinceCreation < 24; // Can edit within 24 hours
};

// Static method to find by emotion
guidanceSchema.statics.findByEmotion = function(emotion, userId, limit = 10) {
  return this.find({
    userId,
    'analysis.emotions.emotion': emotion
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate('wisdomTexts', 'sourceDisplayName translations.english');
};

// Static method to find by theme
guidanceSchema.statics.findByTheme = function(theme, userId, limit = 10) {
  return this.find({
    userId,
    'analysis.themes.theme': theme
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate('wisdomTexts', 'sourceDisplayName translations.english');
};

// Static method to find by wisdom source
guidanceSchema.statics.findByWisdomSource = function(source, userId, limit = 10) {
  return this.find({ userId })
    .populate({
      path: 'wisdomTexts',
      match: { source: source },
      select: 'sourceDisplayName translations.english'
    })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get user statistics
guidanceSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalGuidance: { $sum: 1 },
        totalKarmaSpent: { $sum: '$karmaCost' },
        averageRating: { $avg: '$userRating' },
        ratedGuidanceCount: { 
          $sum: { $cond: [{ $ne: ['$userRating', null] }, 1, 0] }
        },
        averageConfidence: { $avg: '$metadata.confidenceScore' }
      }
    }
  ]);
  
  return stats[0] || {
    totalGuidance: 0,
    totalKarmaSpent: 0,
    averageRating: 0,
    ratedGuidanceCount: 0,
    averageConfidence: 0
  };
};

// Pre-save middleware to update timestamps
guidanceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for better query performance
guidanceSchema.index({ userId: 1, createdAt: -1 });
guidanceSchema.index({ userId: 1, 'analysis.emotions.emotion': 1 });
guidanceSchema.index({ userId: 1, 'analysis.themes.theme': 1 });
guidanceSchema.index({ userId: 1, userRating: 1 });
guidanceSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Guidance', guidanceSchema);