import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-auction-deletion-dialog',
  templateUrl: './auctionDeletionDialog.html',
  styleUrls: ['./auctionDeletionDialog.css']
})
export class AuctionDeletionDialog implements OnInit {

  message: string
  toDelete: boolean


  constructor(private dialogRef: MatDialogRef<AuctionDeletionDialog>, @Inject(MAT_DIALOG_DATA) data : any) {
    data && data.message ? this.message = data.message : this.message = "Are you sure?"
    this.toDelete = false
  }

  ngOnInit(): void {}

  getUserReply(toDelete: boolean) : void{
    this.toDelete = toDelete
    this.dialogRef.close(this.toDelete)
  }

}
