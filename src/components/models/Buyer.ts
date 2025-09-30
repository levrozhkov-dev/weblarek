import { IBuyer } from '../../types/index';

export class Buyer {
  private data: Partial<IBuyer> = {};

  setData(data: Partial<IBuyer>): void {
    this.data = { ...this.data, ...data };
  }

  getData(): Partial<IBuyer> {
    return this.data;
  }

  clear(): void {
    this.data = {};
  }

  validate(): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!this.data.payment) errors.payment = 'Не выбран вид оплаты';
    if (!this.data.email) errors.email = 'Укажите email';
    if (!this.data.phone) errors.phone = 'Укажите номер телефона';
    if (!this.data.address) errors.address = 'Укажите адрес';

    return errors;
  }
}