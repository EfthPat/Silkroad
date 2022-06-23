import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";
import jwt_decode from 'jwt-decode';
import {ServerExceptionResponse} from "../interfaces/ServerExceptionResponse";
import {serverLinks, serverParameters} from "../constants/server";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private serverUrl: string
  private loginParameter: string

  constructor(private httpClient: HttpClient) {

    this.serverUrl = serverLinks[0]
    this.loginParameter = serverParameters.login

  }

  decodeJWT(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  // store username and jwt
  storeUserInfo(username: string, jwt: string) {
    localStorage.setItem("username", username)
    localStorage.setItem("jwt", jwt)
  }

  getUserRole(): string {
    let jwt = localStorage.getItem('jwt')
    if(jwt)
    {
      let payload = this.decodeJWT(jwt)
      if(payload)
        return payload.Role
    }
    return "GUEST"
  }

  getUsername() : string | null {
    let jwt = localStorage.getItem('jwt')
    if(jwt)
    {
      let payload = this.decodeJWT(jwt)
      if(payload)
        return payload.sub
    }
    return null
  }

  // ----------------------------------------- LOGIN ---------------------------------------------------------------- //

  // # POST
  // http://localhost:8081
  // /login-navigation-panel


  login(username: string, password: string): Observable<HttpResponse<null | ServerExceptionResponse>> {

    this.logout()

    let loginBody = {
      username: username,
      password: password
    }


    let completeUrl = this.serverUrl + this.loginParameter

    return this.httpClient.post<any>(completeUrl, loginBody, {observe: 'response'})
  }


  logout(): void {

    localStorage.removeItem("username")
    localStorage.removeItem("jwt")

  }


}






