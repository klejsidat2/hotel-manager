import { InjectionToken } from '@angular/core';

export interface AppConfig {
  storageKey: string;
  defaultPrice: number;
  totalRooms: number;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG', {
  providedIn: 'root',
  factory: () => ({
    storageKey: 'hotel-manager-v1',
    defaultPrice: 60,
    totalRooms: 5,
  }),
});