export class ConfigService {
  private readonly envConfig: { [key: string]: any } = {};

  constructor() {
    this.envConfig.port = process.env.API_PORT || 8000;
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
