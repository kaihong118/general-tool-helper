import TelegramBot from 'node-telegram-bot-api';
import cron from 'node-cron';

const TOKEN = '7593100066:AAE_j1eXXY18ocodInMiegJko3foW1KXxRw';
const CHAT_ID = '-4623064474'; // your group chat_id

const bot = new TelegramBot(TOKEN, { polling: false });

// Send once at 8:00 AM daily
// cron.schedule('0 8 * * *', () => {
//   bot.sendMessage(CHAT_ID, '起身返工啦 ⏰');
// });

// (Optional) Every 30 minutes between 8–10
// cron.schedule('0,30 8-9 * * *', () => {
//   bot.sendMessage(CHAT_ID, 'Morning call! 起身返工啦 🚀');
// });

// Run every 10 seconds between 8:00 and 9:59
cron.schedule('*/10 * * * * *', () => {
  bot.sendMessage(CHAT_ID, '起身返工啦 ⏰');
});
