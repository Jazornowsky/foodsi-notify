import * as fs from 'fs';
import ConfigEntries from '../interfaces/configEntries';

export default class ConfigService {
  private readonly configPath: string;
  readonly config: ConfigEntries

  constructor(path: string) {
    this.configPath = path;
    this.config = this.read();
  }

  save() {
    this.write();
  }

  private read(): ConfigEntries {
    // fs.readFileSync(this.configPath, (err, data: Buffer) => {
    //   if (err) {
    //     throw err;
    //   }
    //   return JSON.parse(data.toString('utf-8')) as ConfigEntries;
    // });
    const data = fs.readFileSync(this.configPath, {
      encoding: 'utf-8',
    });
    return JSON.parse(data) as ConfigEntries;
  }

  private write() {
    fs.writeFile(
      this.configPath,
      JSON.stringify(this.config),
      {
        encoding: 'utf-8',
        flag: 'w',
      },
      (err) => {
        console.error("Error during config save.", err);
      }
    );
  }
}
