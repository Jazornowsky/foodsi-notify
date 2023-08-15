export default interface ConfigEntries {
  chatId: number;
  foodsi: {
    email: string;
    password: string;
    lat: number;
    lng: number;
    range: number;
    onlyFavouriteRestaurants: boolean;
    api: {
      baseUrl: string;
      request: {
        contentType: string;
        systemVersion: string;
        userAgent: string;
      };
    };
  };
  telegramToken: string;
}
