import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clonedRequest = req.clone({
      setHeaders: {
        'Access-Control-Allow-Origin': '*', // Accept all Origins
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE', // Accept all Methods
        'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Allow Headers
      },
    });
    return next.handle(clonedRequest);
  }
}
