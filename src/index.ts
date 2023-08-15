import { CronJob } from 'cron';
import ConfigService from './services/configService';

import express = require('express');
import FoodsiService from './services/foodsiService';
import TelegrafService from './services/telegrafService';

const app = express();
const port = 3000;
const appConfigService = new ConfigService('./config.json');
const telegrafService = new TelegrafService(appConfigService);
const foodsiService = new FoodsiService(appConfigService, telegrafService);

const jobCheckPackages = new CronJob(
  '*/10 * * * *',
  () => foodsiService.checkNewPackagesAvailability(),
  null,
  true
);

app.get('/offers', (req: any, res: any) => {
  foodsiService.checkNewPackagesAvailability();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
