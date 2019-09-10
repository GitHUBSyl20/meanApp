import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}
//start the angular appl in the broowser. start the angular application with this component
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
