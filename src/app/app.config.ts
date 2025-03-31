import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {es_ES, provideNzI18n} from 'ng-zorro-antd/i18n';
import {NzIconService} from 'ng-zorro-antd/icon';
import {FormsModule} from '@angular/forms';
import { ReloadOutline } from '@ant-design/icons-angular/icons';
import {provideHttpClient} from '@angular/common/http';
import {provideNzIcons} from './icons-provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideNzI18n(es_ES),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    {
      provide: 'initializeIcons',
      useFactory: (iconService: NzIconService) => {
        iconService.addIcon(ReloadOutline);
      },
      deps: [NzIconService],
    }, provideNzIcons(), provideNzI18n(es_ES), importProvidersFrom(FormsModule), provideAnimationsAsync(), provideHttpClient(),
  ]
};
