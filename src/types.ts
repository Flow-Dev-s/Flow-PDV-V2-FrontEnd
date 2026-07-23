export interface Product {
  soldQuantity: number;
  id: number;
  name: string;
  sellingPrice: number;
  costPrice: number;
  category: string;
  currentStock: number;
  barcode: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Sale {
  id: number;
  paymentMethod: string;
  totalAmount: number;
  createdAt: string;
}