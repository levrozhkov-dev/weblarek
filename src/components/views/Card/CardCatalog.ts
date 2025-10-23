import { CardProductBase } from './CardProductBase';
import { IProduct } from '../../../types';
import { IEvents } from '../../base/Events';

export type TCardCatalog = Pick<IProduct, 'image' | 'category'>

export class CardCatalog extends CardProductBase<TCardCatalog> {
  constructor(container: HTMLElement, protected events: IEvents, private product: IProduct) {
    super(container);

    this.container.addEventListener('click', () => {
      this.events.emit('card:open', this.product);
    });
  }
}