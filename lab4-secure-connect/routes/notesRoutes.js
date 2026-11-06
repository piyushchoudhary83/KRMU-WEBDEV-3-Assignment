const express = require('express');
const authMiddleware = require('../middleware/auth');
const { createNote, getNotes, updateNote, deleteNote } = require('../controllers/notesController');

const router = express.Router();

router.use(authMiddleware); // every notes route is protected

router.route('/').post(createNote).get(getNotes);
router.route('/:id').put(updateNote).delete(deleteNote);

module.exports = router;