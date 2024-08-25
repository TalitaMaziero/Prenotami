import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function takeScreenshot(driver) {
    try {
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const screenshotPath = path.join(__dirname, '..', 'screenshots', `screenshot_${timestamp}.png`);

        const screenshot = await driver.takeScreenshot();
        fs.writeFileSync(screenshotPath, screenshot, 'base64');

        return screenshotPath;

    } catch (error) {
        console.error('Erro ao tirar captura de tela:', error);
        throw error;
    }
}
