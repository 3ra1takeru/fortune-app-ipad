export interface AppraisalRecord {
  id: string;
  customerId: number;
  date: Date;
  content: string;
  summary?: string;
  postMessage?: string;
  partnerName?: string;
}

export interface Customer {
  id?: number;
  name: string;
  birthdate: string; // YYYY-MM-DD
  gender: string;
  notes?: string;
  records?: AppraisalRecord[];
  createdAt: string;
  updatedAt: string;
}
