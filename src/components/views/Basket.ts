import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IBasket {
  total: number;
}

export class Basket extends Component<IBasket> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected orderButton: HTMLButtonElement;
  protected emptyTextElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
    this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
    this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    this.emptyTextElement = document.createElement('div');
    this.emptyTextElement.textContent = 'Корзина пуста';
    this.emptyTextElement.classList.add('basket__empty');

    this.orderButton.addEventListener('click', () => {
      this.events.emit('order:open');
    });

    this.listElement.replaceChildren(this.emptyTextElement);
    this.orderButton.disabled = true;
  }

  set items(elements: HTMLElement[]) {
    if (elements.length === 0) {
      this.listElement.replaceChildren(this.emptyTextElement);
      this.orderButton.disabled = true;
    } else {
      this.listElement.replaceChildren(...elements);
      this.orderButton.disabled = false;
    }
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }
}