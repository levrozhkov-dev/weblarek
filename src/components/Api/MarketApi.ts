import { IApi, IProductsResponse, IOrder, IOrderResponse } from '../../types/index';

export class MarketApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  // Получение массива товаров
  getProducts(): Promise<IProductsResponse> {
    return this.api.get('/product/') as Promise<IProductsResponse>;
  }

  // Создание заказа
  createOrder(order: IOrder): Promise<IOrderResponse> {
    return this.api.post('/order/', order) as Promise<IOrderResponse>;
  }
}