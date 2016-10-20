import { platformBrowser }    from '@angular/platform-browser';
import { AppModuleNgFactory } from '../aot/app/app.module.ngfactory';
import {enableProdMode} from '@angular/core';


// Enable production mode - that will shut down messages to the console
// enableProdMode();

platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
