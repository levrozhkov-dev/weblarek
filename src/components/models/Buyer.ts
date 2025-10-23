import { IBuyer, TValidateContext } from '../../types/index';
import { IEvents } from '../base/Events';

export class Buyer {
  private data: Partial<IBuyer> = {};
  private events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  setData(data: Partial<IBuyer>, context: TValidateContext = 'all'): void {
    this.data = { ...this.data, ...data };
    const errors = this.validate(context);
    const hasAnyValue = this.data.payment || this.data.address || this.data.email || this.data.phone;

    this.events.emit('form:update', {
      valid: Object.keys(errors).length === 0,
      errors: hasAnyValue ? errors : {},
    });
  }

  getData(): Partial<IBuyer> {
    return this.data;
  }

  clear(): void {
    this.data = {};
    this.events.emit('form:update', { valid: true, errors: {} });
  }

  validate(context: TValidateContext = 'all') {
    const errors: Record<string, string> = {};

    if (context === 'payment' || context === 'all') {
      if (!this.data.payment) errors.payment = 'Выберите способ оплаты';
      if (!this.data.address) errors.address = 'Необходимо указать адрес';
    }

    if (context === 'contacts' || context === 'all') {
      if (!this.data.email || !this.data.email.includes('@'))
        errors.email = 'Введите корректный email';
      if (!this.data.phone || this.data.phone.length < 10)
        errors.phone = 'Введите корректный телефон';
    }

    return errors;
  }
}