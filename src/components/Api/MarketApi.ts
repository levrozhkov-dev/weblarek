import { IApi, IProduct, IOrder, IOrderResponse } from '../../types/index';

export class MarketApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  // Получение массива товаров
  getProducts(): Promise<IProduct[]> {
    return this.api.get('/product/') as Promise<IProduct[]>;
  }

  // Создание заказа
  createOrder(order: IOrder): Promise<IOrderResponse> {
    return this.api.post('/order/', order) as Promise<IOrderResponse>;
  }
}