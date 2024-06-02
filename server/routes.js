
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./bd');
const { authenticateToken } = require('./middleware');
// const upload = require('./multer');
const multer  = require('multer')


const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Register endpoint
router.post('/api/register', upload.single("file"), (req, res) => {
    console.log(req.file);
    const { firstName, lastName, gender, dob, email, password } = req.body;
    const profileImage = req?.file ? `../uploads/${req.file.filename}` : '../public/img/images.jpg';

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ message: 'Error hashing password' });

        const sql = 'INSERT INTO users (firstName, lastName, gender, dob, email, password, profileImage) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [firstName, lastName, gender, dob, email, hash, profileImage], (err, result) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            res.json({ message: 'User registered' });
        });
    });
});

// Login endpoint
router.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (results.length === 0) return res.status(401).json({ message: 'Invalid email or password' });

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ message: 'Error comparing passwords' });
            if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

            const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
            res.json({ token });
        });
    });
});

// Get Profile endpoint
router.get('/api/profile', authenticateToken, (req, res) => {
    const sql = 'SELECT firstName, lastName, gender, dob, email, profileImage FROM users WHERE id = ?';
    db.query(sql, [req.user.id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        const user = results[0];
        res.json(user);
    });
});

// Update Profile endpoint
router.put('/api/profile', authenticateToken, upload.single('file'), (req, res) => {
    const { firstName, lastName, gender, dob, email } = req.body;
    const profileImage = req.file ? `/uploads/${req.file.filename}` : req.body.profileImage;
    
    const sql = 'UPDATE users SET firstName = ?, lastName = ?, gender = ?, dob = ?, email = ?, profileImage = ? WHERE id = ?';
    db.query(sql, [firstName, lastName, gender, dob, email, profileImage, req.user.id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'Profile updated' });
    });
});

// Delete Account endpoint
router.delete('/api/profile', authenticateToken, (req, res) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [req.user.id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'Account deleted' });
    });
});

module.exports = router;
