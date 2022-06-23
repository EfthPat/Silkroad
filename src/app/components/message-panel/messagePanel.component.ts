import { Component, OnInit } from '@angular/core';
import {MessageThumbnail} from "../../interfaces/MessageThumbnail";
import {RequestService} from "../../services/request.service";
import {AuthService} from "../../services/auth.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MessageDialogComponent} from "../message-dialog/message-dialog.component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-message-navigation-panel',
  templateUrl: './messagePanel.component.html',
  styleUrls: ['./messagePanel.component.css']
})
export class MessagePanelComponent implements OnInit {

  messageThumbnails: MessageThumbnail[]
  toDelete: Boolean[]

  sent : boolean
  username : string

  // pagination
  pageSize: number
  pageIndex: number
  totalPages: number

  constructor(private route: ActivatedRoute, private dialog: MatDialog, private requestService: RequestService,
              private authService : AuthService) {

    this.toDelete = []
    this.username = this.authService.getUsername()!
    this.messageThumbnails = []

    // if we 're in outbox,'true' is passed as a parameter, and for message-navigation-panel 'false'
    this.sent = this.route.snapshot.data[0]

    // pagination
    this.pageSize = 6
    this.pageIndex = 0
    this.totalPages = 0

  }

  ngOnInit(): void {
    this.getMessages(this.username,1,this.pageSize,this.sent)
  }

  markMessage(index : number) : void {
    this.toDelete[index] ? this.toDelete[index] = false : this.toDelete[index]=true
  }

  getMessages(username: string, pageIndex: number, pageSize: number, sent:boolean) : void{

    this.toDelete = []
    this.messageThumbnails = []

    this.requestService.getMessages(username,pageIndex,pageSize,sent).subscribe(
      // if received messages were fetched successfully from the server
      response => {

        // fill the message thumbnail array
        for(let thumbnail of response.objects)
        {
          this.messageThumbnails.push(thumbnail)
          this.toDelete.push(false)
        }

        // update total pages
        this.totalPages = response.totalPages

        //update page index
        pageIndex>this.totalPages ? this.pageIndex = this.totalPages : this.pageIndex = pageIndex

      },
      // if message fetching failed
      error => {}

    )

  }

  getPreviousPage(): void {
    if(this.pageIndex>1)
      this.getMessages(this.username,this.pageIndex-1,this.pageSize, this.sent)
  }

  getNextPage(): void {
    if(this.pageIndex<this.totalPages)
      this.getMessages(this.username,this.pageIndex+1,this.pageSize, this.sent)

  }


  // wrapper
  deleteMessages() : void{
    if(this.toDelete.length)
      this.delMsgs(0)
  }

  // delete messages recursively to ensure callbacks are called in order
  delMsgs(index : number) : void{

    if(index<this.toDelete.length)
    {
      if(this.toDelete[index])
        this.requestService.deleteMessage(this.username,this.messageThumbnails[index].id).subscribe(() =>{this.delMsgs(index+1)})
      else
        this.delMsgs(index+1)
    }
    else
      this.getMessages(this.username,1,this.pageSize,this.sent)

  }


  viewMessage(index: number) : void{

    if(!this.sent && !this.messageThumbnails[index].read)
      this.readMessage(index)

    let dialogConfig = new MatDialogConfig();


    dialogConfig.data = {
      sent: this.sent,
      from: this.messageThumbnails[index].sender,
      to:  this.messageThumbnails[index].recipient,
      subject: this.messageThumbnails[index].title,
      paragraph: this.messageThumbnails[index].body
    }

    dialogConfig.autoFocus = true;

    this.dialog.open(MessageDialogComponent, dialogConfig);
  }

  readMessage(index : number) : void{
    this.messageThumbnails[index].read = true
    this.requestService.readMessage(this.username,this.messageThumbnails[index].id).subscribe(
      // if message was read successfully
      response =>{},
      // if message couldn't be read
      error => {}
    )
  }


}
