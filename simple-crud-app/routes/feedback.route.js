const express = require('express');
const {
  createFeedback,
  getFeedbacks,
  updateFeedback,
  deleteFeedback,
} = require('../controllers/feedback.controller');

const router = express.Router();

router.post('/', createFeedback);
router.get('/', getFeedbacks);
router.patch('/:id', updateFeedback);
router.delete('/:id', deleteFeedback);

module.exports = router;
