import {Component, OnInit} from '@angular/core';
import {RequestService} from "../../services/request.service";

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {

  submitCommitted: boolean
  inJSONformat: boolean
  exportFormat: string
  startDate: string
  endDate: string


  constructor( private requestService: RequestService) {
    this.submitCommitted = false
    this.inJSONformat = true
    this.exportFormat = "JSON"
    this.startDate = ""
    this.endDate = ""
  }

  setExportFormat(format: string)
  {
    this.exportFormat = format
  }


  exportAuctions(exportFormat: string, startDate: string, endDate: string): void {

    let inJSONformat : boolean = (exportFormat==="JSON")

    this.requestService.exportAuctions(inJSONformat, startDate, endDate).subscribe(
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

  }

  ngOnInit(): void {}

  getDates(dates: any): void {
    this.startDate = dates[0]
    this.endDate = dates[1]
  }

  submit(): void {
    this.exportAuctions(this.exportFormat,this.startDate,this.endDate)
  }





}
