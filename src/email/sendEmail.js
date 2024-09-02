import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import logger from '../utils/logger.js'; 

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});


export async function sendEmailWithAttachment(filePath) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'talita354@gmail.com',
        subject: 'Captura de Tela Prenotami',
        text: 'O Prenotami retornou uma mensagem diferente, veja em anexo a captura de tela.',
        attachments: [
            {
                filename: 'screenshot.png',
                path: filePath
            }
        ]
    };

    try {
        await transporter.sendMail(mailOptions);
        logger.info('Email enviado com sucesso!');
    } catch (error) {
        logger.error(`Erro ao enviar o email: ${error}`);
    }
}
