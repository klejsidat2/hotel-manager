export interface Property {
  id: number;
  name: string;
  city: string;
  category: 'HOTEL' | 'APARTMENT' | 'VILLA';
  ownerName: string;
}