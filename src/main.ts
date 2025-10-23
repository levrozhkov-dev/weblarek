import './scss/styles.scss';

import { Products } from './components/models/Products';
import { Cart } from './components/models/Cart';
import { Buyer } from './components/models/Buyer';

import { Api } from './components/base/Api';
import { MarketApi } from './components/Api/MarketApi';
import { API_URL } from './utils/constants'

import { EventEmitter } from './components/base/Events';
import { IProduct } from './types/index';
import { TPayment } from './types/index';

import { ensureElement } from './utils/utils';

import { Header } from './components/views/Header';
import { CardCatalog } from './components/views/Card/CardCatalog';
import { CardBasket } from './components/views/Card/CardBasket';
import { CardPreview } from './components/views/Card/CardPreview';
import { Gallery } from './components/views/Gallery';
import { Modal } from './components/views/Modal';
import { Basket } from './components/views/Basket';
import { Success } from './components/views/Success';
import { FormPaymentType } from './components/views/Form/FormPaymentType';
import { FormContacts } from './components/views/Form/FormContacts';

const events = new EventEmitter();

const cardCatalogTemplate = ensureElement('#card-catalog') as HTMLTemplateElement;
const cardBasketTemplate = ensureElement('#card-basket') as HTMLTemplateElement;
const cardPreviewTemplate = ensureElement('#card-preview') as HTMLTemplateElement;
const orderTemplate = ensureElement('#order') as HTMLTemplateElement;
const contactsTemplate = ensureElement('#contacts') as HTMLTemplateElement;

// Экземпляры классов представления форм
const formPayment = new FormPaymentType(events, orderTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement);
const formContacts = new FormContacts(events, contactsTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement);

// Модели
const productsModel = new Products(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

// Заголовок
const header = new Header(events, ensureElement('.header')!);

// Галерея каталога
const gallery = new Gallery(ensureElement('.gallery')!);

// Модалка
const modal = new Modal(events, ensureElement('#modal-container')!);

// Корзина
const basketTemplate = ensureElement('#basket') as HTMLTemplateElement;
const basket = new Basket(events, basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement);

// Окно успешного оформления
const successTemplate = ensureElement('#success') as HTMLTemplateElement;
const success = new Success(events, successTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement);

// Работа с корзиной
events.on('card:add-to-cart', (product: IProduct) => {
  cart.addItem(product);
  console.log('Добавлен товар в корзину', product);
});

events.on('card:remove-from-cart', (product: IProduct) => {
  cart.removeItem(product);
  console.log('Удален товар из корзины', product);
});

// Рендеринг каталога
events.on('products:change', (products: IProduct[]) => {
  const cards = products.map((product) => {
    const cardElement = cardCatalogTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const card = new CardCatalog(cardElement, events, product);
    return card.render(product);
  });

  gallery.catalog = cards;
});


// API
const api = new Api(API_URL);
const marketApi = new MarketApi(api);

// Получение товаров
marketApi.getProducts()
  .then((products) => {
    productsModel.setProducts(products.items);
  })
  .catch((error) => {
    console.error('Ошибка при получении товаров:', error);
  });

// Открытие карточки
events.on('card:open', (product: IProduct) => {
  const element = cardPreviewTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

  const isInCart = cart.hasItem(product.id);

  const card = new CardPreview(element, {
    onToggleBasket: (inBasket) => {
      if (inBasket) {
        events.emit('card:add-to-cart', product);
      } else {
        events.emit('card:remove-from-cart', product);
      }
      card.setInBasket(inBasket);
    },
  });

  card.setAvailable(product.price !== null);
  card.setInBasket(isInCart);

  events.emit('modal:open', card.render(product))
});

// Открытие модалки
events.on('modal:open', (content: HTMLElement) => {
  modal.content = content;
  modal.show();
  document.body.style.overflow = 'hidden';
});

// Закрытие модалки
events.on('modal:close-click', () => {
  modal.hide();
  document.body.style.overflow = 'auto';
});

// Изменение корзины
events.on('cart:change', (items: IProduct[]) => {
  header.counter = cart.getItems().length;

  const basketCards = items.map((product, index) => {
    const element = cardBasketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const card = new CardBasket(element as HTMLElement, {
      onDelete: () => events.emit('card:remove-from-cart', product)
    });

    card.index = index + 1;
    return card.render(product);
  });

  basket.items = basketCards;

  // Общая сумма
  const total = cart.getTotalPrice();
  basket.total = total;

  console.log('Корзина изменена:', items);
});

// Открытие корзины
events.on('basket:open', () => {
  events.emit('modal:open', basket.render());
});


// Открытие формы
events.on('order:open', () => {
  const formElement = orderTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement;

  buyer.clear();

  events.emit('modal:open', formPayment.render());
  formPayment.valid = false;
});

// Выбор способа оплаты
events.on('payment:select', (data: { payment: string }) => {
  buyer.setData({ payment: data.payment as TPayment }, 'payment');
  const errors = buyer.validate('payment');
  events.emit('form:update', { valid: Object.keys(errors).length === 0, errors });
});

// Ввод адреса
events.on('address:input', (data: { address: string }) => {
  buyer.setData({ address: data.address }, 'payment');
  const errors = buyer.validate('payment');
  events.emit('form:update', { valid: Object.keys(errors).length === 0, errors });
});

// Сабмит формы оплаты
events.on('order:submit', () => {
  events.emit('modal:open', formContacts.render());
});

// Изменение контактов
events.on('contacts:change', (data: { email?: string; phone?: string }) => {
  buyer.setData(data, 'contacts');
  const errors = buyer.validate('contacts');
  events.emit('form:update', { valid: Object.keys(errors).length === 0, errors });
});

// Сабмит контактов
events.on('contacts:submit', () => {
  const buyerData = buyer.getData();
  const order = {
    items: cart.getItems().map(item => item.id),
    payment: buyerData.payment!,
    address: buyerData.address!,
    email: buyerData.email!,
    phone: buyerData.phone!,
    total: cart.getTotalPrice()
  };

  // Отправляем заказ на сервер
  marketApi.createOrder(order)
    .then((response) => {
      const total = response.total || cart.getTotalPrice();
      events.emit('modal:open', success.render({ total })); 

      cart.clear();
      buyer.clear();

      console.log('Заказ успешно создан:', response);
    })
    .catch((error) => {
      console.error('Ошибка при создании заказа:', error);
    });
});

// Закрытие окна успешного оформления
events.on('success:close', () => {
  events.emit('modal:close-click'); 
});

// Логи обновлений форм
events.on('form:update', (data) => {
  console.log('Данные формы обновились:', data);
});