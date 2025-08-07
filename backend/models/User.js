const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't include password in queries by default
  },
  
  // Profile Information
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(v) {
        return v < new Date();
      },
      message: 'Date of birth must be in the past'
    }
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    default: 'prefer-not-to-say'
  },
  profilePicture: {
    type: String,
    default: ''
  },
  
  // Karma System
  karmaBalance: {
    type: Number,
    default: 150,
    min: [0, 'Karma balance cannot be negative']
  },
  totalKarmaEarned: {
    type: Number,
    default: 150
  },
  totalKarmaSpent: {
    type: Number,
    default: 0
  },
  karmaTransactions: [{
    type: {
      type: String,
      enum: ['earned', 'spent', 'purchased'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    description: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // User Preferences
  preferences: {
    language: {
      type: String,
      default: 'english',
      enum: ['english', 'hindi', 'spanish', 'french', 'german', 'arabic', 'sanskrit']
    },
    preferredWisdomTexts: [{
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
        'avesta'
      ]
    }],
    voiceSettings: {
      enableVoiceInput: {
        type: Boolean,
        default: true
      },
      enableVoiceOutput: {
        type: Boolean,
        default: true
      },
      voiceGender: {
        type: String,
        enum: ['male', 'female'],
        default: 'female'
      },
      voiceSpeed: {
        type: Number,
        default: 1.0,
        min: 0.5,
        max: 2.0
      }
    },
    notifications: {
      dailyReminders: {
        type: Boolean,
        default: true
      },
      wisdomQuotes: {
        type: Boolean,
        default: true
      },
      karmaUpdates: {
        type: Boolean,
        default: true
      }
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    }
  },
  
  // User Journey & Analytics
  journeyStats: {
    totalProblemsShared: {
      type: Number,
      default: 0
    },
    totalGuidanceReceived: {
      type: Number,
      default: 0
    },
    favoriteEmotions: [{
      emotion: String,
      count: Number
    }],
    mostUsedTexts: [{
      text: String,
      count: Number
    }],
    streakDays: {
      type: Number,
      default: 0
    },
    lastActiveDate: {
      type: Date,
      default: Date.now
    }
  },
  
  // Saved Content
  savedGuidance: [{
    guidanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Guidance'
    },
    savedAt: {
      type: Date,
      default: Date.now
    },
    tags: [String],
    personalNotes: String
  }],
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Subscription & Payment
  subscription: {
    type: String,
    enum: ['free', 'premium', 'lifetime'],
    default: 'free'
  },
  subscriptionExpiry: Date,
  paymentHistory: [{
    amount: Number,
    currency: String,
    karmaAmount: Number,
    transactionId: String,
    paymentMethod: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Timestamps
  lastLogin: {
    type: Date,
    default: Date.now
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

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age calculation
userSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to update timestamps
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Instance method to deduct karma
userSchema.methods.deductKarma = function(amount, description) {
  if (this.karmaBalance < amount) {
    throw new Error('Insufficient karma balance');
  }
  
  this.karmaBalance -= amount;
  this.totalKarmaSpent += amount;
  this.karmaTransactions.push({
    type: 'spent',
    amount: -amount,
    description: description || 'Karma spent'
  });
  
  return this.save();
};

// Instance method to add karma
userSchema.methods.addKarma = function(amount, description, type = 'earned') {
  this.karmaBalance += amount;
  if (type === 'earned') {
    this.totalKarmaEarned += amount;
  }
  
  this.karmaTransactions.push({
    type: type,
    amount: amount,
    description: description || 'Karma added'
  });
  
  return this.save();
};

// Instance method to update journey stats
userSchema.methods.updateJourneyStats = function(action, data = {}) {
  switch (action) {
    case 'problem_shared':
      this.journeyStats.totalProblemsShared += 1;
      break;
    case 'guidance_received':
      this.journeyStats.totalGuidanceReceived += 1;
      if (data.emotion) {
        const emotionIndex = this.journeyStats.favoriteEmotions.findIndex(e => e.emotion === data.emotion);
        if (emotionIndex > -1) {
          this.journeyStats.favoriteEmotions[emotionIndex].count += 1;
        } else {
          this.journeyStats.favoriteEmotions.push({ emotion: data.emotion, count: 1 });
        }
      }
      if (data.text) {
        const textIndex = this.journeyStats.mostUsedTexts.findIndex(t => t.text === data.text);
        if (textIndex > -1) {
          this.journeyStats.mostUsedTexts[textIndex].count += 1;
        } else {
          this.journeyStats.mostUsedTexts.push({ text: data.text, count: 1 });
        }
      }
      break;
  }
  
  this.journeyStats.lastActiveDate = new Date();
  return this.save();
};

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ 'journeyStats.lastActiveDate': -1 });

module.exports = mongoose.model('User', userSchema);