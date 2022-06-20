import {EventEmitter, Injectable, Output} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransferService {

  @Output() auctionEmit = new EventEmitter<string[]>();

  constructor() { }

  emitAuction(auction : any) : void{
    this.auctionEmit.emit(auction)
  }

}
