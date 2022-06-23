import {Component, OnInit} from '@angular/core';
import {RequestService} from "../../services/request.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-auction-export-dialog',
  templateUrl: './auctionExportDialog.component.html',
  styleUrls: ['./auctionExportDialog.component.css']
})
export class AuctionExportDialogComponent implements OnInit {

  submitCommitted: boolean
  inJSONformat: boolean
  exportFormat: string
  startDate: string
  endDate: string
  startDateValues: number[]
  endDateValues: number[]
  startDateValid: boolean
  endDateValid: boolean


  constructor(private dialogRef: MatDialogRef<AuctionExportDialogComponent>, private requestService: RequestService) {
    this.submitCommitted = false
    this.inJSONformat = true
    this.exportFormat = "JSON"
    this.startDate = ""
    this.endDate = ""
    this.startDateValues = []
    this.endDateValues = []
    this.startDateValid = false
    this.endDateValid = false
  }

  setExportFormat(format: string)
  {
    this.exportFormat = format
  }


  exportAuctions(exportFormat: string): void {

    this.submitCommitted = true

    if(!(this.startDateValid && this.endDateValid))
      return

    this.swapDateTimes()

    let inJSONformat : boolean = (exportFormat==="JSON")

    this.requestService.exportAuctions(inJSONformat, this.startDate, this.endDate).subscribe(
      // if auctions were fetched successfully
      response => {

        let a = document.createElement("a");
        let file : any
        file = new Blob([response]);
        inJSONformat ? a.download = "ExportAuctions.json" : a.download = "ExportAuctions.xml";
        a.href = URL.createObjectURL(file);
        a.click();

      },
      // if auctions failed to be exported
      error => {}
    )

    // close dialog
    this.dialogRef.close()

    //

  }

  ngOnInit(): void {}

  getDateTime(dateTime: any,startDate: boolean): void {

    let newDate = this.formatDateTime(dateTime)


    if(startDate)
    {
      this.startDateValues = dateTime
      this.startDate = newDate
      this.startDateValid = true
    }
    else
    {
      this.endDateValues = dateTime
      this.endDate = newDate
      this.endDateValid = true
    }

  }

  submit(): void {
    this.exportAuctions(this.exportFormat)
  }


  formatDateTime(dateTime: number[]) : string {

    let newDateTime = ""

    if(dateTime[2]<10)
      newDateTime+= "0"
    newDateTime+= dateTime[2].toString()+"/"
    dateTime[1]+=1
    if(dateTime[1]<10)
      newDateTime+= "0"
    newDateTime+= (dateTime[1]).toString()+"/"
    newDateTime+= dateTime[0].toString()+" "

    if(dateTime[3]<10)
      newDateTime+= "0"
    newDateTime+= dateTime[3].toString()+":"
    if(dateTime[4]<10)
      newDateTime+= "0"
    newDateTime+= dateTime[4].toString()+":"
    if(dateTime[5]<10)
      newDateTime+= "0"
    newDateTime+= dateTime[5].toString()

    return newDateTime
  }

  swapDateTimes() : void {


    if(this.startDateValues && this.endDateValues)
    {
      for(let i=0; i<this.startDateValues.length;i++)
      {
        if(this.startDateValues[i]>this.endDateValues[i])
        {
          let tempValue
          tempValue = this.startDateValues
          this.startDateValues = this.endDateValues
          this.endDateValues = tempValue

          tempValue = this.startDate
          this.startDate = this.endDate
          this.endDate = tempValue
          break
        }
        else if(this.startDateValues[i]<this.endDateValues[i])
          break
      }

    }

  }


}


