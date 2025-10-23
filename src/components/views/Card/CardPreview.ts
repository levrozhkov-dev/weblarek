import { ensureElement } from '../../../utils/utils';
import { CardProductBase } from './CardProductBase';
import { IProduct } from '../../../types';

export interface ICardPreviewActions {
  onToggleBasket?: (inBasket: boolean) => void;
}

export type TCardPreview = Pick<IProduct, 'image' | 'category' | 'description'>

export class CardPreview extends CardProductBase<TCardPreview>  {
  protected descriptionElement: HTMLElement;
  protected actionButton: HTMLButtonElement;

  private inBasket = false;
  private available = true;

  constructor(container: HTMLElement, actions?: ICardPreviewActions) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.actionButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.actionButton.addEventListener('click', () => {
      if (!this.available) return;

      actions?.onToggleBasket?.(!this.inBasket);
    });
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  setInBasket(value: boolean) {
    if (!this.available) return; 

    this.inBasket = value;
    this.actionButton.textContent = value ? 'Удалить из корзины' : 'Купить';
    this.actionButton.classList.toggle('card__button_remove', value);
  }

  setAvailable(value: boolean) {
    this.available = value;
    if (!value) {
      this.actionButton.textContent = 'Недоступно';
      this.actionButton.disabled = true;
      this.actionButton.classList.remove('card__button_remove');
    } else {
      this.actionButton.disabled = false;
      this.setInBasket(this.inBasket);
    }
  }
}