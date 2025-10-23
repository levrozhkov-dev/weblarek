import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';

export abstract class Form<T> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorElement: HTMLElement;
  protected form: HTMLFormElement;

  constructor(protected events: IEvents, container: HTMLFormElement) {
    super(container);

    this.form = container;
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.form);
    this.errorElement = ensureElement<HTMLElement>('.form__errors', this.form);

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit(`${this.form.name}:submit`);
    });

    this.events.on('form:update', (data: { valid: boolean; errors: Record<string, string> }) => {
      this.valid = data.valid;

      const formName = this.form.name;
      const formErrors = Object.entries(data.errors)
        .filter(([key]) => formName === 'order' ? ['payment', 'address'].includes(key) : ['email', 'phone'].includes(key))
        .map(([_, msg]) => msg);

      this.error = formErrors.join('. ');
    });
  }

  set valid(isValid: boolean) {
    this.submitButton.disabled = !isValid;
  }

  set error(message: string) {
    this.errorElement.textContent = message;
  }
}