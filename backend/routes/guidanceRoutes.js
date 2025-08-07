const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const nlpService = require('../services/nlpService');
const User = require('../models/User');
const WisdomText = require('../models/WisdomText');
const Guidance = require('../models/Guidance');

const router = express.Router();

// @route   POST /api/guidance/analyze
// @desc    Analyze user problem and provide guidance
// @access  Private
router.post('/analyze', auth, [
  body('problemText')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Problem description must be between 10 and 2000 characters'),
  body('selectedBooks')
    .optional()
    .isArray()
    .withMessage('Selected books must be an array'),
  body('emotions')
    .optional()
    .isArray()
    .withMessage('Emotions must be an array')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { problemText, selectedBooks = [], emotions = [] } = req.body;
    const userId = req.user.id;

    // Get user to check karma balance
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check karma balance
    const karmaCost = parseInt(process.env.GUIDANCE_KARMA_COST) || 15;
    if (user.karmaBalance < karmaCost) {
      return res.status(402).json({
        success: false,
        message: 'Insufficient karma balance',
        requiredKarma: karmaCost,
        currentKarma: user.karmaBalance,
        shortfall: karmaCost - user.karmaBalance
      });
    }

    // Analyze the problem using NLP service
    console.log(`🔍 Processing guidance request for user ${user.firstName}`);
    const analysis = await nlpService.analyzeUserInput(problemText, selectedBooks);

    // Create guidance record
    const guidance = new Guidance({
      userId,
      problemText,
      selectedBooks,
      userEmotions: emotions,
      analysis: analysis.analysis,
      wisdomTexts: analysis.wisdomTexts.map(wt => wt._id),
      guidance: analysis.guidance,
      karmaCost,
      metadata: analysis.metadata
    });

    await guidance.save();

    // Deduct karma from user
    await user.deductKarma(karmaCost, `Guidance session - ${guidance._id}`);

    // Update user journey stats
    await user.updateJourneyStats('problem_shared');
    await user.updateJourneyStats('guidance_received', {
      emotion: analysis.analysis.emotions[0]?.emotion,
      text: analysis.wisdomTexts[0]?.source
    });

    // Increment usage count for used wisdom texts
    if (analysis.wisdomTexts && analysis.wisdomTexts.length > 0) {
      const wisdomTextIds = analysis.wisdomTexts.map(wt => wt._id);
      await WisdomText.updateMany(
        { _id: { $in: wisdomTextIds } },
        { 
          $inc: { 'usage.timesRetrieved': 1 },
          $set: { 'usage.lastUsed': new Date() }
        }
      );
    }

    // Return the complete analysis and guidance
    res.json({
      success: true,
      message: 'Guidance generated successfully',
      data: {
        guidanceId: guidance._id,
        analysis: analysis.analysis,
        wisdomTexts: analysis.wisdomTexts,
        guidance: analysis.guidance,
        metadata: analysis.metadata,
        karmaUsed: karmaCost,
        remainingKarma: user.karmaBalance - karmaCost
      }
    });

  } catch (error) {
    console.error('Guidance analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process guidance request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/guidance/history
// @desc    Get user's guidance history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const guidanceHistory = await Guidance.find({ userId })
      .populate('wisdomTexts', 'sourceDisplayName translations.english speaker audience')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Guidance.countDocuments({ userId });

    res.json({
      success: true,
      data: {
        guidance: guidanceHistory,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get guidance history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve guidance history'
    });
  }
});

// @route   GET /api/guidance/:id
// @desc    Get specific guidance by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const guidanceId = req.params.id;
    const userId = req.user.id;

    const guidance = await Guidance.findOne({ _id: guidanceId, userId })
      .populate('wisdomTexts');

    if (!guidance) {
      return res.status(404).json({
        success: false,
        message: 'Guidance not found'
      });
    }

    res.json({
      success: true,
      data: { guidance }
    });

  } catch (error) {
    console.error('Get guidance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve guidance'
    });
  }
});

// @route   POST /api/guidance/:id/save
// @desc    Save guidance to user's collection
// @access  Private
router.post('/:id/save', auth, [
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('personalNotes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Personal notes cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const guidanceId = req.params.id;
    const userId = req.user.id;
    const { tags = [], personalNotes = '' } = req.body;

    // Check if guidance exists and belongs to user
    const guidance = await Guidance.findOne({ _id: guidanceId, userId });
    if (!guidance) {
      return res.status(404).json({
        success: false,
        message: 'Guidance not found'
      });
    }

    // Get user and check if already saved
    const user = await User.findById(userId);
    const existingSaved = user.savedGuidance.find(sg => sg.guidanceId.toString() === guidanceId);

    if (existingSaved) {
      // Update existing saved guidance
      existingSaved.tags = tags;
      existingSaved.personalNotes = personalNotes;
    } else {
      // Add new saved guidance
      user.savedGuidance.push({
        guidanceId,
        tags,
        personalNotes
      });
    }

    await user.save();

    res.json({
      success: true,
      message: 'Guidance saved successfully'
    });

  } catch (error) {
    console.error('Save guidance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save guidance'
    });
  }
});

