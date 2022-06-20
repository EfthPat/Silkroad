import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  api: string = 'http://api.positionstack.com'

  constructor() {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {

    // get JWT from local storage
    let jwt = localStorage.getItem('jwt')
    // if JWT exists
    if (jwt && !request.url.includes(this.api)) {

      // add the JWT to the header of the outgoing server request
      request = request.clone({
        setHeaders: {Authorization: "Bearer " + jwt}
      });
    }

    return next.handle(request);
  }
}
