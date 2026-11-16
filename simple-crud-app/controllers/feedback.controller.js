const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Member = require('../models/member.model');
const Feedback = require('../models/feedback.model');

const createFeedback = async (req, res, next) => {
  try {
    const { password, memberId, rating, content } = req.body ?? {};

    if (
      typeof password !== 'string' ||
      !password ||
      !memberId ||
      rating === undefined ||
      rating === null ||
      typeof content !== 'string' ||
      !content
    ) {
      return res.status(400).json({
        message: 'password, memberId, rating, and content are required',
      });
    }

    if (!mongoose.isValidObjectId(memberId)) {
      return res.status(400).json({ message: 'Invalid member ID' });
    }

    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const feedback = await Feedback.create({
      passwordHash,
      memberId,
      rating,
      content,
    });

    res.status(201).json(feedback);
  } catch (error) {
    next(error);
  }
};

const getFeedbacks = async (req, res, next) => {
  try {
    const memberId = req.query['member-id'];

    if (memberId !== undefined && typeof memberId !== 'string') {
      return res.status(400).json({ message: 'Invalid member ID' });
    }

    if (memberId && !mongoose.isValidObjectId(memberId)) {
      return res.status(400).json({ message: 'Invalid member ID' });
    }

    const filter = memberId ? { memberId } : {};
    const feedbacks = await Feedback.find(filter).sort({ createdAt: 1 });

    res.status(200).json(feedbacks);
  } catch (error) {
    next(error);
  }
};

const updateFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const password = req.headers.password;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid feedback ID' });
    }

    const feedback = await Feedback.findById(id).select('+passwordHash');

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (!password || !(await bcrypt.compare(password, feedback.passwordHash))) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const { rating, content } = req.body ?? {};

    if (rating === undefined && content === undefined) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    if (rating !== undefined) {
      feedback.rating = rating;
    }

    if (content !== undefined) {
      feedback.content = content;
    }

    await feedback.save();

    res.status(200).json(feedback);
  } catch (error) {
    next(error);
  }
};

const deleteFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const password = req.headers.password;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid feedback ID' });
    }

    const feedback = await Feedback.findById(id).select('+passwordHash');

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (!password || !(await bcrypt.compare(password, feedback.passwordHash))) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    await feedback.deleteOne();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFeedback,
  getFeedbacks,
  updateFeedback,
  deleteFeedback,
};
