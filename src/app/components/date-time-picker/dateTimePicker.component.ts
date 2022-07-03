import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'date-time-picker',
  templateUrl: 'dateTimePicker.component.html',
  styleUrls: ['./dateTimePicker.component.css']

})
export class DateTimePickerComponent implements OnInit {

  picker: any;

  @Input() dateTimeValue: Date | undefined;

  dateTime: number[];

  @Output() dateTimeEmitter: EventEmitter<number[]>;


  constructor() {

    this.dateTime = new Array<number>(7);
    this.dateTimeEmitter = new EventEmitter<number[]>();
  }

  ngOnInit() {
  }

  updateDateTime(): void {


    this.dateTime[0] = this.dateTimeValue!.getFullYear()
    this.dateTime[1] = this.dateTimeValue!.getMonth()
    this.dateTime[2] = this.dateTimeValue!.getDate()
    this.dateTime[3] = this.dateTimeValue!.getHours()
    this.dateTime[4] = this.dateTimeValue!.getUTCMinutes()
    this.dateTime[5] = this.dateTimeValue!.getUTCSeconds()
    this.dateTime[6] = this.dateTimeValue!.getUTCMilliseconds()

    this.dateTimeEmitter.emit(this.dateTime)

  }


}


