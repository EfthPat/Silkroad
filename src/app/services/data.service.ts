import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private message = new Subject<string>()

  obsMessage = this.message.asObservable()
  setException(message : string) {
    this.message.next(message)
  }

}
