import { Form } from './Form';
import { IEvents } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';

interface IPaymentForm {
  payment?: string;
  address?: string;
}

export class FormPaymentType extends Form<IPaymentForm> {
  protected buttons: NodeListOf<HTMLButtonElement>;
  protected addressInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLFormElement) {
    super(events, container);

    this.buttons = this.form.querySelectorAll('.order__buttons .button');
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.form);

    this.buttons.forEach((btn) =>
      btn.addEventListener('click', () => {
        this.buttons.forEach((b) => b.classList.remove('button_alt-active'));
        btn.classList.add('button_alt-active');
        this.events.emit('payment:select', { payment: btn.name });
      })
    );

    this.addressInput.addEventListener('input', () => {
      this.events.emit('address:input', { address: this.addressInput.value });
    });
  }

  reset() {
    super.reset();
    this.buttons.forEach((b) => b.classList.remove('button_alt-active'));
  }
}