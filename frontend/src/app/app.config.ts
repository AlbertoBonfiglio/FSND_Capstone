import { APP_INITIALIZER, ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideServiceWorker } from '@angular/service-worker';
import { authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';
import { environment as env} from '../environments/environment';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { UserEffects } from './core/store/user/user.effects';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authFeatureKey, authReducerFn, settingsFeatureKey, settingsReducerFn } from './core/store';

const Auth0Config = {
  // The domain and clientId were configured in the previous chapter
  domain: env.auth.domain,
  clientId: env.auth.clientId,
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: env.auth.audience,
  },

  api: {
    serverUrl: env.apiUri,
  },
  
  httpInterceptor: {
    allowedList: [
      `${env.apiUri}/*`
    ]
  }
}

const provideSplashScreen = () => {
  // https://blog.stackademic.com/how-and-when-to-use-app-initializer-in-standalone-angular-16-application-37b63a56e185
  return { 
    provide: APP_INITIALIZER, 
    useValue: () =>
    new Promise((resolve) => setTimeout(resolve, env.splashDelay)),
      multi: true,
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideSplashScreen(),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    }),
  
    provideStore(),
    provideState(authFeatureKey, authReducerFn),
    provideState(settingsFeatureKey, settingsReducerFn),
    provideEffects([UserEffects]),
    provideStoreDevtools({
      name: 'TankRover',
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectInZone: true // If set to true, the connection is established within the Angular zone
    }),
  
    provideAuth0(Auth0Config),

    provideHttpClient(
      withInterceptors([
        authHttpInterceptorFn,
      ])
    ), 
    
    provideAnimationsAsync(),
  ], 
};
