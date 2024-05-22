import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideServiceWorker } from '@angular/service-worker';
import { provideAuth0 } from '@auth0/auth0-angular';
import { environment as env} from '../environments/environment';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { metaReducers, reducers } from './core/store/core.reducers';
import { UserEffects } from './core/store/user/user.effects';
import { provideHttpClient } from '@angular/common/http';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    }),
    provideHttpClient(),
    provideAuth0({
        domain: env.auth.domain,
        clientId: env.auth.clientId,
        authorizationParams: {
            redirect_uri: window.location.origin
        }
    }),
    provideStore(reducers, {
      metaReducers,
    } ),
    provideEffects([UserEffects]),
    provideStoreDevtools({
      name: 'TankRover',
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectInZone: true // If set to true, the connection is established within the Angular zone
    })
]
};
//https://auth0.com/blog/state-management-in-angular-with-ngrx-1/
