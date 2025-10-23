import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

export class Cart {
  private items: IProduct[] = [];
  private events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    this.items.push(product);
    this.events.emit('cart:change', this.items.slice());
  }

  removeItem(product: IProduct): void {
    this.items = this.items.filter(item => item.id !== product.id);
    this.events.emit('cart:change', this.items.slice());
  }

  clear(): void {
    this.items = [];
    this.events.emit('cart:change', this.items.slice());
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
}