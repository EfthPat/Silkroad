import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {DataService} from "../services/data.service";
import {Router} from "@angular/router";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dataService : DataService, private router : Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(error => {


      if(error.status==500)
      {
       /* console.log("ERR INTERCEPTOR CAUGHT 500 STATUS")
        console.log("URL :",request.url)
        console.log("METHOD :",request.method)
        console.log("BODY :",request.body)*/

      //  this.router.navigate(['/browse'])
      }

      return throwError(error);

    }));
  }





}
