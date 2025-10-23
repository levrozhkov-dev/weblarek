import { Component } from '../base/Component';

interface IGallery {
  container: HTMLElement;
}

export class Gallery extends Component<IGallery> {
  constructor(container: HTMLElement) {
    super(container);
  }

  set catalog(elements: HTMLElement[]) {
    this.container.replaceChildren(...elements);
  }
}