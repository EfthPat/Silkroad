import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AbstractControl, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-daterange',
  templateUrl: './daterange.component.html',
  styleUrls: ['./daterange.component.css']
})
export class DaterangeComponent implements OnInit {

  @Output() emitDates

  dateGroup: FormGroup

  constructor() {

    this.emitDates = new EventEmitter<string[]>()

    this.dateGroup = new FormGroup({
      startDate: new FormControl(''),
      endDate: new FormControl('')
    })



  }

  ngOnInit(): void {}

  ngDoCheck() {

    let startDate = this.convertDate(this.dateGroup.controls['startDate'],true)
    let endDate = this.convertDate(this.dateGroup.controls['endDate'],false)
    this.emitDates.emit([startDate,endDate])

  }


  convertDate(dateField : AbstractControl, start: boolean) : string {

    if(dateField.value!=='')
    {
      // get field's value
      let date = new Date(dateField.value)

      // convert it to the specified Date format
      let day = date.getDate().toString()
      let month : number | string = date.getMonth() + 1
      month = month.toString()
      let year = date.getFullYear().toString()

      let completeDate = day+"/"+month+"/"+year
      start? completeDate += " 00:00:00" : completeDate += " 23:59:59"

      // !!!
      if(completeDate==="1/1/1970 23:59:59")
        return "31/12/2099 23:59:59"

      return completeDate
    }

    if(start)
      return "1/1/1970 00:00:00"

    return "31/12/2099 23:59:59"
  }

}
