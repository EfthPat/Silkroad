import { Component, OnInit } from '@angular/core';
import {RequestService} from "../../services/request.service";
import {ActivatedRoute} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CustomMessage} from "../../interfaces/CustomMessage";
import {AuthService} from "../../services/auth.service";
import {DataService} from "../../services/data.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AlertDialogComponent} from "../alert-dialog/alert-dialog.component";
import {DeleteDialogComponent} from "../delete-dialog/delete-dialog.component";
import {take} from "rxjs";


@Component({
  selector: 'app-create-message',
  templateUrl: './create-message.component.html',
  styleUrls: ['./create-message.component.css']
})
export class CreateMessageComponent implements OnInit {

  alerted: boolean
  username : string
  messageForm : FormGroup
  submitCommitted : boolean

  constructor(private requestService : RequestService, private authService : AuthService, private route : ActivatedRoute,
              private dataService: DataService,private dialog: MatDialog) {

    this.alerted = false
    this.username = this.authService.getUsername()!
    this.submitCommitted = false

    let receiver = this.route.snapshot.queryParams['recipient']
    if(receiver==undefined)
      receiver=''

    let title = this.route.snapshot.queryParams['title']
    if(title==undefined)
      title=''


    this.messageForm = new FormGroup(
      {
        recipient: new FormControl(receiver, [Validators.required]),
        title: new FormControl(title, [Validators.required]),
        body: new FormControl('', [Validators.required]),
      }
    )

  }

  ngOnInit(): void {}

  sendMessage() : void {

    this.submitCommitted = true

    if(this.messageForm.invalid)
      return

    let newMessage : CustomMessage = {
      title: this.messageForm.get('title')?.value,
      body: this.messageForm.get('body')?.value,
      recipient: this.messageForm.get('recipient')?.value
    }

    this.requestService.sendMessage(this.username,newMessage).subscribe(
      // if message was sent successfully
      response => {
      },
      // if message wasn't sent
      error =>{}
    )

    let element = document.getElementById('alert')
    element!.classList.remove('success')
    setTimeout(()=>{element!.classList.add('success')}, 1)

  }



}
