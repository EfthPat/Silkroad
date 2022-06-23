import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css']
})
export class MessageDialogComponent implements OnInit {

  sent: boolean
  sender : string
  receiver: string
  subject : string
  paragraph: string

  constructor( @Inject(MAT_DIALOG_DATA) data : any) {
    this.sent = data.sent
    this.sender = data.from
    this.receiver = data.to
    this.subject = data.subject
    this.paragraph = data.paragraph
  }

  ngOnInit(): void {

  }

}
