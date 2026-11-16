const mongoose = require('mongoose');
const Member = require('../models/member.model');
const Feedback = require('../models/feedback.model');

const createMember = async (req, res, next) => {
  try {
    const { name, phoneNumber, cohort, teamName } = req.body ?? {};

    if (!name || !phoneNumber || cohort === undefined || cohort === null || !teamName) {
      return res.status(400).json({
        message: 'name, phoneNumber, cohort, and teamName are required',
      });
    }

    const member = await Member.create({ name, phoneNumber, cohort, teamName });
    res.status(201).json(member);
  } catch (error) {
    next(error);
  }
};

const getMembers = async (req, res, next) => {
  try {
    const teamName = req.query['team-name'];

    if (teamName !== undefined && typeof teamName !== 'string') {
      return res.status(400).json({ message: 'Invalid team name' });
    }

    const filter = teamName ? { teamName } : {};
    const members = await Member.find(filter)
      .select('_id name cohort teamName')
      .sort({ createdAt: 1 });

    res.status(200).json(members);
  } catch (error) {
    next(error);
  }
};

const deleteMember = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid member ID' });
    }

    const member = await Member.findByIdAndDelete(id);

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    await Feedback.deleteMany({ memberId: member._id });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMember,
  getMembers,
  deleteMember,
};
