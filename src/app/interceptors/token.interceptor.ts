import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable} from 'rxjs';
import {geocodingLinks} from "../constants/geocoding";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  forwardGeocodingLink: string = geocodingLinks[0]
  reverseGeocodingLink: string = geocodingLinks[1]

  constructor() {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {

    // get JWT from local storage
    let jwt = localStorage.getItem('jwt')
    // if JWT exists and the request is not forwarded to the geocoding API
    if (jwt && !request.url.includes(this.forwardGeocodingLink)  && !request.url.includes(this.reverseGeocodingLink)) {

      // add the JWT to the header of the outgoing server request
      request = request.clone({
        setHeaders: {Authorization: "Bearer " + jwt}
      });
    }

    return next.handle(request);
  }
}
