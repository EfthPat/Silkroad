import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class MapService {

  // geolocation variables
  private APIkey: string
  private forwardUrl: string
  private reverseUrl: string


  constructor(private httpClient: HttpClient) {

    this.forwardUrl = "https://api.locationiq.com/v1/autocomplete.php"
    this.reverseUrl = "https://eu1.locationiq.com/v1/reverse.php"
    this.APIkey = "pk.2191e0641f3fafa3e3cce39591faf310"

  }

  // Reverse Geocoding - given a (LAT , LONG) pair, get 1 address
  getReverseLocation(lat: number, lon: number): Observable<any> {

    let completeUrl =
      this.reverseUrl +
      "?key=" + this.APIkey +
      "&lat=" + lat.toString() +
      "&lon=" + lon.toString() +
      "&format=json"

    return this.httpClient.get<any>(completeUrl)
  }

  getForwardLocation(address: string, limit: number = 1): Observable<any> {

    let completeUrl =
      this.forwardUrl +
      "?key=" + this.APIkey +
      "&q=" + address +
      "&limit=" + limit.toString() +
      "&dedupe=1"

    return this.httpClient.get<any>(completeUrl)
  }



}
