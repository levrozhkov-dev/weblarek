import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

export class Products {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;
  private events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  setProducts(products: IProduct[]): void {
    this.products = products.slice();
    this.events.emit('products:change', this.products.slice());
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct {
    const product = this.products.find(product => product.id === id);
    if (!product) {
      throw new Error(`Товар с id ${id} не найден`);
    }
    return product;
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit('product:selected', product);
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}