import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface Language {
  code: string; // identifikuesi unik, p.sh. 'en-GB'
  lang: string; // skedari i përkthimit: public/i18n/<lang>.json
  name: string; // emri në gjuhën e vet
  flag: string; // kodi i flamurit (flag-icons)
  rtl?: boolean; // shkruhet djathtas-majtas
}

export const LANGUAGES: Language[] = [
  { code: 'sq', lang: 'sq', name: 'Shqip', flag: 'al' },
  { code: 'en-GB', lang: 'en', name: 'English UK', flag: 'gb' },
  { code: 'it', lang: 'it', name: 'Italiano', flag: 'it' },
  { code: 'tr', lang: 'tr', name: 'Türkçe', flag: 'tr' },
  { code: 'fr', lang: 'fr', name: 'Français', flag: 'fr' },
  { code: 'en-US', lang: 'en', name: 'English US', flag: 'us' },
  { code: 'de', lang: 'de', name: 'Deutsch', flag: 'de' },
  { code: 'nl', lang: 'nl', name: 'Nederlands', flag: 'nl' },
  { code: 'ro', lang: 'ro', name: 'Română', flag: 'ro' },
  { code: 'bg', lang: 'bg', name: 'Български', flag: 'bg' },
  { code: 'he', lang: 'he', name: 'עברית', flag: 'il', rtl: true },
  { code: 'uk', lang: 'uk', name: 'Українська', flag: 'ua' },
  { code: 'el', lang: 'el', name: 'Ελληνικά', flag: 'gr' },
  { code: 'pt-PT', lang: 'pt', name: 'Português (PT)', flag: 'pt' },
  { code: 'pt-BR', lang: 'pt', name: 'Português (BR)', flag: 'br' },
  { code: 'no', lang: 'no', name: 'Norsk', flag: 'no' },
  { code: 'fi', lang: 'fi', name: 'Suomi', flag: 'fi' },
  { code: 'sv', lang: 'sv', name: 'Svenska', flag: 'se' },
  { code: 'da', lang: 'da', name: 'Dansk', flag: 'dk' },
  { code: 'cs', lang: 'cs', name: 'Čeština', flag: 'cz' },
  { code: 'hu', lang: 'hu', name: 'Magyar', flag: 'hu' },
  { code: 'ja', lang: 'ja', name: '日本語', flag: 'jp' },
  { code: 'ko', lang: 'ko', name: '한국어', flag: 'kr' },
  { code: 'zh-CN', lang: 'zh-CN', name: '简体中文', flag: 'cn' },
  { code: 'zh-TW', lang: 'zh-TW', name: '繁體中文', flag: 'tw' },
  { code: 'sk', lang: 'sk', name: 'Slovenčina', flag: 'sk' },
  { code: 'pl', lang: 'pl', name: 'Polski', flag: 'pl' },
  { code: 'is', lang: 'is', name: 'Íslenska', flag: 'is' },
  { code: 'sr', lang: 'sr', name: 'Srpski', flag: 'rs' },
  { code: 'id', lang: 'id', name: 'Bahasa Indonesia', flag: 'id' },
  { code: 'ms', lang: 'ms', name: 'Bahasa Malaysia', flag: 'my' },
  { code: 'es', lang: 'es', name: 'Español', flag: 'es' },
  { code: 'es-AR', lang: 'es', name: 'Español (AR)', flag: 'ar' },
  { code: 'es-MX', lang: 'es', name: 'Español (MX)', flag: 'mx' },
  { code: 'ca', lang: 'ca', name: 'Català', flag: 'es-ct' },
  { code: 'ar', lang: 'ar', name: 'العربية', flag: 'sa', rtl: true },
  { code: 'vi', lang: 'vi', name: 'Tiếng Việt', flag: 'vn' },
  { code: 'th', lang: 'th', name: 'ภาษาไทย', flag: 'th' },
  { code: 'fil', lang: 'fil', name: 'Filipino', flag: 'ph' },
  { code: 'hr', lang: 'hr', name: 'Hrvatski', flag: 'hr' },
  { code: 'lt', lang: 'lt', name: 'Lietuvių', flag: 'lt' },
  { code: 'lv', lang: 'lv', name: 'Latviešu', flag: 'lv' },
  { code: 'et', lang: 'et', name: 'Eesti', flag: 'ee' },
  { code: 'sl', lang: 'sl', name: 'Slovenščina', flag: 'si' },
  { code: 'ru', lang: 'ru', name: 'Русский', flag: 'ru' },
];

// Gjuhët që kanë skedar te public/i18n/. Shto këtu kur krijon një skedar të ri.
const AVAILABLE = new Set(['sq', 'en']);

const STORAGE_KEY = 'hotel-lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private translate = inject(TranslateService);

  readonly all = LANGUAGES;
  readonly current = signal<Language>(this.saved());

  constructor() {
    this.apply(this.current());
  }

  isAvailable(language: Language): boolean {
    return AVAILABLE.has(language.lang);
  }

  set(language: Language) {
    if (!this.isAvailable(language)) return;
    this.current.set(language);
    this.apply(language);
    try {
      localStorage.setItem(STORAGE_KEY, language.code);
    } catch {
      // gjuha vlen vetëm për këtë seancë
    }
  }

  private apply(language: Language) {
    this.translate.use(language.lang);
    document.documentElement.lang = language.code;
    document.documentElement.dir = language.rtl ? 'rtl' : 'ltr';
  }

  private saved(): Language {
    const fallback = LANGUAGES[0];
    try {
      const code = localStorage.getItem(STORAGE_KEY);
      const found = LANGUAGES.find((l) => l.code === code);
      return found && AVAILABLE.has(found.lang) ? found : fallback;
    } catch {
      return fallback;
    }
  }
}