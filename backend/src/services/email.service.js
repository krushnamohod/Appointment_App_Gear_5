import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_EMAIL || "detectivefire69@gmail.com",
        pass: process.env.SMTP_PASSWORD || "myuh lwgj xibt diow",
    },
});

export async function sendOTPEmail(email, otp) {
    const mailOptions = {
        from: `"Appointment App" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: "Your Verification Code",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center;">Verification Code</h2>
        <p style="color: #666; text-align: center;">Use the following code to verify your email:</p>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #333;">${otp}</span>
        </div>
        <p style="color: #999; font-size: 12px; text-align: center;">This code expires in 5 minutes.</p>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
}

export function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
