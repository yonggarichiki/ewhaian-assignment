const express = require('express');
const {
  createMember,
  getMembers,
  deleteMember,
} = require('../controllers/member.controller');

const router = express.Router();

router.post('/', createMember);
router.get('/', getMembers);
router.delete('/:id', deleteMember);

module.exports = router;
