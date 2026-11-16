const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema(
  {
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: [true, 'Member ID is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const removePassword = (document, returned) => {
  delete returned.passwordHash;
  return returned;
};

feedbackSchema.set('toJSON', { transform: removePassword });
feedbackSchema.set('toObject', { transform: removePassword });

module.exports = mongoose.model('Feedback', feedbackSchema);
