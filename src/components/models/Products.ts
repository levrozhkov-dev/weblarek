import { IProduct } from '../../types/index';

export class Products {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  setProducts(products: IProduct[]): void {
    this.products = products;
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct {
    const product = this.products.find(product => product.id === id);
    if (!product) {
      throw new Error(`Товар с id ${id} не найден`);
    }
    return product;
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}