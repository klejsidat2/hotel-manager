import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const request = req.clone({
    setHeaders: { 'X-App-Name': 'hotel-manager' },
  });

  console.log('[HTTP]', request.method, request.url);

  return next(request).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response) {
        console.log('[HTTP] përgjigje', event.status, request.url);
      }
    })
  );
};