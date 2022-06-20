import {EventEmitter, Injectable, Output} from '@angular/core';
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

    // geolocation variables
    this.forwardUrl = "http://api.positionstack.com/v1/forward"
    this.reverseUrl = "http://api.positionstack.com/v1/reverse"
    this.APIkey = "00d443359dfc3ade317d4bdcaca48374"


  }

  // Reverse Geocoding - given a (LAT , LONG) pair, get 1 address
  getReverseLocation(lat: number, lon: number): Observable<any> {

    let completeUrl =
      this.reverseUrl +
      "?limit=1" +
      "&access_key=" + this.APIkey +
      "&query=" + lat.toString() + "," + lon.toString()


    // return an observable containing a single address in an array
    return this.httpClient.get<any>(completeUrl)
  }

  getForwardLocation(address: string, limit: number = 1): Observable<any> {

    let completeUrl =
      this.forwardUrl +
      "?limit=" + limit.toString() +
      "&access_key=" + this.APIkey +
      "&query=" + address

    return this.httpClient.get<any>(completeUrl)
  }


  // Get a Location Object and make a string-typed address from its components
  extractAddress(location: any): string {
    // pick specific fields here and concat them ...

    console.log("extracting address from object :",location)

    return location.label
  }


}
