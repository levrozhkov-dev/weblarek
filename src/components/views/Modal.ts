import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Modal extends Component<{}> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);

    this.closeButton.addEventListener('click', () => {
      this.events.emit('modal:close-click');
    });

    this.container.addEventListener('click', (e: MouseEvent) => {
      if (e.target === this.container) {
        this.events.emit('modal:close-click');
      }
    });
  }

  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  show() {
    this.container.classList.add('modal_active');
  }

  hide() {
    this.container.classList.remove('modal_active');
  }
}