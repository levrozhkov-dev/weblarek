import { ensureElement } from '../../../utils/utils';
import { Card } from './Card';
import { CDN_URL, categoryMap } from '../../../utils/constants';
import { IProduct } from '../../../types';

type CategoryKey = keyof typeof categoryMap;

export class CardProductBase<T extends Pick<IProduct, 'image' | 'category'>> extends Card<T> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
  }

  set image(value: string) {
    this.setImage(this.imageElement, CDN_URL + `${value.slice(0, -3) + 'png'}`, this.title);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    
    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value
      );
    }
  }
}