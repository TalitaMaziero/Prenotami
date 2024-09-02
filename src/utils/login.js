import { By, until } from 'selenium-webdriver';
import logger from './logger.js'

export async function login(driver) {
    try {

        const isLoggedIn = await driver.findElements(By.className('loggedin'));

        if (isLoggedIn.length > 0) {
            console.log('Já está logado.');
            return true; 
        }

        console.log('Iniciando o processo de login.');

        await driver.findElement(By.id('login-email')).sendKeys(process.env.LOGIN_EMAIL);
        await driver.findElement(By.id('login-password')).sendKeys(process.env.LOGIN_PASSWORD);

        const loginButton = await driver.findElement(By.css('button.primary.g-recaptcha'));
        await loginButton.click();

        await driver.wait(until.elementLocated(By.className('loggedin')), 10000);
        
        console.log('Login realizado com sucesso.');
        logger.info('Login realizado com sucesso.');
        return true;

    } catch (err) {
        console.error('Erro ao verificar ou realizar login:', err);
        logger.error(err);
        throw err;  
    }
}
