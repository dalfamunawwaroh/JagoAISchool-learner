import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });
async function main() {
    console.log('Starting SMTP test...');
    console.log('SMTP_EMAIL:', process.env.SMTP_EMAIL);
    console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? '***' : 'not defined');
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL || 'admin.jagoaischool@gmail.com',
            pass: process.env.SMTP_PASSWORD || 'gcxx rlkf wngu uxsc'
        }
    });
    try {
        console.log('Verifying transporter connection...');
        await transporter.verify();
        console.log('SUCCESS: SMTP connection verified!');
        console.log('Sending a test email...');
        const info = await transporter.sendMail({
            from: `"SMTP Test" <${process.env.SMTP_EMAIL || 'admin.jagoaischool@gmail.com'}>`,
            to: process.env.SMTP_EMAIL || 'admin.jagoaischool@gmail.com',
            subject: 'SMTP Test Email',
            text: 'This is a test email to verify SMTP settings.'
        });
        console.log('SUCCESS: Test email sent!', info.messageId);
    }
    catch (error) {
        console.error('FAILURE: SMTP test failed with error:', error);
    }
}
main();
