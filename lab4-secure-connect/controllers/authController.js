const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const appEvents = require('../events/appEvents');

const SALT_ROUNDS = 10;
const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour (keep in sync with expiresIn below)

const baseCookieOptions = {
  httpOnly: true, // not readable from JavaScript
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
};

const isString = (v) => typeof v === 'string';

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // typeof checks also block NoSQL-injection payloads like { "$ne": null }
    if (![username, email, password].every(isString) || !username.trim() || !email.trim() || !password) {
      return res.status(400).json({ message: 'username, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({
      $or: [{ email: email.trim().toLowerCase() }, { username: username.trim() }],
    });
    if (existing) {
      return res.status(409).json({ message: 'Username or email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    // role is never taken from the request body, so it always defaults to 'user'
    const user = await User.create({ username, email, password: hashedPassword });

    appEvents.emit('UserRegistered', { id: user.id, username: user.username, email: user.email });

    return res.status(201).json({
      message: 'User registered',
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Username or email already in use' });
    }
    console.error('[auth] signup error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!isString(email) || !isString(password) || !email.trim() || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    const isMatch = user ? await bcrypt.compare(password, user.password) : false;

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.cookie('token', token, { ...baseCookieOptions, maxAge: TOKEN_TTL_MS });
    appEvents.emit('UserLoggedIn', { id: user.id, username: user.username });

    return res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('[auth] login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token', baseCookieOptions);
  return res.status(200).json({ message: 'Logged out' });
};