// @route   DELETE /api/guidance/:id/save
// @desc    Remove guidance from user's saved collection
// @access  Private
router.delete('/:id/save', auth, async (req, res) => {
  try {
    const guidanceId = req.params.id;
    const userId = req.user.id;

    const user = await User.findById(userId);
    user.savedGuidance = user.savedGuidance.filter(
      sg => sg.guidanceId.toString() !== guidanceId
    );

    await user.save();

    res.json({
      success: true,
      message: 'Guidance removed from saved collection'
    });

  } catch (error) {
    console.error('Remove saved guidance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove saved guidance'
    });
  }
});

// @route   POST /api/guidance/:id/rate
// @desc    Rate a guidance session
// @access  Private
router.post('/:id/rate', auth, [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('feedback')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Feedback cannot exceed 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const guidanceId = req.params.id;
    const userId = req.user.id;
    const { rating, feedback = '' } = req.body;

    // Check if guidance exists and belongs to user
    const guidance = await Guidance.findOne({ _id: guidanceId, userId });
    if (!guidance) {
      return res.status(404).json({
        success: false,
        message: 'Guidance not found'
      });
    }

    // Update guidance rating
    guidance.userRating = rating;
    guidance.userFeedback = feedback;
    await guidance.save();

    // Update wisdom texts ratings
    if (guidance.wisdomTexts && guidance.wisdomTexts.length > 0) {
      for (const wisdomTextId of guidance.wisdomTexts) {
        const wisdomText = await WisdomText.findById(wisdomTextId);
        if (wisdomText) {
          await wisdomText.addRating(rating);
        }
      }
    }

    res.json({
      success: true,
      message: 'Rating submitted successfully'
    });

  } catch (error) {
    console.error('Rate guidance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit rating'
    });
  }
});

// @route   GET /api/guidance/daily-affirmation
// @desc    Get daily affirmation/wisdom quote
// @access  Private
router.get('/daily-affirmation', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    // Check if user has enough karma for daily affirmation
    const karmaCost = parseInt(process.env.DAILY_AFFIRMATION_KARMA_COST) || 5;
    if (user.karmaBalance < karmaCost) {
      return res.status(402).json({
        success: false,
        message: 'Insufficient karma for daily affirmation',
        requiredKarma: karmaCost,
        currentKarma: user.karmaBalance
      });
    }

    // Get a random wisdom text based on user preferences
    let query = { isActive: true };
    if (user.preferences.preferredWisdomTexts.length > 0) {
      query.source = { $in: user.preferences.preferredWisdomTexts };
    }

    // Get positive/uplifting wisdom texts
    query.primaryThemes = { $in: ['hope', 'peace', 'love', 'wisdom', 'gratitude', 'joy'] };

    const wisdomTexts = await WisdomText.find(query).limit(10);
    if (wisdomTexts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No daily affirmations available'
      });
    }

    // Select random wisdom text
    const randomWisdom = wisdomTexts[Math.floor(Math.random() * wisdomTexts.length)];

    // Deduct karma
    await user.deductKarma(karmaCost, 'Daily affirmation');

    // Increment usage
    await randomWisdom.incrementUsage();

    res.json({
      success: true,
      data: {
        wisdom: {
          text: randomWisdom.translations[user.preferences.language] || randomWisdom.translations.english,
          originalText: randomWisdom.originalText,
          source: randomWisdom.sourceDisplayName,
          attribution: randomWisdom.contextualAttribution,
          context: randomWisdom.context
        },
        karmaUsed: karmaCost,
        remainingKarma: user.karmaBalance - karmaCost
      }
    });

  } catch (error) {
    console.error('Daily affirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get daily affirmation'
    });
  }
});

// @route   GET /api/guidance/stats
// @desc    Get user's guidance statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get basic counts
    const totalGuidance = await Guidance.countDocuments({ userId });
    const savedGuidance = await User.findById(userId, 'savedGuidance');
    
    // Get guidance by month for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await Guidance.aggregate([
      {
        $match: {
          userId: require('mongoose').Types.ObjectId(userId),
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          avgRating: { $avg: '$userRating' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Get most common emotions
    const emotionStats = await Guidance.aggregate([
      {
        $match: { userId: require('mongoose').Types.ObjectId(userId) }
      },
      {
        $unwind: '$analysis.emotions'
      },
      {
        $group: {
          _id: '$analysis.emotions.emotion',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    // Get most used wisdom sources
    const sourceStats = await Guidance.aggregate([
      {
        $match: { userId: require('mongoose').Types.ObjectId(userId) }
      },
      {
        $lookup: {
          from: 'wisdomtexts',
          localField: 'wisdomTexts',
          foreignField: '_id',
          as: 'wisdomTexts'
        }
      },
      {
        $unwind: '$wisdomTexts'
      },
      {
        $group: {
          _id: '$wisdomTexts.sourceDisplayName',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    res.json({
      success: true,
      data: {
        totalGuidance,
        savedGuidanceCount: savedGuidance.savedGuidance.length,
        monthlyStats,
        topEmotions: emotionStats,
        topSources: sourceStats,
        generatedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Get guidance stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve guidance statistics'
    });
  }
});

module.exports = router;