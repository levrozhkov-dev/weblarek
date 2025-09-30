import './scss/styles.scss';

import { apiProducts } from './utils/data';

import { Products } from './components/models/Products';
import { Cart } from './components/models/Cart';
import { Buyer } from './components/models/Buyer';

import { Api } from './components/base/Api';
import { MarketApi } from './components/Api/MarketApi';
import { API_URL } from './utils/constants'


// Проверка Products
const productsModel = new Products();

productsModel.setProducts(apiProducts.items);
console.log('Массив товаров из каталога:', productsModel.getProducts());

const selectedProduct = productsModel.getProducts()[1];
productsModel.setSelectedProduct(selectedProduct);
console.log('Выбранный товар:', productsModel.getSelectedProduct());

const selectedProductByID = productsModel.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390');
console.log('Выбранный по id товар:', selectedProductByID);

// Проверка Cart
const cart = new Cart();

cart.addItem(selectedProduct);
cart.addItem(selectedProductByID);

console.log('Товары в корзине:', cart.getItems());
console.log('Сумма корзины:', cart.getTotalPrice());
console.log('Количество товаров:', cart.getCount());
console.log('Выбранный товар есть в корзине:', cart.hasItem(selectedProduct.id));
cart.removeItem(selectedProduct);
console.log('Корзина после удаления выбранного товара:', cart.getItems());

// Проверка Buyer
const buyer = new Buyer();

buyer.setData({ email: 'testemail@mail.com' });
buyer.setData({ payment: 'cash' });

console.log('Данные покупателя:', buyer.getData());
console.log('Ошибки валидации:', buyer.validate());
buyer.clear();
console.log('Данные покупателя после очистки:', buyer.getData());

// создаём экземпляр API и отправляем запрос на сервер
const api = new Api(API_URL);
const marketApi = new MarketApi(api);

marketApi.getProducts()
  .then((products) => {
    productsModel.setProducts(products);
    console.log('Каталог, полученный с сервера:', productsModel.getProducts());
  })
  .catch((error) => {
    console.error('Ошибка при получении товаров:', error);
  });