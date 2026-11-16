const mongoose = require('mongoose');

const memberSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    cohort: {
      type: Number,
      required: [true, 'Cohort is required'],
    },
    teamName: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Member', memberSchema);
