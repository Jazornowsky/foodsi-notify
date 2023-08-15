import axios, { AxiosInstance } from 'axios';
import { AxiosHeaders, RawAxiosRequestHeaders } from 'axios';
import ConfigService from './configService';
import TelegrafService from './telegrafService';
import { AuthHeader } from '../interfaces/authHeader';
import PackageDay from '../interfaces/package';
import Restaurant from '../interfaces/restaurant';

export default class FoodsiService {
  private readonly appConfigService: ConfigService;
  private readonly telegrafService: TelegrafService;
  private readonly http: AxiosInstance;
  private authHeader: AuthHeader | undefined;
  private favouriteRestaurantsIds: number[] = [];
  private restaurantsPackages: Record<number, PackageDay> = {};

  constructor(
    appConfigService: ConfigService,
    telegrafService: TelegrafService
  ) {
    this.appConfigService = appConfigService;
    this.telegrafService = telegrafService;
    this.http = axios.create({
      baseURL: appConfigService.config.foodsi.api.baseUrl,
      headers: {
        'Content-type': appConfigService.config.foodsi.api.request.contentType,
        'system-version':
          appConfigService.config.foodsi.api.request.systemVersion,
        'user-agent': appConfigService.config.foodsi.api.request.userAgent,
      },
    });
  }

  async checkNewPackagesAvailability() {
    let restaurants = await this.fetchRestaurants();
    if (!restaurants) return;
    this.filterFavouriteRestaurants(restaurants);
    restaurants.forEach((restaurant, index) => {
      const packageId = restaurant?.package_id;
      const packageDay = restaurant?.package_day;
      if (!packageId || !packageDay) return;
      const packageDayPrevious = this.restaurantsPackages?.[packageId];
      this.restaurantsPackages[packageId] = packageDay;
      const mealsLeftPrevious = packageDayPrevious?.meals_left ?? 0;
      const mealsLeftCurrent = packageDay?.meals_left ?? 0;
      if (mealsLeftCurrent > 0 && mealsLeftPrevious == 0) {
        this.telegrafService.sendMsg(
          `Pojawiły się nowe paczki w <b>${restaurant.name}</b>
            <a href="${restaurant?.image?.url}">&#8205;</a>`
        );
      }
    });
  }

  private async login() {
    const response = await this.http.post('api/v2/auth/sign_in', {
      email: this.appConfigService.config.foodsi.email,
      password: this.appConfigService.config.foodsi.password,
    });
    if (response.status !== 200) {
      this.telegrafService.sendMsg(
        `Login failed. Reason: ${response.statusText}`
      );
      console.error('Login failed.', response.statusText);
      return;
    }
    const headers = response.headers;
    this.authHeader = {
      'Access-Token': headers['access-token'],
      Client: headers['client'],
      Uid: headers['uid'],
    };
    this.favouriteRestaurantsIds =
      response['data']['data']['favourite_restaurants'];
  }

  private async fetchRestaurants() {
    if (!this.authHeader) await this.login();
    const response = await this.http.post(
      'api/v2/restaurants',
      {
        page: 1,
        per_page: 50,
        distance: {
          lat: this.appConfigService.config.foodsi.lat,
          lng: this.appConfigService.config.foodsi.lng,
          range: this.appConfigService.config.foodsi.range * 1000,
        },
        hide_unavailable: false,
        food_type: [],
        collection_time: {
          from: '00:00:00',
          to: '23:59:59',
        },
      },
      {
        headers: this.authHeader as any,
      }
    );
    if (response.status !== 200) {
      this.telegrafService.sendMsg(
        `Restaurants fetch failed. Reason: ${response.statusText}`
      );
      console.error('Restaurats fetch failed.', response.statusText);
      return;
    }
    return response['data']['data'] as Restaurant[];
  }

  private filterFavouriteRestaurants(restaurants: Restaurant[]) {
    if (this.appConfigService.config.foodsi.onlyFavouriteRestaurants) {
      return restaurants.filter((restaurant) =>
        this.favouriteRestaurantsIds.includes(restaurant.id)
      );
    }
    return restaurants;
  }
}
