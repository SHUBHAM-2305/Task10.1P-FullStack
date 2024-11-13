require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const port = 3001;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse form data (for POST requests)
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add this middleware to parse JSON requests

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// POST route to handle signup form submission and send welcome email
app.post('/', (req, res) => {
    console.log(req.body); // Log the entire body to debug

    const { email } = req.body;
    console.log('Email:', email); // Log the email to check if it's being received

    if (!email) {
        return res.status(400).json({ success: false, message: 'No Email provided' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to DEV@Deakin',
        text: 'Thank you for signing up for DEV@Deakin!',
        html: '<strong>Thank you for signing up for DEV@Deakin!</strong>'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: 'Error sending email' });
        }
        res.status(200).json({ success: true, message: 'Congratulations!!!!..You subscribed Successfully' });
        console.log('Email sent:', info.response);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
