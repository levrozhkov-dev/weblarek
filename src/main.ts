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

// Модели
const productsModel = new Products(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

// Заголовок
const header = new Header(events, document.querySelector('.header')!);

// Галерея каталога
const gallery = new Gallery(document.querySelector('.gallery')!);

// Модалка
const modal = new Modal(events, document.querySelector('#modal-container')!);

// Корзина
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const basket = new Basket(events, basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement);

// Окно успешного оформления
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
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
    const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
    const cardElement = cardTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

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
  const cardTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
  const element = cardTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

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

  modal.content = card.render(product);
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
    const cardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
    const element = cardTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;

    const card = new CardBasket(element as HTMLElement, {
      onDelete: () => events.emit('card:remove-from-cart', product)
    });

    card.index = index + 1;
    return card.render(product);
  });

  basket.items = basketCards;

  // Общая сумма
  const total = items.reduce((sum, item) => sum + (item.price || 0), 0);
  basket.total = total;

  console.log('Корзина изменена:', items);
});

// Открытие корзины
events.on('basket:open', () => {
  modal.content = basket.render();
  modal.show();
  document.body.style.overflow = 'hidden';
});


// Открытие формы
events.on('order:open', () => {
  const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
  const formElement = orderTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
  const formPayment = new FormPaymentType(events, formElement);

  buyer.clear();

  modal.content = formPayment.render({});
  formPayment.valid = false;
  modal.show();
  document.body.style.overflow = 'hidden';
});

// Выбор способа оплаты
events.on('payment:select', (data: { payment: string }) => {
  buyer.setData({ payment: data.payment as TPayment }, 'payment');
});

// Ввод адреса
events.on('address:input', (data: { address: string }) => {
  buyer.setData({ address: data.address }, 'payment');
});

// Сабмит формы
events.on('order:submit', () => {
  const errors = buyer.validate('payment');
  if (Object.keys(errors).length === 0) {
    const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
    const formElement = contactsTemplate.content.firstElementChild!.cloneNode(true) as HTMLFormElement;
    const formContacts = new FormContacts(events, formElement);

    modal.content = formContacts.render({});
    modal.show();
    document.body.style.overflow = 'hidden';
  }
});

// Изменение контактов
events.on('contacts:change', (data: { email?: string; phone?: string }) => {
  buyer.setData(data, 'contacts');
});

// Сабмит контактов
events.on('contacts:submit', () => {
  const errors = buyer.validate();
  if (Object.keys(errors).length === 0) {
    // Формируем объект заказа
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
        modal.content = success.render({ total });
        modal.show();
        document.body.style.overflow = 'hidden';

        cart.clear();
        buyer.clear();

        console.log('Заказ успешно создан:', response);
      })
      .catch((error) => {
        console.error('Ошибка при создании заказа:', error);
      });
  }
});

// Закрытие окна успешного оформления
events.on('success:close', () => {
  modal.hide();
  document.body.style.overflow = 'auto';
});

// Логи обновлений форм
events.on('form:update', (data) => {
  console.log('Данные формы обновились:', data);
});