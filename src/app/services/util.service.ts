import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  reformatDate(date: string) : string{

    let dt = new Date(date)

    return dt.toDateString()+", "+dt.toLocaleTimeString()
  }

  reformatNumber(value : number) : number {

    return (Math.round(value * 100) / 100);
  }

}
