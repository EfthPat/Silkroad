import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  reformatDate(date: string) : string{


    let dt = new Date(date)


    let newDate = dt.toDateString()+", "+dt.toLocaleTimeString()

    return newDate
  }

  reformatNumber(value : number) : number {

    return (Math.round(value * 100) / 100);
  }

}
