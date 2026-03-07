const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');

// @desc    Send contact us email
// @route   POST /api/contact
// @access  Public
const sendContactEmail = asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    // Set up nodemailer transporter
    // Note: For production, use real SMTP credentials in .env
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'test@example.com',
            pass: process.env.EMAIL_PASS || 'testpassword',
        },
    });

    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`, // Must send from the authenticated email
        replyTo: email, // If admin clicks 'Reply', it goes to the customer
        to: process.env.EMAIL_USER || 'admin@dandiyakart.com',
        subject: `DandiyaKart Contact Form: ${subject}`,
        html: `
            <h3>New Contact Request</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr />
            <h4>Message:</h4>
            <p>${message}</p>
        `,
    };

    try {
        // If dummy credentials are used, we just simulate success to prevent crashing
        if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'test@example.com') {
            console.log('Simulation Mode: Contact email would have been sent:', mailOptions);
            return res.json({ success: true, message: 'Message sent successfully (Simulated)' });
        }

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Email send error:', error);
        res.status(500);
        throw new Error('Could not send email. Please try again later.');
    }
});

module.exports = { sendContactEmail };
