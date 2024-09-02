import { Builder, By, until } from 'selenium-webdriver';
import dotenv from 'dotenv';
import takeScreenshot from './screenShot.js';
import { sendEmailWithAttachment } from './email/sendEmail.js';
import { login } from './utils/login.js';
import logger from './utils/logger.js';

dotenv.config();

let searchCounter = 0;

async function handleModalAndNotify(driver) {
    let logMessage;

    try {
        const modalElements = await driver.findElements(By.css('.jconfirm-content'));

        if (modalElements.length > 0) {
            const alertBox = modalElements[0];
            const message = await alertBox.getText();

            if (message.includes('Sorry, all appointments for this service are currently booked. Please check again tomorrow for cancellations or new appointments.')) {
                logMessage =  `Não há vagas disponíveis: ${message}\n`;
            } else {
                logMessage = `Mensagem diferente encontrada \n`;
                const screenshotPath = await takeScreenshot(driver);
                await sendEmailWithAttachment(screenshotPath);
            }

            logger.info(logMessage);
          
            const closeButton = await driver.findElement(By.css('.jconfirm-buttons .btn.btn-blue'));
            await closeButton.click();

        } else {
            logger.info('Modal não encontrada');
            const screenshotPath = await takeScreenshot(driver);
            await sendEmailWithAttachment(screenshotPath);
        }

    } catch (err) {
        logger.error(err);
        await driver.quit(); 
        process.exit(1);
    }
}

async function clickAdvancedAndReserve(driver) {
    try {
        await driver.findElement(By.id('advanced')).click();
        await driver.wait(until.elementLocated(By.css('a[href="/Services/Booking/751"]')), 30000);
        let reserveButton = await driver.findElement(By.css('a[href="/Services/Booking/751"] button'));
        await reserveButton.click();
    } catch (err) {
        logger.error(`Erro ao clicar em 'advanced' ou 'Reservar: ' ${err}`);
        await driver.quit(); 
        process.exit(1);
    }
}

async function startProcess(driver) {

    searchCounter++; 
    logger.info(`Iniciando consulta número: ${searchCounter}`);

    await clickAdvancedAndReserve(driver);
    await handleModalAndNotify(driver);

    if (searchCounter < 5) { 
        setTimeout(() => startProcess(driver), 2 * 60 * 1000); 
    } else {
        logger.info('Número máximo de consultas atingido. Encerrando aplicação.');
        await driver.quit(); 
        process.exit(0);
    }
}

(async function checkBooking() {
    let driver = new Builder().forBrowser('chrome').build();

    try {
        await driver.get('https://prenotami.esteri.it/Home?ReturnUrl=%2fUserArea');

        const isLoggedIn = await login(driver);

        if (isLoggedIn) {
            await startProcess(driver);
        }

    } catch (err) {
        logger.error(err);
        await driver.quit(); 
        process.exit(1);
    }
})();