export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type TPayment = 'card' | 'cash' | '';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Интерфейс товара
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Интерфейс покупателя
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// Данные, отправляемые на сервер при оформлении заказа
export interface IOrder extends IBuyer {
  total: number;
  items: string[];
}

// Данные, возвращаемые сервером после оформления заказа
export interface IOrderResponse {
  id: string;
  total: number;
}