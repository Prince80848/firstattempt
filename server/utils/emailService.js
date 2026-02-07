const nodemailer = require('nodemailer');

// Create transporter for sending emails
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Send password reset OTP email
const sendPasswordResetEmail = async (email, otp, userName) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"FirstAttempt" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '🔐 Password Reset OTP - FirstAttempt',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #151370, #312e81); padding: 30px; border-radius: 15px 15px 0 0; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0;">FirstAttempt</h1>
                        <p style="color: #ffd700; margin: 10px 0 0 0;">एक कदम CA की ओर</p>
                    </div>
                    
                    <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
                        <h2 style="color: #151370; margin-top: 0;">Password Reset Request</h2>
                        
                        <p style="color: #4b5563; font-size: 16px;">
                            Hello${userName ? ` ${userName}` : ''},
                        </p>
                        
                        <p style="color: #4b5563; font-size: 16px;">
                            We received a request to reset your password. Use the OTP below to complete the process:
                        </p>
                        
                        <div style="background: linear-gradient(135deg, #151370, #1e1b4b); padding: 25px; border-radius: 10px; text-align: center; margin: 25px 0;">
                            <p style="color: #ffffff; margin: 0 0 10px 0; font-size: 14px;">Your One-Time Password (OTP)</p>
                            <h1 style="color: #ffd700; font-size: 42px; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">
                                ${otp}
                            </h1>
                        </div>
                        
                        <p style="color: #dc2626; font-size: 14px; text-align: center;">
                            ⏰ This OTP is valid for <strong>10 minutes</strong> only.
                        </p>
                        
                        <p style="color: #6b7280; font-size: 14px;">
                            If you didn't request this password reset, please ignore this email or contact support if you have concerns.
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;">
                        
                        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                            This is an automated message from FirstAttempt.<br>
                            Please do not reply to this email.
                        </p>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 15px 15px; text-align: center; border: 1px solid #e5e7eb; border-top: none;">
                        <p style="color: #6b7280; font-size: 12px; margin: 0;">
                            © ${new Date().getFullYear()} FirstAttempt. All rights reserved.
                        </p>
                        <p style="color: #6b7280; font-size: 12px; margin: 5px 0 0 0;">
                            📞 9931278403 | ✉️ firstattempthelp@gmail.com
                        </p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return { success: false, error: error.message };
    }
};

// Send welcome email
const sendWelcomeEmail = async (email, userName) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"FirstAttempt" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '🎉 Welcome to FirstAttempt - Your CA Journey Begins!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #151370, #312e81); padding: 30px; border-radius: 15px 15px 0 0; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0;">🎓 FirstAttempt</h1>
                        <p style="color: #ffd700; margin: 10px 0 0 0;">एक कदम CA की ओर</p>
                    </div>
                    
                    <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
                        <h2 style="color: #151370; margin-top: 0;">Welcome, ${userName}! 🎉</h2>
                        
                        <p style="color: #4b5563; font-size: 16px;">
                            Congratulations on taking the first step towards becoming a Chartered Accountant!
                        </p>
                        
                        <p style="color: #4b5563; font-size: 16px;">
                            At FirstAttempt, we're committed to helping you succeed with:
                        </p>
                        
                        <ul style="color: #4b5563; font-size: 16px;">
                            <li>Expert mentorship from CA toppers</li>
                            <li>Comprehensive test series</li>
                            <li>1:1 doubt solving sessions</li>
                            <li>Supportive learning community</li>
                        </ul>
                        
                        <div style="text-align: center; margin: 25px 0;">
                            <a href="http://localhost:5173" style="background: #151370; color: #ffffff; padding: 15px 30px; border-radius: 10px; text-decoration: none; font-weight: bold;">
                                Start Learning Now →
                            </a>
                        </div>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 15px 15px; text-align: center; border: 1px solid #e5e7eb; border-top: none;">
                        <p style="color: #6b7280; font-size: 12px; margin: 0;">
                            © ${new Date().getFullYear()} FirstAttempt. All rights reserved.
                        </p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Welcome email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendPasswordResetEmail,
    sendWelcomeEmail
};
