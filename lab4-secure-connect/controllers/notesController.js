const mongoose = require('mongoose');
const Note = require('../models/Note');
const appEvents = require('../events/appEvents');

const isAdmin = (req) => req.user.role === 'admin';
const isString = (v) => typeof v === 'string';

// Loads a note and checks the caller may touch it. Sends the error response itself and returns null on failure.
async function getAuthorizedNote(req, res) {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: 'Invalid note id' });
    return null;
  }

  const note = await Note.findById(id);
  if (!note) {
    res.status(404).json({ message: 'Note not found' });
    return null;
  }

  if (!isAdmin(req) && note.owner.toString() !== req.user.userId) {
    res.status(403).json({ message: 'Not allowed to access this note' });
    return null;
  }

  return note;
}

exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!isString(title) || !isString(content) || !title.trim() || !content.trim()) {
      return res.status(400).json({ message: 'title and content are required' });
    }

    const note = await Note.create({ title, content, owner: req.user.userId });
    appEvents.emit('NoteCreated', { id: note.id, owner: req.user.userId });

    return res.status(201).json(note);
  } catch (err) {
    console.error('[notes] create error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getNotes = async (req, res) => {
  try {
    // RBAC: admins see every note, normal users only their own
    const filter = isAdmin(req) ? {} : { owner: req.user.userId };
    const notes = await Note.find(filter).sort({ createdAt: 1 });

    return res.status(200).json(notes);
  } catch (err) {
    console.error('[notes] list error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const note = await getAuthorizedNote(req, res);
    if (!note) return;

    const { title, content } = req.body;
    if (title !== undefined) {
      if (!isString(title) || !title.trim()) return res.status(400).json({ message: 'Invalid title' });
      note.title = title;
    }
    if (content !== undefined) {
      if (!isString(content) || !content.trim()) return res.status(400).json({ message: 'Invalid content' });
      note.content = content;
    }

    await note.save();
    return res.status(200).json(note);
  } catch (err) {
    console.error('[notes] update error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await getAuthorizedNote(req, res);
    if (!note) return;

    await note.deleteOne();
    return res.status(200).json({ message: 'Note deleted' });
  } catch (err) {
    console.error('[notes] delete error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};