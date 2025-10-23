import { Form } from './Form';
import { IEvents } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';

interface IContactsForm {
  email?: string;
  phone?: string;
}

export class FormContacts extends Form<IContactsForm> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLFormElement) {
    super(events, container);

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.form);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.form);

    this.emailInput.addEventListener('input', () => {
      this.events.emit('contacts:change', {
        email: this.emailInput.value,
        phone: this.phoneInput.value,
      });
    });

    this.phoneInput.addEventListener('input', () => {
      this.events.emit('contacts:change', {
        email: this.emailInput.value,
        phone: this.phoneInput.value,
      });
    });
  }
}