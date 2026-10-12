export interface RoomPhoto {
  id: number;
  url: string;
}

export interface Room {
  id: number;
  number: string;
  type: 'SINGLE' | 'DOUBLE' | 'SUITE';
  pricePerNight: number;
  description: string | null;
  descriptionEn: string | null;
  propertyId: number;
  propertyName: string;
  photos: RoomPhoto[];
}

export interface RoomPayload {
  number: string;
  type: 'SINGLE' | 'DOUBLE' | 'SUITE';
  pricePerNight: number;
  description: string;
  descriptionEn?: string;
  propertyId: number;
}