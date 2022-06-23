import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'date-time-picker',
  templateUrl: 'dateTimePicker.component.html',
  styleUrls: ['./dateTimePicker.component.css']

})
export class DateTimePickerComponent implements OnInit{

  picker: any;

  @Output() dateTime: number[];

  @Output() dateTimeEmitter :  EventEmitter<number[]>;

  public dateControl = new FormControl();


  constructor() {

    // YYYY , MM , DD , HR, MN, SC, MS
    this.dateTime = [1970, 1, 1, 0, 0, 0, 0];

    this.dateTimeEmitter = new EventEmitter<number[]>();
  }

  ngOnInit() {}

  updateDateTime() : void {

    let date = new Date(this.dateControl.value)

    this.dateTime[0] = date.getFullYear()
    this.dateTime[1] = date.getMonth()
    this.dateTime[2] = date.getDate()
    this.dateTime[3] = date.getHours()
    this.dateTime[4] = date.getUTCMinutes()
    this.dateTime[5] = date.getUTCSeconds()
    this.dateTime[6] = date.getUTCMilliseconds()

    this.dateTimeEmitter.emit(this.dateTime)

  }



}


