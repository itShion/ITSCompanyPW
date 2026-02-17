import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '../Core/Interceptor/auth.interceptor';


export const appConfig: ApplicationConfig = {
providers: [
  provideBrowserGlobalErrorListeners(),
  provideRouter(routes, withHashLocation()),
  provideHttpClient(
    withInterceptors([authInterceptor])
  )
]
};
