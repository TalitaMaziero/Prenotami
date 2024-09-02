import cron from 'node-cron';
import { exec } from 'child_process';
console.log('connected!')

// Start Prenotami service
function startPrenotami() {
  exec('npm start', (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao iniciar o serviço: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Erro: ${stderr}`);
      return;
    }
    console.log(`Serviço iniciado: ${stdout}`);
  });
}

// Schedule to run every day at 10 AM, 7 PM, and 8:05 PM
cron.schedule('0 10 * * *', startPrenotami, { timezone: 'America/Sao_Paulo' });
cron.schedule('0 19 * * *', startPrenotami, { timezone: 'America/Sao_Paulo' });
cron.schedule('0 20 * * *', startPrenotami, { timezone: 'America/Sao_Paulo' });


// Keep script running
setInterval(() => {}, 1 << 30);
