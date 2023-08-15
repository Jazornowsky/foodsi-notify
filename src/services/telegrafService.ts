import { Telegraf } from 'telegraf';
import ConfigEntries from '../interfaces/configEntries';
import ConfigService from './configService';

export default class TelegrafService {
  private readonly bot: Telegraf;
  private readonly appConfigService: ConfigService;

  constructor(appConfigService: ConfigService) {
    this.appConfigService = appConfigService;
    this.bot = new Telegraf(appConfigService.config.telegramToken);
    this.bot.start((ctx) => {
      ctx.reply(`Registered chat id: ${ctx.chat.id}`);
      appConfigService.config.chatId = ctx.chat.id;
      appConfigService.save();
    });
    this.bot.help((ctx) => {
      ctx.reply(
        'Use /start to register bot with chatId and receive Foodsi updates about packages.'
      );
    });
    this.bot.launch();
  }

  sendMsg(msg: string) {
    this.bot.telegram.sendMessage(this.appConfigService.config.chatId, msg, {
      parse_mode: 'HTML',
    });
  }
}
