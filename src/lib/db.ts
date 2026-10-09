import Dexie, { Table } from 'dexie';

export interface Customer {
  id?: number;
  name: string;
  birthdate: string; // YYYY-MM-DD
  gender: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class FortuneAppDB extends Dexie {
  customers!: Table<Customer>;

  constructor() {
    super('FortuneAppDB');
    this.version(1).stores({
      customers: '++id, name, birthdate, gender'
    });
  }
}

export const db = new FortuneAppDB();
