import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../../app/services/notification.service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifiche = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const dettaglio = error.error?.dettaglio ?? 'Errore sconosciuto.';

      switch (error.status) {
        case 400:
          notifiche.errore(dettaglio);
          break;
        case 401:
          notifiche.errore('Sessione scaduta, effettua di nuovo il login.');
          router.navigate(['/login']);
          break;
        case 403:
          notifiche.errore(dettaglio);
          break;
        case 404:
          notifiche.errore('Risorsa non trovata.');
          break;
        case 409:
          notifiche.errore(dettaglio);
          break;
        case 500:
          notifiche.errore('Errore interno del server. Riprova più tardi.');
          break;
        default:
          notifiche.errore(dettaglio);
      }

      return throwError(() => error);
    })
  );
};