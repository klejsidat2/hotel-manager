import { Pipe, PipeTransform, inject } from '@angular/core';

import { LanguageService } from './language.service';
import { Room } from './room.model';

type WithDescription = Pick<Room, 'description' | 'descriptionEn'>;

@Pipe({ name: 'roomDescription', pure: false })
export class RoomDescriptionPipe implements PipeTransform {
  private language = inject(LanguageService);

  transform(room: WithDescription): string {
    const english = this.language.current().lang === 'en';
    const primary = english ? room.descriptionEn : room.description;
    const fallback = english ? room.description : room.descriptionEn;
    return (primary?.trim() ? primary : fallback) ?? '';
  }
}