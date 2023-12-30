export type BaseResponseType<T> = { data: T };

export type Product = {
  id: number;
  name: string;
  price: number;
  productTypeId: number;
  supplierId: number;
};

export enum Gender {
  MALE,
  FEMALE,
  OTHER,
}

export type Employee = {
  id: number;
  name: string;
  gender: Gender;
  birthday: string;
  hiredAt: string;
  positionId: number;
};

export type Position = {
  id: number;
  name: string;
};

export type Supplier = {
  id: number;
  name: string;
  address: string;
  contact: string;
};

export type StockInfo = {
  id: number;
  productId: number;
  supplierId: number;
  unitPrice: number;
  quantity: number;
  purchaseDate: string;
};

export type Order = {
  id: number;
  employeeId: number;
  date: string;
};

export type Inventory = {};

export type ProductType = {
  id: number;
  name: string;
};
