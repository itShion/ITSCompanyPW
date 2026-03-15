import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '../Core/Interceptor/auth.interceptor';
import { errorInterceptor } from '../Core/Interceptor/error.interceptor';

export const appConfig: ApplicationConfig = {
providers: [
  provideBrowserGlobalErrorListeners(),
  provideRouter(routes),
  provideHttpClient(withInterceptors([authInterceptor])),
  provideHttpClient(withInterceptors([errorInterceptor])),
]
};
