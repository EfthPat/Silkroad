import {Component, EventEmitter, Input, OnInit, Output,} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  @Output() emitDate
  date : string
  dateGroup: FormGroup

  @Input() defaultDate

  constructor() {

    this.emitDate = new EventEmitter<string>()
    this.date = new Date().toISOString()
    this.dateGroup = new FormGroup({date: new FormControl('')})

    this.defaultDate = "DD/MM/YY"

  }

  ngOnInit() {}

  ngDoCheck() {

    let date = new Date(this.dateGroup.controls['date'].value)

    try {

      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      let fullDate = year.toString() + "-" + month.toString() + "-" + day.toString()
      date = new Date(fullDate)
      this.date = date.toISOString()

    } catch (error) {}

    this.emitDate.emit(this.date)
  }



}


