const express = require('express');

const router = express.Router();

// Define a GET route for the profile
router.get('/', (req, res) => {
    res.render('profile', {
        title: 'Profile', profile: {
            username: req.user.username,
            email: req.user.email,
            type: req.user.isAdmin ? 'Administrator' : 'User',
            createdAt: req.user.createdAt
        }
    });
});

module.exports = router;