import { ensureElement } from '../../../utils/utils';
import { Card } from './Card';
import { IProduct } from '../../../types';

export interface ICardBasketActions {
  onDelete: () => void;
}

export type TCardBasket = Pick<IProduct, 'id'>

export class CardBasket extends Card<TCardBasket> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardBasketActions) {
    super(container);
    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    if (actions?.onDelete) {
      this.deleteButton.addEventListener('click', actions.onDelete);
    }
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
