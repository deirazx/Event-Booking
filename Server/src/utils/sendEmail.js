const transporter = require("../config/nodemailer");

const sendEmail = async (to, subject, text) => {
    try {
        let recipient = to;
        let mailSubject = subject;
        let mailText = text;

        // Support both object syntax and positional arguments
        if (typeof to === "object" && to !== null) {
            recipient = to.to;
            mailSubject = to.subject;
            mailText = to.text || to.html;
        }

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: recipient,
            subject: mailSubject,
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2 style="color: #111;">${mailSubject}</h2>
                    <p style="color: #555; font-size: 16px;">${mailText}</p>
                </div>
            `
        });
        console.log("Email sent successfully:", info.messageId);
        return info;
    } catch (error) {
        console.error("Error in sendEmail utility:", error);
        throw error;
    }
};

module.exports = sendEmail;