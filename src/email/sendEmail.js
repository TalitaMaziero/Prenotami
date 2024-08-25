import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const logDir = path.join(__dirname, '..', '..', 'logs');
const logFilePath = path.join(logDir, 'agendamento_log.txt');

function ensureLogDirExists() {
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
}

export async function sendEmailWithAttachment(filePath) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'your_email@gmail.com', 
        subject: 'Captura de Tela Prenotami',
        text: 'O Prenotami retornou uma mensagem diferente, veja em anexo a captura de tela.',
        attachments: [
            {
                filename: 'screenshot.png',
                path: filePath
            }
        ]
    };

    ensureLogDirExists();  

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email enviado com sucesso!');
        const logMessage = `${new Date().toLocaleString()} - Email enviado com sucesso!\n`;
        fs.appendFileSync(logFilePath, logMessage);
    } catch (error) {
        console.error('Erro ao enviar o email:', error);
        const logMessage = `${new Date().toLocaleString()} - ${error}\n`;
        fs.appendFileSync(logFilePath, logMessage);
    }
}
