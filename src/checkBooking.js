import { Builder, By, until } from 'selenium-webdriver';
import dotenv from 'dotenv';
import takeScreenshot from './screenShot.js';
import { sendEmailWithAttachment } from './email/sendEmail.js';
import { login } from './utils/login.js';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logErrorPath = path.join(__dirname, '..', 'logs', 'agendamento_error_log.txt');
const logPath = path.join(__dirname, '..', 'logs', 'agendamento_log.txt');

async function clickAdvancedAndReserve(driver) {
    try {
        await driver.findElement(By.id('advanced')).click();
        await driver.wait(until.elementLocated(By.css('a[href="/Services/Booking/751"]')), 30000);
        let reserveButton = await driver.findElement(By.css('a[href="/Services/Booking/751"] button'));
        await reserveButton.click();
    } catch (err) {
        const logMessage = `${new Date().toLocaleString()} - Erro ao clicar em 'advanced' ou 'Reservar': ${err}\n`;
        fs.appendFileSync(logErrorPath, logMessage);
    }
}

(async function checkBooking() {
    let driver = new Builder().forBrowser('chrome').build();

    try {
        await driver.get('https://prenotami.esteri.it/Home?ReturnUrl=%2fUserArea');

        await login(driver);
        await clickAdvancedAndReserve(driver);

        try {
            await driver.wait(until.elementLocated(By.css('.jconfirm-content')), 10000);
            const alertBox = await driver.findElement(By.css('.jconfirm-content'));
            const message = await alertBox.getText();
            let logMessage;

            if (message.includes('Sorry, all appointments for this service are currently booked. Please check again tomorrow for cancellations or new appointments.')) {
                logMessage = `${new Date().toLocaleString()} - Não há vagas disponíveis: ${message}\n`;
            } else {
                logMessage = `${new Date().toLocaleString()} - Mensagem diferente encontrada: ${message}\n`;
                const screenshotPath = await takeScreenshot(driver);
                await sendEmailWithAttachment(screenshotPath);
            }

            fs.appendFileSync(logPath, logMessage);
        } catch (err) {
            console.log('error: ', err);
            const logMessage = `${new Date().toLocaleString()} - ${err}\n`;
            fs.appendFileSync(logErrorPath, logMessage);
        }
    } finally {
        await driver.quit();
    }
})();
